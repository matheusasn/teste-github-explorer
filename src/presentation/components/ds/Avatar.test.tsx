import { renderWithTheme } from '@test-utils/renderWithTheme';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('mostra a image quando uri é fornecida', () => {
    const { getByTestId } = renderWithTheme(<Avatar uri="https://x.test/a.png" testID="avatar" />);
    const avatar = getByTestId('avatar');
    expect(avatar.props.source.uri).toBe('https://x.test/a.png');
  });

  it('mostra iniciais quando não tem uri', () => {
    const { getByText } = renderWithTheme(<Avatar name="Matheus Augusto" />);
    expect(getByText('MA')).toBeTruthy();
  });

  it('mostra "?" quando não tem uri nem name', () => {
    const { getByText } = renderWithTheme(<Avatar />);
    expect(getByText('?')).toBeTruthy();
  });

  it('pega só as 2 primeiras letras quando o name é uma palavra só', () => {
    const { getByText } = renderWithTheme(<Avatar name="facebook" />);
    expect(getByText('FA')).toBeTruthy();
  });
});
