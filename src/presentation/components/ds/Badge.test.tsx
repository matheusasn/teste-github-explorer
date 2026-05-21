import { renderWithTheme } from '@test-utils/renderWithTheme';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renderiza o label', () => {
    const { getByText } = renderWithTheme(<Badge label="bug" />);
    expect(getByText('bug')).toBeTruthy();
  });

  it('aceita todos os tones sem quebrar', () => {
    const tones = ['neutral', 'primary', 'success', 'warning', 'danger', 'info'] as const;
    tones.forEach((tone) => {
      renderWithTheme(<Badge label={tone} tone={tone} />);
    });
  });

  it('aceita os 2 sizes', () => {
    renderWithTheme(<Badge label="sm" size="sm" />);
    renderWithTheme(<Badge label="md" size="md" />);
  });
});
