import { TaskStatusType } from '../types/task-status';
import { Icomment } from './comment.interface';

export interface Itask {
  id: number | string;
  name: string;
  description?: string;
  commnets?: Icomment[];
  status: TaskStatusType;
}
