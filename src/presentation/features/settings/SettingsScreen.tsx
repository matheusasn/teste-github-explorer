import { ScrollView, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@presentation/theme/ThemeContext';
import type { SettingsStackParamList } from '@presentation/navigation/types';
import { SettingsGroup } from './components/SettingsGroup';
import { SettingsRow } from './components/SettingsRow';

type NavProp = NativeStackNavigationProp<SettingsStackParamList, 'Settings'>;

const APPEARANCE_LABEL: Record<'system' | 'light' | 'dark', string> = {
  system: 'Automático',
  light: 'Claro',
  dark: 'Escuro',
};

export function SettingsScreen() {
  const { colors, spacing, preference } = useTheme();
  const navigation = useNavigation<NavProp>();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl, paddingBottom: spacing.xxxl }}
    >
      <SettingsGroup title="Aparência">
        <SettingsRow
          icon={<Feather name="moon" size={16} color={colors.primaryContrast} />}
          iconBg={colors.info}
          label="Tema"
          value={APPEARANCE_LABEL[preference]}
          onPress={() => navigation.navigate('Appearance')}
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title="Sobre o app">
        <SettingsRow
          icon={<Feather name="layers" size={16} color={colors.primaryContrast} />}
          iconBg={colors.success}
          label="Design System"
          onPress={() => navigation.navigate('Showcase')}
        />
        <SettingsRow
          icon={<Feather name="github" size={16} color={colors.primaryContrast} />}
          iconBg={colors.text}
          label="Versão"
          value="1.0.0"
          showChevron={false}
          isLast
          trailing={<View />}
        />
      </SettingsGroup>
    </ScrollView>
  );
}
