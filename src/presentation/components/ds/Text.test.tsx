import { renderWithTheme } from '@test-utils/renderWithTheme';
import { Text } from './Text';

describe('Text', () => {
  it('renderiza o conteúdo', () => {
    const { getByText } = renderWithTheme(<Text>hello</Text>);
    expect(getByText('hello')).toBeTruthy();
  });

  it('aceita variants sem quebrar', () => {
    renderWithTheme(<Text variant="title">title</Text>);
    renderWithTheme(<Text variant="caption">caption</Text>);
  });

  it('aceita colors da paleta', () => {
    renderWithTheme(<Text color="danger">erro</Text>);
    renderWithTheme(<Text color="textMuted">muted</Text>);
  });
});
