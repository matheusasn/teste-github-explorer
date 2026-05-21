import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Showcase: undefined;
  Search: undefined;
  RepoDetail: { owner: string; repoName: string };
  Issues: { owner: string; repoName: string; repoFullName: string };
};

export type ShowcaseScreenProps = NativeStackScreenProps<RootStackParamList, 'Showcase'>;
export type SearchScreenProps = NativeStackScreenProps<RootStackParamList, 'Search'>;
export type RepoDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'RepoDetail'>;
export type IssuesScreenProps = NativeStackScreenProps<RootStackParamList, 'Issues'>;
