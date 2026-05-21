import { fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '@test-utils/renderWithTheme';
import { Button } from './Button';

describe('Button', () => {
  it('renderiza o label', () => {
    const { getByText } = renderWithTheme(<Button label="Buscar" onPress={() => {}} />);
    expect(getByText('Buscar')).toBeTruthy();
  });

  it('chama onPress ao clicar', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(<Button label="Buscar" onPress={onPress} />);
    fireEvent.press(getByText('Buscar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não chama onPress quando disabled', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(<Button label="Buscar" onPress={onPress} disabled />);
    fireEvent.press(getByText('Buscar'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('mostra spinner em loading e esconde o label', () => {
    const { queryByText } = renderWithTheme(<Button label="Buscar" onPress={() => {}} loading />);
    expect(queryByText('Buscar')).toBeNull();
  });

  it('não chama onPress quando loading', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<Button label="Buscar" onPress={onPress} loading />);
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('aceita as 3 variants sem quebrar', () => {
    renderWithTheme(<Button label="a" onPress={() => {}} variant="primary" />);
    renderWithTheme(<Button label="b" onPress={() => {}} variant="secondary" />);
    renderWithTheme(<Button label="c" onPress={() => {}} variant="ghost" />);
  });
});
