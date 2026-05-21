import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';
import { useTheme } from '@presentation/theme/ThemeContext';
import { Text } from '@presentation/components/ds/Text';
import { ShowcaseScreen } from '@presentation/screens/ShowcaseScreen';
import { SearchScreen } from '@presentation/features/search/SearchScreen';
import { RepoDetailScreen } from '@presentation/features/repo-detail/RepoDetailScreen';
import { IssuesScreen } from '@presentation/features/issues/IssuesScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function ShowcaseHeaderButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Text variant="label" color="primary">
        DS
      </Text>
    </Pressable>
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
          colors: {
            ...DefaultTheme.colors,
            background: colors.background,
            card: colors.surface,
          },
        };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
        }}
      >
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={({ navigation }) => ({
            title: 'GitHub Explorer',
            headerRight: () => (
              <ShowcaseHeaderButton onPress={() => navigation.navigate('Showcase')} />
            ),
          })}
        />
        <Stack.Screen
          name="RepoDetail"
          component={RepoDetailScreen}
          options={({ route }) => ({ title: `${route.params.owner}/${route.params.repoName}` })}
        />
        <Stack.Screen
          name="Issues"
          component={IssuesScreen}
          options={({ route }) => ({ title: `Issues · ${route.params.repoFullName}` })}
        />
        <Stack.Screen name="Showcase" component={ShowcaseScreen} options={{ title: 'Showcase' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
