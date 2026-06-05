import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/services/theme';
import { Text } from '@/shared/ui/Text';
import { useAvatar } from '../hooks/useAvatar';
import { useAuthStore } from '../store';

const SIZE = 64;
const BADGE_SIZE = 22;

export function AvatarPicker() {
  const { colors, radii } = useTheme();
  const email = useAuthStore(s => s.email);
  const { avatarUri, pickAvatar, picking } = useAvatar();

  // Derive initials from the email (first letter before @)
  const initial = email ? email[0]?.toUpperCase() ?? '?' : '?';

  return (
    <TouchableOpacity onPress={() => pickAvatar()} activeOpacity={0.75} disabled={picking}>
      <View style={styles.container}>
        {/* Avatar circle */}
        <View
          style={[
            styles.circle,
            { backgroundColor: `${colors.primary}22`, borderRadius: SIZE / 2, borderColor: colors.border, borderWidth: 1 },
          ]}
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={[styles.circle, { borderRadius: SIZE / 2 }]} />
          ) : (
            <Text style={{ fontSize: 26, fontWeight: '600', color: colors.primary }}>
              {initial}
            </Text>
          )}

          {picking && (
            <View style={[StyleSheet.absoluteFill, styles.loadingOverlay, { borderRadius: SIZE / 2, backgroundColor: `${colors.background}aa` }]}>
              <ActivityIndicator color={colors.primary} />
            </View>
          )}
        </View>

        {/* Camera badge */}
        <View
          style={[
            styles.badge,
            { backgroundColor: colors.primary, borderRadius: BADGE_SIZE / 2, borderColor: colors.background },
          ]}
        >
          <Ionicons name="camera" size={12} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { width: SIZE, height: SIZE, position: 'relative' },
  circle: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  loadingOverlay: { alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
