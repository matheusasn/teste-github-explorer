import { Input } from '@presentation/components/ds/Input';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder="Buscar repositórios... (ex: react native)"
      autoCorrect={false}
      autoCapitalize="none"
      returnKeyType="search"
    />
  );
}
