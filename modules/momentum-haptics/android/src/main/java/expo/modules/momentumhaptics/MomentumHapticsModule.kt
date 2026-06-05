package expo.modules.momentumhaptics

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MomentumHapticsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MomentumHaptics")

    // impact(style) — maps amplitude to a short vibration burst.
    // Duration / amplitude chosen to approximate UIImpactFeedbackGenerator feel.
    AsyncFunction("impact") { style: String ->
      val (duration, amplitude) = when (style) {
        "light" -> 30L to 60
        "heavy" -> 60L to 220
        else    -> 45L to 120 // medium
      }
      vibrate(duration, amplitude)
    }

    // notification(type) — pattern vibration to communicate semantic meaning.
    AsyncFunction("notification") { type: String ->
      val pattern = when (type) {
        "success" -> longArrayOf(0, 40, 60, 40)
        "warning" -> longArrayOf(0, 60, 40, 80)
        else      -> longArrayOf(0, 80, 50, 80, 50, 80) // error
      }
      vibratePattern(pattern)
    }
  }

  private fun vibrate(durationMs: Long, amplitude: Int) {
    val vibrator = getVibrator() ?: return
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val clampedAmplitude = amplitude.coerceIn(1, 255)
      vibrator.vibrate(VibrationEffect.createOneShot(durationMs, clampedAmplitude))
    } else {
      @Suppress("DEPRECATION")
      vibrator.vibrate(durationMs)
    }
  }

  private fun vibratePattern(pattern: LongArray) {
    val vibrator = getVibrator() ?: return
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1))
    } else {
      @Suppress("DEPRECATION")
      vibrator.vibrate(pattern, -1)
    }
  }

  private fun getVibrator(): Vibrator? {
    val ctx = appContext.reactContext ?: return null
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      (ctx.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager)?.defaultVibrator
    } else {
      @Suppress("DEPRECATION")
      ctx.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
    }
  }
}
