import { ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, type ThemePreference } from '@presentation/theme/ThemeContext';
import { SettingsGroup } from './components/SettingsGroup';
import { SettingsRow } from './components/SettingsRow';

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Automático' },
  { value: 'dark', label: 'Escuro' },
  { value: 'light', label: 'Claro' },
];

export function AppearanceScreen() {
  const { colors, spacing, preference, setPreference } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl }}
    >
      <SettingsGroup footer="Automático segue a configuração de aparência do seu dispositivo.">
        {OPTIONS.map((opt, i) => (
          <SettingsRow
            key={opt.value}
            label={opt.label}
            onPress={() => setPreference(opt.value)}
            showChevron={false}
            isLast={i === OPTIONS.length - 1}
            trailing={
              preference === opt.value ? (
                <Feather name="check" size={20} color={colors.info} />
              ) : null
            }
          />
        ))}
      </SettingsGroup>
    </ScrollView>
  );
}
