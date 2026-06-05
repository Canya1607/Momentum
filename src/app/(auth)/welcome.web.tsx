/**
 * Web-only welcome screen.
 * Expo Router picks this file over welcome.tsx when bundling for web.
 * Uses a centered, single-page layout suited to large viewports instead
 * of the mobile paginated carousel.
 */
import { useTheme, useThemeStore } from '@/services/theme';
import { Text } from '@/shared/ui/Text';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

function useIsDark(): boolean {
  const { preference } = useThemeStore();
  const system = useColorScheme();
  return preference === 'dark' || (preference === 'system' && system === 'dark');
}

const FEATURES = [
  { icon: 'checkmark-circle-outline' as const, text: 'Daily check-offs and streak tracking' },
  { icon: 'bar-chart-outline' as const,        text: 'Stats and progress insights (Pro)' },
  { icon: 'infinite-outline' as const,         text: 'Unlimited habits with Momentum Pro' },
];

export default function WelcomeScreen() {
  const { colors, spacing, radii } = useTheme();
  const isDark = useIsDark();
  const router = useRouter();

  const bg       = isDark ? colors.background : colors.primary;
  const cardBg   = isDark ? colors.surface    : '#fff';
  const cardText = isDark ? colors.text       : '#0f172a';
  const ctaBg    = isDark ? colors.primary    : '#fff';
  const ctaText  = isDark ? '#fff'            : colors.primary;
  const mutedText = isDark ? colors.textSecondary : 'rgba(255,255,255,0.75)';
  const featureText = isDark ? colors.text : '#fff';

  function goToSignIn(returning = false) {
    router.push({ pathname: '/(auth)/sign-in', params: { returning: returning ? '1' : '0' } });
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: bg }}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>

        {/* Logo */}
        <Text style={[styles.logo, { color: ctaBg }]}>✦ Momentum</Text>

        {/* Hero visual — stacked habit cards */}
        <View style={[styles.card, { backgroundColor: cardBg, borderRadius: radii.xl }]}>
          <View style={styles.cardRow}>
            <View style={[styles.iconBadge, { backgroundColor: `${colors.primary}15`, borderRadius: radii.md }]}>
              <Ionicons name="walk-outline" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={[styles.cardHabitName, { color: cardText }]}>Morning run</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Ionicons name="flame" size={12} color="#f97316" />
                <Text style={[styles.cardStreak, { color: '#f97316' }]}>14 day streak</Text>
              </View>
            </View>
            <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
              <Ionicons name="checkmark" size={16} color="#fff" />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: isDark ? colors.border : '#f1f5f9' }]} />

          <View style={styles.cardRow}>
            <View style={[styles.iconBadge, { backgroundColor: `${colors.primary}15`, borderRadius: radii.md }]}>
              <Ionicons name="book-outline" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={[styles.cardHabitName, { color: cardText }]}>Read</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Ionicons name="flame" size={12} color="#f97316" />
                <Text style={[styles.cardStreak, { color: '#f97316' }]}>7 day streak</Text>
              </View>
            </View>
            <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
              <Ionicons name="checkmark" size={16} color="#fff" />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: isDark ? colors.border : '#f1f5f9' }]} />

          <View style={styles.cardRow}>
            <View style={[styles.iconBadge, { backgroundColor: `${colors.primary}15`, borderRadius: radii.md }]}>
              <Ionicons name="water-outline" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={[styles.cardHabitName, { color: cardText }]}>Drink water</Text>
              <Text style={[styles.cardStreak, { color: mutedText, marginTop: 2 }]}>Start today</Text>
            </View>
            <View style={[styles.checkCircle, { backgroundColor: 'transparent', borderWidth: 2, borderColor: isDark ? colors.border : '#e2e8f0' }]} />
          </View>
        </View>

        {/* Headline */}
        <Text style={[styles.headline, { color: isDark ? colors.text : '#fff' }]}>
          Build habits{'\n'}that stick.
        </Text>
        <Text style={[styles.subtitle, { color: mutedText }]}>
          Track daily goals, grow streaks, and stay consistent — on every device.
        </Text>

        {/* Feature list */}
        <View style={styles.features}>
          {FEATURES.map(({ icon, text }) => (
            <View key={text} style={styles.featureRow}>
              <Ionicons name={icon} size={18} color={isDark ? colors.primary : 'rgba(255,255,255,0.9)'} />
              <Text style={[styles.featureText, { color: featureText }]}>{text}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.cta, { backgroundColor: ctaBg, borderRadius: radii.lg }]}
          onPress={() => goToSignIn(false)}
          activeOpacity={0.85}
        >
          <Text style={[styles.ctaLabel, { color: ctaText }]}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => goToSignIn(true)} style={styles.signInLink}>
          <Text style={[styles.signInText, { color: mutedText }]}>Already have an account? Sign In</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  container: { width: '100%', maxWidth: 420, alignItems: 'stretch' },

  logo: { fontSize: 14, fontWeight: '700', letterSpacing: 1, marginBottom: 32, textAlign: 'center' },

  card: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  iconBadge: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  cardHabitName: { fontSize: 15, fontWeight: '600' },
  cardStreak: { fontSize: 12 },
  checkCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1 },

  headline: { fontSize: 40, fontWeight: '800', lineHeight: 48, marginBottom: 12 },
  subtitle: { fontSize: 16, lineHeight: 24, marginBottom: 28 },

  features: { gap: 12, marginBottom: 32 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontSize: 15, opacity: 0.9 },

  cta: { height: 52, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  ctaLabel: { fontSize: 16, fontWeight: '700' },
  signInLink: { alignItems: 'center', paddingVertical: 8 },
  signInText: { fontSize: 14, textDecorationLine: 'underline' },
});
