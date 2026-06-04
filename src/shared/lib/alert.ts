/**
 * Cross-platform alert helpers.
 * Alert.alert is a no-op in react-native-web 0.21, so we route web calls
 * through the browser's built-in synchronous dialogs instead.
 */
import { Alert, Platform } from 'react-native';

// Type-safe access to browser globals without requiring the DOM lib.
type BrowserGlobal = { confirm(msg: string): boolean; alert(msg: string): void };
const browser = globalThis as unknown as BrowserGlobal;

export function confirmAlert(options: {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
}) {
  const { title, message, confirmLabel = 'Confirm', onConfirm } = options;

  if (Platform.OS === 'web') {
    if (browser.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
    return;
  }

  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}

export function infoAlert(title: string, message: string) {
  if (Platform.OS === 'web') {
    browser.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
}
