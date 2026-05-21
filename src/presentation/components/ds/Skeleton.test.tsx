import { renderWithTheme } from '@test-utils/renderWithTheme';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renderiza sem quebrar', () => {
    renderWithTheme(<Skeleton />);
  });

  it('aceita width e height customizados', () => {
    renderWithTheme(<Skeleton width={200} height={20} />);
  });

  it('aceita os 4 raios', () => {
    renderWithTheme(<Skeleton radius="sm" />);
    renderWithTheme(<Skeleton radius="md" />);
    renderWithTheme(<Skeleton radius="lg" />);
    renderWithTheme(<Skeleton radius="full" />);
  });
});
