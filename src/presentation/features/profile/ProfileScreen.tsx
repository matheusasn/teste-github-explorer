import { Linking, ScrollView, View, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Avatar } from '@presentation/components/ds/Avatar';
import { Button } from '@presentation/components/ds/Button';
import { Card } from '@presentation/components/ds/Card';
import { Skeleton } from '@presentation/components/ds/Skeleton';
import { Text } from '@presentation/components/ds/Text';
import { useTheme } from '@presentation/theme/ThemeContext';
import { useAuthenticatedUser } from './hooks/useAuthenticatedUser';

function ProfileSkeleton() {
  const { spacing } = useTheme();
  return (
    <View style={{ padding: spacing.lg, gap: spacing.lg, alignItems: 'center' }}>
      <Skeleton width={96} height={96} radius="full" />
      <View style={{ gap: spacing.sm, alignItems: 'center', width: '100%' }}>
        <Skeleton width="60%" height={22} />
        <Skeleton width="40%" height={16} />
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.md, width: '100%' }}>
        <Skeleton height={70} radius="md" />
        <Skeleton height={70} radius="md" />
        <Skeleton height={70} radius="md" />
      </View>
    </View>
  );
}

function StatBlock({ value, label }: { value: number; label: string }) {
  const { spacing } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Card variant="muted">
        <View style={{ alignItems: 'center', gap: spacing.xs }}>
          <Text variant="title">{value.toLocaleString('pt-BR')}</Text>
          <Text variant="caption" color="textMuted">
            {label.toUpperCase()}
          </Text>
        </View>
      </Card>
    </View>
  );
}

export function ProfileScreen() {
  const { colors, spacing } = useTheme();
  const { user, isLoading, isRefreshing, error, isUnauthorized, refresh, retry } =
    useAuthenticatedUser();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ProfileSkeleton />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          padding: spacing.xl,
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.md,
        }}
      >
        <Text variant="heading" color="danger">
          {isUnauthorized ? 'Token inválido' : 'Ops!'}
        </Text>
        <Text color="textMuted" align="center">
          {error}
        </Text>
        {!isUnauthorized && <Button label="Tentar novamente" onPress={retry} variant="secondary" />}
      </View>
    );
  }

  if (!user) return null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: spacing.lg,
        gap: spacing.xl,
        paddingBottom: spacing.xxxl,
      }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.primary} />
      }
    >
      <View style={{ alignItems: 'center', gap: spacing.md }}>
        <Avatar uri={user.avatarUrl} name={user.login} size="lg" />
        <View style={{ alignItems: 'center', gap: spacing.xxs }}>
          {user.name && <Text variant="title">{user.name}</Text>}
          <Text variant="body" color="textMuted">
            @{user.login}
          </Text>
        </View>

        {user.bio && (
          <Text variant="body" align="center">
            {user.bio}
          </Text>
        )}

        {user.location && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <Feather name="map-pin" size={14} color={colors.textMuted} />
            <Text variant="caption" color="textMuted">
              {user.location}
            </Text>
          </View>
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <StatBlock value={user.publicRepos} label="repos" />
        <StatBlock value={user.followers} label="seguidores" />
        <StatBlock value={user.following} label="seguindo" />
      </View>

      <Button
        label="Abrir no GitHub"
        variant="secondary"
        onPress={() => Linking.openURL(user.htmlUrl)}
      />
    </ScrollView>
  );
}
