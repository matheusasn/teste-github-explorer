import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@presentation/components/ds/Text';
import { Button } from '@presentation/components/ds/Button';
import { Input } from '@presentation/components/ds/Input';
import { Card } from '@presentation/components/ds/Card';
import { Badge } from '@presentation/components/ds/Badge';
import { Avatar } from '@presentation/components/ds/Avatar';
import { Skeleton } from '@presentation/components/ds/Skeleton';
import { useTheme } from '@presentation/theme/ThemeContext';

function Section({ title, children }: { title: string; children: ReactNode }) {
  const { spacing } = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      <Text variant="heading" color="textMuted">
        {title.toUpperCase()}
      </Text>
      <View style={{ gap: spacing.md }}>{children}</View>
    </View>
  );
}

function Row({ children, gap = 8 }: { children: ReactNode; gap?: number }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap }}>
      {children}
    </View>
  );
}

export function ShowcaseScreen() {
  const { colors, spacing, mode } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl, paddingBottom: spacing.xxxl }}
    >
      {/* Header */}
      <View style={{ gap: spacing.sm }}>
        <Text variant="display">Design System</Text>
        <Text color="textMuted">Tema ativo: {mode}</Text>
      </View>

      {/* Typography */}
      <Section title="Typography">
        <Text variant="display">Display 28</Text>
        <Text variant="title">Title 20</Text>
        <Text variant="heading">Heading 16</Text>
        <Text variant="body">Body 14 — texto corrido padrão da maior parte da UI.</Text>
        <Text variant="caption" color="textMuted">
          Caption 12 — datas, metadados, hints.
        </Text>
        <Text variant="label" color="textMuted">
          LABEL 12 BOLD
        </Text>
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <Row>
          <Button label="Primary" onPress={() => {}} />
          <Button label="Secondary" onPress={() => {}} variant="secondary" />
          <Button label="Ghost" onPress={() => {}} variant="ghost" />
        </Row>
        <Row>
          <Button label="Small" onPress={() => {}} size="sm" />
          <Button label="Medium" onPress={() => {}} size="md" />
          <Button label="Large" onPress={() => {}} size="lg" />
        </Row>
        <Row>
          <Button label="Loading" onPress={() => {}} loading />
          <Button label="Disabled" onPress={() => {}} disabled />
        </Row>
      </Section>

      {/* Inputs */}
      <Section title="Inputs">
        <Input placeholder="Digite algo..." />
        <Input label="Email" placeholder="seu@email.com" />
        <Input label="Senha" placeholder="••••••" helperText="Mínimo 8 caracteres" />
        <Input label="Username" defaultValue="matheus" error="Já está em uso" />
      </Section>

      {/* Cards */}
      <Section title="Cards">
        <Card>
          <Text variant="heading">Card estático</Text>
          <Text color="textMuted">Sem onPress — só estrutura.</Text>
        </Card>
        <Card onPress={() => {}}>
          <Text variant="heading">Card pressable</Text>
          <Text color="textMuted">Tem onPress — vira Pressable com feedback.</Text>
        </Card>
        <Card variant="muted">
          <Text variant="heading">Card muted</Text>
          <Text color="textMuted">Usa surfaceMuted no fundo.</Text>
        </Card>
      </Section>

      {/* Badges */}
      <Section title="Badges">
        <Row>
          <Badge label="neutral" tone="neutral" />
          <Badge label="primary" tone="primary" />
          <Badge label="success" tone="success" />
          <Badge label="warning" tone="warning" />
          <Badge label="danger" tone="danger" />
          <Badge label="info" tone="info" />
        </Row>
        <Row>
          <Badge label="sm" size="sm" />
          <Badge label="medium" size="md" />
        </Row>
      </Section>

      {/* Avatars */}
      <Section title="Avatars">
        <Row gap={12}>
          <Avatar uri="https://avatars.githubusercontent.com/u/9919?v=4" size="xs" />
          <Avatar uri="https://avatars.githubusercontent.com/u/9919?v=4" size="sm" />
          <Avatar uri="https://avatars.githubusercontent.com/u/9919?v=4" size="md" />
          <Avatar uri="https://avatars.githubusercontent.com/u/9919?v=4" size="lg" />
        </Row>
        <Row gap={12}>
          <Avatar name="Matheus Augusto" size="md" />
          <Avatar name="facebook" size="md" />
          <Avatar size="md" />
        </Row>
      </Section>

      {/* Skeletons */}
      <Section title="Skeletons">
        <Skeleton width="100%" height={20} />
        <Row gap={12}>
          <Skeleton width={48} height={48} radius="full" />
          <View style={{ flex: 1, gap: 8 }}>
            <Skeleton width="80%" height={14} />
            <Skeleton width="60%" height={12} />
          </View>
        </Row>
      </Section>
    </ScrollView>
  );
}
