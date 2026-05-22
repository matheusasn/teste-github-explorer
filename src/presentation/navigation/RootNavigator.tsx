import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@presentation/theme/ThemeContext';
import { SearchScreen } from '@presentation/features/search/SearchScreen';
import { RepoDetailScreen } from '@presentation/features/repo-detail/RepoDetailScreen';
import { IssuesScreen } from '@presentation/features/issues/IssuesScreen';
import { SettingsScreen } from '@presentation/features/settings/SettingsScreen';
import { AppearanceScreen } from '@presentation/features/settings/AppearanceScreen';
import { ProfileScreen } from '@presentation/features/profile/ProfileScreen';
import { ShowcaseScreen } from '@presentation/screens/ShowcaseScreen';
import type { ExploreStackParamList, RootTabParamList, SettingsStackParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const ExploreStack = createNativeStackNavigator<ExploreStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

const HAS_TOKEN = !!process.env.EXPO_PUBLIC_GITHUB_TOKEN;

function ExploreNavigator() {
  const { colors } = useTheme();
  return (
    <ExploreStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <ExploreStack.Screen name="Search" component={SearchScreen} options={{ title: 'Explorar' }} />
      <ExploreStack.Screen
        name="RepoDetail"
        component={RepoDetailScreen}
        options={({ route }) => ({ title: `${route.params.owner}/${route.params.repoName}` })}
      />
      <ExploreStack.Screen
        name="Issues"
        component={IssuesScreen}
        options={({ route }) => ({ title: `Issues · ${route.params.repoFullName}` })}
      />
    </ExploreStack.Navigator>
  );
}

function SettingsNavigator() {
  const { colors } = useTheme();
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Ajustes' }}
      />
      <SettingsStack.Screen
        name="Appearance"
        component={AppearanceScreen}
        options={{ title: 'Aparência' }}
      />
      <SettingsStack.Screen
        name="Showcase"
        component={ShowcaseScreen}
        options={{ title: 'Design System' }}
      />
    </SettingsStack.Navigator>
  );
}

function ProfileNavigator() {
  const { colors } = useTheme();
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <SettingsStack.Screen
        name="Settings"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </SettingsStack.Navigator>
  );
}

export function RootNavigator() {
  const { mode, colors } = useTheme();

  const navTheme =
    mode === 'dark'
      ? {
          ...DarkTheme,
          colors: { ...DarkTheme.colors, background: colors.background, card: colors.surface },
        }
      : {
          ...DefaultTheme,
          colors: { ...DefaultTheme.colors, background: colors.background, card: colors.surface },
        };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.borderMuted,
          },
          tabBarActiveTintColor: colors.info,
          tabBarInactiveTintColor: colors.textMuted,
        }}
      >
        <Tab.Screen
          name="ExploreTab"
          component={ExploreNavigator}
          options={{
            title: 'Explorar',
            tabBarIcon: ({ color, size }) => <Feather name="search" size={size} color={color} />,
          }}
        />
        {HAS_TOKEN && (
          <Tab.Screen
            name="ProfileTab"
            component={ProfileNavigator}
            options={{
              title: 'Perfil',
              tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
            }}
          />
        )}
        <Tab.Screen
          name="SettingsTab"
          component={SettingsNavigator}
          options={{
            title: 'Ajustes',
            tabBarIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
