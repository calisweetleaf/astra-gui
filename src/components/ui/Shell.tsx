import { usePathname, useRouter } from 'expo-router';
import { useCallback, useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAstra } from '../../state/agent-store';
import { colors, fonts, layout, radius, space, type as typeScale } from '../../theme/tokens';
import { Icon, type IconName } from './Icon';
import { Sheet } from './Sheet';

export const WIDE_BREAKPOINT = 900;
const TOPBAR_HEIGHT = 56;

type ShellProps = {
  title: string;
  eyebrow?: string;
  back?: boolean;
  headerRight?: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  children: ReactNode;
};

type NavTarget = {
  key: string;
  href: string;
  label: string;
  caption?: string;
  icon: IconName;
  match: (pathname: string) => boolean;
  dimmed?: boolean;
  badge?: number;
};

export function Shell({ title, eyebrow, back = false, headerRight, footer, scroll = true, children }: ShellProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const wide = width >= WIDE_BREAKPOINT;

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, [router]);

  const header = (
    <View style={styles.pageHeader}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <View style={styles.titleRow}>
        <Text accessibilityRole="header" style={styles.pageTitle} numberOfLines={2}>
          {title}
        </Text>
        {headerRight}
      </View>
    </View>
  );

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: footer ? space.lg : insets.bottom + space.xxl }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.column}>
        {header}
        {children}
      </View>
    </ScrollView>
  ) : (
    <View style={[styles.flex, styles.column, styles.fixedColumn]}>
      {header}
      <View style={styles.flex}>{children}</View>
    </View>
  );

  const main = (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={wide ? insets.top : insets.top + TOPBAR_HEIGHT}
    >
      {body}
      {footer}
    </KeyboardAvoidingView>
  );

  if (wide) {
    return (
      <View style={[styles.root, styles.wideRoot, { paddingTop: insets.top }]}>
        <View style={[styles.sidebar, { paddingBottom: insets.bottom + space.lg }]}>
          <Wordmark />
          <NavList onNavigate={undefined} />
          <Text style={styles.sidebarNote}>PRIVATE · NATIVE · LOCAL FIRST</Text>
        </View>
        <View style={styles.flex}>
          {back ? (
            <View style={styles.wideBack}>
              <BackButton onPress={goBack} />
            </View>
          ) : null}
          {main}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top, height: insets.top + TOPBAR_HEIGHT }]}>
        <View style={styles.topBarScrim} />
        <View style={styles.topBarRow}>
          {back ? <BackButton onPress={goBack} /> : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open navigation"
            onPress={() => setNavOpen(true)}
            style={({ pressed }) => [styles.wordmarkButton, pressed && styles.pressed]}
          >
            <Wordmark />
            <Icon name="menu" size={18} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>
      {main}
      <Sheet visible={navOpen} title="Navigation" onClose={() => setNavOpen(false)}>
        <NavList onNavigate={() => setNavOpen(false)} />
      </Sheet>
    </View>
  );
}

function Wordmark() {
  return (
    <View style={styles.wordmark} accessible accessibilityLabel="Astra">
      <View style={styles.wordmarkGlyph}>
        {[0, 45, 90, 135].map(angle => <View key={angle} style={{ position: 'absolute', width: 23, height: 2, backgroundColor: colors.accent, transform: [{ rotate: `${angle}deg` }] }} />)}
      </View>
      <Text style={styles.wordmarkText}>astra</Text>
    </View>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={onPress}
      style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
    >
      <Icon name="arrow-left" size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

function NavList({ onNavigate }: { onNavigate: (() => void) | undefined }) {
  const router = useRouter();
  const pathname = usePathname();
  const { sessions, providers } = useAstra();
  const awaiting = sessions.filter((session) => session.status === 'awaiting-approval').length;

  const targets: NavTarget[] = [
    { key: 'deck', href: '/', label: 'Command deck', icon: 'grid', match: (p) => p === '/' },
    {
      key: 'approvals',
      href: '/approvals',
      label: 'Agent permissions',
      icon: 'shield',
      match: (p) => p.startsWith('/approvals'),
      badge: awaiting,
    },
    ...providers.map<NavTarget>((provider) => ({
      key: provider.id,
      href: `/agent/${provider.id}`,
      label: provider.name,
      caption: provider.status === 'planned' ? 'NOT CONNECTED' : provider.maker,
      icon: 'cpu',
      match: (p) => p.startsWith(`/agent/${provider.id}`),
      dimmed: provider.status === 'planned',
    })),
  ];

  return (
    <View style={styles.navList}>
      {targets.map((target) => {
        const active = target.match(pathname);
        return (
          <Pressable
            key={target.key}
            accessibilityRole="button"
            accessibilityLabel={target.label}
            accessibilityState={{ selected: active }}
            onPress={() => {
              onNavigate?.();
              if (!active) router.push(target.href as never);
            }}
            style={({ pressed }) => [
              styles.navItem,
              active && styles.navItemActive,
              target.dimmed && styles.navDimmed,
              pressed && styles.pressed,
            ]}
          >
            <Icon name={target.icon} size={18} color={active ? colors.accent : colors.textMuted} />
            <View style={styles.flex}>
              <Text style={[styles.navLabel, active && { color: colors.text }]} numberOfLines={1}>
                {target.label}
              </Text>
              {target.caption ? (
                <Text style={styles.navCaption} numberOfLines={1}>
                  {target.caption}
                </Text>
              ) : null}
            </View>
            {target.badge ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{target.badge}</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  wideRoot: {
    flexDirection: 'row',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  sidebar: {
    width: layout.sidebar,
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    gap: space.xl,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.hairline,
  },
  sidebarNote: {
    marginTop: 'auto',
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.textFaint,
  },
  wideBack: {
    paddingHorizontal: layout.gutter,
    paddingTop: space.sm,
    maxWidth: layout.maxContent,
    width: '100%',
    alignSelf: 'center',
  },
  topBar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  topBarScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.glass.secondary,
  },
  topBarRow: {
    height: TOPBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.sm,
  },
  wordmarkButton: {
    minHeight: layout.touch,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.md,
  },
  backButton: {
    width: layout.touch,
    height: layout.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  wordmarkGlyph: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.raised,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
  },
  wordmarkText: {
    fontFamily: fonts.display,
    fontSize: 26,
    letterSpacing: -1,
    color: colors.text,
  },
  navList: {
    gap: space.xs,
  },
  navItem: {
    minHeight: layout.touch,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: colors.raised,
    borderColor: colors.hairlineStrong,
  },
  navDimmed: {
    opacity: 0.85,
  },
  navLabel: {
    fontFamily: fonts.medium,
    fontSize: typeScale.base,
    color: colors.textMuted,
  },
  navCaption: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.textFaint,
  },
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warning,
  },
  badgeText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.canvas,
    fontVariant: ['tabular-nums'],
  },
  scrollContent: {
    paddingHorizontal: layout.gutter,
  },
  column: {
    width: '100%',
    maxWidth: layout.maxContent,
    alignSelf: 'center',
  },
  fixedColumn: {
    paddingHorizontal: layout.gutter,
  },
  pageHeader: {
    paddingTop: space.lg,
    paddingBottom: space.sm,
    gap: space.xs,
  },
  eyebrow: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  pageTitle: {
    flexShrink: 1,
    fontFamily: fonts.semibold,
    fontSize: typeScale.headline,
    color: colors.text,
  },
});
