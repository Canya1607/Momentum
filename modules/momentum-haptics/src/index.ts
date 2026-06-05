/**
 * MomentumHaptics — local Expo Module (Task 16).
 *
 * iOS:     UIImpactFeedbackGenerator / UINotificationFeedbackGenerator
 * Android: VibrationEffect (API 26+) with Vibrator fallback
 * Web:     silent no-op (no physical feedback on browsers)
 *
 * DEMO BOUNDARY: this module compiles and runs only in native builds
 * (`npx expo run:ios` / `npx expo run:android`). The web module is a
 * registered no-op so imports are unconditional across platforms.
 */
export { default as MomentumHapticsModule } from './MomentumHapticsModule';
export type { ImpactStyle, NotificationType } from './MomentumHaptics.types';

import MomentumHapticsModule from './MomentumHapticsModule';
import type { ImpactStyle, NotificationType } from './MomentumHaptics.types';

/** Fire an impact haptic. Safe to call on any platform — no-ops on web. */
export function impact(style: ImpactStyle = 'medium'): void {
  MomentumHapticsModule.impact(style).catch(() => {});
}

/** Fire a notification haptic. Safe to call on any platform — no-ops on web. */
export function notification(type: NotificationType = 'success'): void {
  MomentumHapticsModule.notification(type).catch(() => {});
}
