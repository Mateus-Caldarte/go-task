import { TaskStatus } from '../enums/task-status.enum';

export type TaskStatusType =
  | TaskStatus.TODO
  | TaskStatus.DOING
  | TaskStatus.DONE;
