import { fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { renderWithTheme } from '@test-utils/renderWithTheme';
import { Card } from './Card';

describe('Card', () => {
  it('renderiza children', () => {
    const { getByText } = renderWithTheme(
      <Card>
        <Text>conteúdo</Text>
      </Card>,
    );
    expect(getByText('conteúdo')).toBeTruthy();
  });

  it('vira pressable quando onPress é fornecido', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWithTheme(
      <Card onPress={onPress} testID="card">
        <Text>clicável</Text>
      </Card>,
    );
    fireEvent.press(getByTestId('card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
