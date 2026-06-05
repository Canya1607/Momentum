/**
 * Onboarding carousel — entry point for unauthenticated users.
 * Inspired by Preply: solid background, stacked card visuals, bold headlines,
 * persistent CTA + ghost sign-in link. Auto-advances every 4 s.
 * Adapts to dark / light / system theme setting.
 */
import { useTheme, useThemeStore } from '@/services/theme';
import { Text } from '@/shared/ui/Text';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Resolves whether the currently active theme is dark.
function useIsDark(): boolean {
  const { preference } = useThemeStore();
  const system = useColorScheme();
  return preference === 'dark' || (preference === 'system' && system === 'dark');
}

// ─── Slide visuals ────────────────────────────────────────────────────────────

function HabitCardsVisual() {
  const { colors } = useTheme();
  const isDark = useIsDark();
  const cardBg = isDark ? colors.surface : '#fff';
  const cardText = isDark ? colors.text : '#0f172a';
  const streakText = isDark ? colors.textSecondary : '#64748b';

  return (
    <View style={styles.habitContainer}>
      <View style={[styles.habitCard, styles.cardBackLeft, { backgroundColor: cardBg }]}>
        <Ionicons name="book-outline" size={26} color={colors.primary} />
        <Text style={[styles.cardName, { color: cardText }]}>Read</Text>
      </View>

      <View style={[styles.habitCard, styles.cardFront, { backgroundColor: cardBg }]}>
        <View style={styles.cardRow}>
          <View style={styles.cardRowLeft}>
            <Ionicons name="walk-outline" size={26} color={colors.primary} />
            <View>
              <Text style={[styles.cardName, { color: cardText }]}>Run</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 3 }}>
                <Ionicons name="flame" size={11} color="#f97316" />
                <Text style={[styles.cardStreak, { color: streakText }]}>14 days</Text>
              </View>
            </View>
          </View>
          <View style={[styles.cardCheck, { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark" size={15} color="#fff" />
          </View>
        </View>
      </View>

      <View style={[styles.habitCard, styles.cardBackRight, { backgroundColor: cardBg }]}>
        <Ionicons name="water-outline" size={26} color={colors.primary} />
        <Text style={[styles.cardName, { color: cardText }]}>Hydrate</Text>
      </View>
    </View>
  );
}

const BAR_HEIGHTS = [40, 68, 52, 88, 62, 80, 44];
const BAR_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function StatsVisual() {
  const { colors } = useTheme();
  const isDark = useIsDark();
  const fillColor = isDark ? colors.primary : 'rgba(255,255,255,0.92)';
  const trackColor = isDark ? `${colors.primary}30` : 'rgba(255,255,255,0.2)';
  const labelColor = isDark ? `${colors.primary}bb` : 'rgba(255,255,255,0.65)';

  return (
    <View style={styles.statsContainer}>
      {BAR_HEIGHTS.map((h, i) => (
        <View key={i} style={styles.barColumn}>
          <View style={[styles.barTrack, { backgroundColor: trackColor }]}>
            <View style={[styles.barFill, { height: h, backgroundColor: fillColor }]} />
          </View>
          <Text style={[styles.barLabel, { color: labelColor }]}>{BAR_DAYS[i]}</Text>
        </View>
      ))}
    </View>
  );
}

function ProVisual() {
  const { colors } = useTheme();
  const isDark = useIsDark();
  const circleColor = isDark ? `${colors.primary}35` : 'rgba(255,255,255,0.22)';
  const glowColor = isDark ? `${colors.primary}18` : 'rgba(255,255,255,0.12)';
  const badgeColor = isDark ? `${colors.primary}35` : 'rgba(255,255,255,0.22)';

  return (
    <View style={styles.proContainer}>
      <View style={[styles.proGlow, { backgroundColor: glowColor }]} />
      <View style={[styles.proCircle, { backgroundColor: circleColor }]}>
        <Ionicons name="infinite-outline" size={44} color="#fff" />
      </View>
      <View style={[styles.proBadge, { backgroundColor: badgeColor }]}>
        <Text style={styles.proBadgeText}>PRO</Text>
      </View>
    </View>
  );
}

// ─── Slide data ───────────────────────────────────────────────────────────────

interface SlideData {
  id: string;
  headline: string;
  subtitle: string;
  Visual: React.ComponentType;
}

const SLIDES: SlideData[] = [
  {
    id: '1',
    headline: 'Build habits\nthat stick.',
    subtitle: 'Check off daily goals and grow streaks that keep you on track.',
    Visual: HabitCardsVisual,
  },
  {
    id: '2',
    headline: 'See your\nprogress.',
    subtitle: 'Beautiful stats show your consistency at a glance, week by week.',
    Visual: StatsVisual,
  },
  {
    id: '3',
    headline: 'Go further\nwith Pro.',
    subtitle: 'Unlimited habits, detailed insights, and custom themes — all yours.',
    Visual: ProVisual,
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function WelcomeScreen() {
  const { colors, spacing, radii } = useTheme();
  const isDark = useIsDark();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [currentIndex, setCurrentIndex] = useState(0);

  // Use a ref to gate state updates — onScroll fires continuously but we only
  // call setCurrentIndex when the rounded page index actually changes.
  const trackedIndex = useRef(0);
  function handleScroll(e: { nativeEvent: { contentOffset: { x: number } } }) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== trackedIndex.current && idx >= 0 && idx < SLIDES.length) {
      trackedIndex.current = idx;
      setCurrentIndex(idx);
    }
  }

  // Theme-derived palette
  const screenBg = isDark ? colors.background : colors.primary;
  const dotActive = isDark ? colors.primary : '#fff';
  const dotInactive = isDark ? `${colors.primary}50` : 'rgba(255,255,255,0.35)';
  const ctaBg = isDark ? colors.primary : '#fff';
  const ctaTextColor = isDark ? '#fff' : colors.primary;
  const signInColor = isDark ? `${colors.primary}cc` : 'rgba(255,255,255,0.75)';

  // One shared value per dot — hooks cannot be called in loops
  const dot0 = useSharedValue(20);
  const dot1 = useSharedValue(8);
  const dot2 = useSharedValue(8);
  const dot0Style = useAnimatedStyle(() => ({ width: dot0.value }));
  const dot1Style = useAnimatedStyle(() => ({ width: dot1.value }));
  const dot2Style = useAnimatedStyle(() => ({ width: dot2.value }));
  const dotStyles = [dot0Style, dot1Style, dot2Style];

  useEffect(() => {
    dot0.value = withSpring(currentIndex === 0 ? 20 : 8, { damping: 20, stiffness: 200 });
    dot1.value = withSpring(currentIndex === 1 ? 20 : 8, { damping: 20, stiffness: 200 });
    dot2.value = withSpring(currentIndex === 2 ? 20 : 8, { damping: 20, stiffness: 200 });
  }, [currentIndex, dot0, dot1, dot2]);

  function goToSignIn(returning = false) {
    router.push({ pathname: '/(auth)/sign-in', params: { returning: returning ? '1' : '0' } });
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: screenBg }]} edges={['top', 'bottom']}>
      <FlatList<SlideData>
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        style={{ flex: 1 }}
        renderItem={({ item }) => {
          const Visual = item.Visual;
          return (
            <View style={[styles.slide, { width, paddingHorizontal: spacing.xl }]}>
              <View style={styles.visualArea}>
                <Visual />
              </View>
              <Text variant="display" style={{ color: '#fff', marginBottom: spacing.sm }}>
                {item.headline}
              </Text>
              <Text variant="body" style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 24 }}>
                {item.subtitle}
              </Text>
            </View>
          );
        }}
      />

      <View style={[styles.bottom, { paddingHorizontal: spacing.lg, paddingBottom: spacing.md }]}>
        <View style={styles.dotsRow}>
          {dotStyles.map((dotStyle, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                dotStyle,
                { backgroundColor: i === currentIndex ? dotActive : dotInactive },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.ctaButton, { borderRadius: radii.lg, backgroundColor: ctaBg }]}
          onPress={() => goToSignIn(false)}
          activeOpacity={0.85}
        >
          <Text style={[styles.ctaLabel, { color: ctaTextColor }]}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => goToSignIn(true)} style={styles.signInLink}>
          <Text style={[styles.signInText, { color: signInColor }]}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles (layout only — colours applied inline) ────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },

  slide: { height: '100%', justifyContent: 'center' },
  visualArea: { alignItems: 'center', justifyContent: 'center', paddingVertical: 20, marginBottom: 8 },

  bottom: { paddingTop: 8 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 3 },
  ctaButton: { height: 52, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  ctaLabel: { fontSize: 16, fontWeight: '700' },
  signInLink: { alignItems: 'center', paddingVertical: 10 },
  signInText: { fontSize: 14, fontWeight: '500', textDecorationLine: 'underline' },

  // Habit cards
  habitContainer: { width: 280, height: 170, position: 'relative' },
  habitCard: {
    position: 'absolute',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 5,
  },
  cardBackLeft: {
    width: 155, height: 105, left: 0, top: 40, zIndex: 1,
    transform: [{ rotate: '-9deg' }],
    alignItems: 'center', justifyContent: 'center',
  },
  cardFront: {
    width: 200, height: 118, left: 55, top: 0, zIndex: 3,
    transform: [{ rotate: '3deg' }],
    justifyContent: 'center',
  },
  cardBackRight: {
    width: 120, height: 85, right: 0, top: 52, zIndex: 2,
    transform: [{ rotate: '11deg' }],
    alignItems: 'center', justifyContent: 'center',
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardName: { fontSize: 14, fontWeight: '600' },
  cardStreak: { fontSize: 11 },
  cardCheck: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },

  // Stats bars
  statsContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 4 },
  barColumn: { alignItems: 'center' },
  barTrack: { width: 28, height: 88, borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 8 },
  barLabel: { fontSize: 11, marginTop: 6 },

  // Pro visual
  proContainer: { alignItems: 'center', justifyContent: 'center' },
  proGlow: { position: 'absolute', width: 148, height: 148, borderRadius: 74 },
  proCircle: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: 'center', justifyContent: 'center', marginBottom: 18,
  },
  proBadge: { paddingHorizontal: 16, paddingVertical: 5, borderRadius: 99 },
  proBadgeText: { color: '#fff', fontWeight: '700', fontSize: 13, letterSpacing: 2 },
});
