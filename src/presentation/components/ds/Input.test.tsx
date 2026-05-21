import { fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '@test-utils/renderWithTheme';
import { Input } from './Input';

describe('Input', () => {
  it('mostra o label quando fornecido', () => {
    const { getByText } = renderWithTheme(<Input label="E-mail" />);
    expect(getByText('E-mail')).toBeTruthy();
  });

  it('mostra helperText quando não tem error', () => {
    const { getByText } = renderWithTheme(<Input helperText="ajuda" />);
    expect(getByText('ajuda')).toBeTruthy();
  });

  it('error tem precedência sobre helperText', () => {
    const { getByText, queryByText } = renderWithTheme(<Input helperText="ajuda" error="erro" />);
    expect(getByText('erro')).toBeTruthy();
    expect(queryByText('ajuda')).toBeNull();
  });

  it('chama onChangeText ao digitar', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="buscar" onChangeText={onChangeText} />,
    );
    fireEvent.changeText(getByPlaceholderText('buscar'), 'react');
    expect(onChangeText).toHaveBeenCalledWith('react');
  });
});
