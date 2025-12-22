import { inject, Injectable, model } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TaskFormModalComponent } from '../components/task-form-modal/task-form-modal.component';
import { TaskCommentsModalComponent } from '../components/task-comments-modal/task-comments-modal.component';
import { ITaskFormControls } from '../interfaces/task-form-controls.interface';

@Injectable({
  providedIn: 'root',
})
export class modalControlerService {
  private readonly modalSizeOptions = {
    maxWidth: '95%',
    width: '600px',
    panelClass: 'rounded-2xl',
  };
  private readonly _dialog = inject(Dialog);

  openNewTaskModal() {
    return this._dialog.open<ITaskFormControls>(TaskFormModalComponent, {
      ...this.modalSizeOptions,
      disableClose: true,
      data: {
        mode: 'create',
        formValues: {
          name: '',
          description: '',
        },
      },
    });
  }

  openEditTaskModal(formValues: ITaskFormControls) {
    return this._dialog.open<ITaskFormControls>(TaskFormModalComponent, {
      ...this.modalSizeOptions,
      disableClose: true,
      data: {
        model: 'edit',
        formValues,
      },
    });
  }

  openTaskCommentsModal() {
    return this._dialog.open(TaskCommentsModalComponent, {
      ...this.modalSizeOptions,
    });
  }
}
