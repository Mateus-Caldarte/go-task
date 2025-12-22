import { ITaskFormControls } from './task-form-controls.interface';

export interface IfomrModalData {
  mode: 'create' | 'edit';
  formValues: ITaskFormControls;
}
