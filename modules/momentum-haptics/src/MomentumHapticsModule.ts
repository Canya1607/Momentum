import { NativeModule, requireNativeModule } from 'expo';
import type { ImpactStyle, NotificationType } from './MomentumHaptics.types';

declare class MomentumHapticsModule extends NativeModule {
  /** Trigger a physical impact sensation. */
  impact(style: ImpactStyle): Promise<void>;
  /** Trigger a semantic notification sensation. */
  notification(type: NotificationType): Promise<void>;
}

export default requireNativeModule<MomentumHapticsModule>('MomentumHaptics');
