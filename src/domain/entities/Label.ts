import type { LabelId } from '@domain/types';

export interface Label {
  id: LabelId;
  name: string;
  color: string;
}
