import { registerWebModule, NativeModule } from 'expo';
import type { ImpactStyle, NotificationType } from './MomentumHaptics.types';

// Web: no physical feedback available — silently no-op so call sites are unconditional.
class MomentumHapticsModule extends NativeModule {
  async impact(_style: ImpactStyle): Promise<void> {}
  async notification(_type: NotificationType): Promise<void> {}
}

export default registerWebModule(MomentumHapticsModule, 'MomentumHaptics');
