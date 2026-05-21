import type { Owner } from './Owner';
import type { Label } from './Label';
import type { IssueId, IssueNumber } from '@domain/types';

export interface Issue {
  id: IssueId;
  number: IssueNumber;
  title: string;
  author: Owner;
  labels: Label[];
  createdAt: string;
  state: 'open' | 'closed';
}
