import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { getItem, setItem } from '@/shared/storage';
import { useAuthStore } from '../store';

function avatarStorageKey(email: string | null) {
  return `@momentum/avatar/${email ?? 'anonymous'}`;
}

function emailToFilename(email: string | null) {
  return (email ?? 'anonymous').replace(/[^a-zA-Z0-9]/g, '_');
}

/**
 * Copy the picker's temporary URI into the app's document directory so
 * the path survives app restarts. Web is skipped — it has no persistent
 * file system, so the blob URI is stored as-is (session-only on web).
 */
async function persistImage(tempUri: string, email: string | null): Promise<string> {
  if (Platform.OS === 'web') {
    return tempUri;
  }
  const dest = new File(Paths.document, `avatar_${emailToFilename(email)}.jpg`);
  const source = new File(tempUri);
  await source.copy(dest, { overwrite: true });
  return dest.uri;
}

export const AVATAR_KEY = ['avatar'] as const;

export function useAvatar() {
  const email = useAuthStore(s => s.email);
  const queryClient = useQueryClient();
  const storageKey = avatarStorageKey(email);

  const { data: avatarUri } = useQuery({
    queryKey: [...AVATAR_KEY, email],
    queryFn: () => getItem(storageKey),
  });

  const { mutateAsync: pickAvatar, isPending: picking } = useMutation({
    mutationFn: async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        const permanentUri = await persistImage(result.assets[0].uri, email);
        await setItem(storageKey, permanentUri);
        return permanentUri;
      }
      return null;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [...AVATAR_KEY, email] }),
  });

  return { avatarUri, pickAvatar, picking };
}
