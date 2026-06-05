import ExpoModulesCore
import UIKit

// Native haptic feedback module for Momentum.
// Wraps UIImpactFeedbackGenerator and UINotificationFeedbackGenerator so that
// call sites in JS/TS remain platform-agnostic and work unconditionally.
public class MomentumHapticsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MomentumHaptics")

    // Trigger a physical impact sensation (check-off, drag snap, etc.)
    AsyncFunction("impact") { (style: String) in
      let feedbackStyle: UIImpactFeedbackGenerator.FeedbackStyle
      switch style {
      case "light":  feedbackStyle = .light
      case "heavy":  feedbackStyle = .heavy
      default:       feedbackStyle = .medium
      }
      await MainActor.run {
        let generator = UIImpactFeedbackGenerator(style: feedbackStyle)
        generator.prepare()
        generator.impactOccurred()
      }
    }

    // Trigger a semantic notification sensation (success on streak milestone, etc.)
    AsyncFunction("notification") { (type: String) in
      let feedbackType: UINotificationFeedbackGenerator.FeedbackType
      switch type {
      case "success": feedbackType = .success
      case "warning": feedbackType = .warning
      default:        feedbackType = .error
      }
      await MainActor.run {
        let generator = UINotificationFeedbackGenerator()
        generator.prepare()
        generator.notificationOccurred(feedbackType)
      }
    }
  }
}
