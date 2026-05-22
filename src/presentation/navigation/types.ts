import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootTabParamList = {
  ExploreTab: undefined;
  ProfileTab: undefined;
  SettingsTab: undefined;
};

export type ExploreStackParamList = {
  Search: undefined;
  RepoDetail: { owner: string; repoName: string };
  Issues: { owner: string; repoName: string; repoFullName: string };
};

export type SettingsStackParamList = {
  Settings: undefined;
  Appearance: undefined;
  Showcase: undefined;
};

// Composição: dentro de uma screen do Explore stack, posso navegar pra outra
// screen do mesmo stack OU pra outra tab.
export type SearchScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ExploreStackParamList, 'Search'>,
  BottomTabScreenProps<RootTabParamList>
>;
export type RepoDetailScreenProps = NativeStackScreenProps<ExploreStackParamList, 'RepoDetail'>;
export type IssuesScreenProps = NativeStackScreenProps<ExploreStackParamList, 'Issues'>;

export type SettingsScreenProps = NativeStackScreenProps<SettingsStackParamList, 'Settings'>;
export type AppearanceScreenProps = NativeStackScreenProps<SettingsStackParamList, 'Appearance'>;
export type ShowcaseScreenProps = NativeStackScreenProps<SettingsStackParamList, 'Showcase'>;
