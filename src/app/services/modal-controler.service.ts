import { inject, Injectable, model } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TaskFormModalComponent } from '../components/task-form-modal/task-form-modal.component';
import { TaskCommentsModalComponent } from '../components/task-comments-modal/task-comments-modal.component';

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
    return this._dialog.open(TaskFormModalComponent, {
      ...this.modalSizeOptions,
      data: {
        mode: 'create',
      },
    });
  }

  openEditTaskModal() {
    return this._dialog.open(TaskFormModalComponent, {
      ...this.modalSizeOptions,
      data: {
        model: 'edit',
      },
    });
  }

  openTaskCommentsModal() {
    return this._dialog.open(TaskCommentsModalComponent, {
      ...this.modalSizeOptions,
    });
  }
}
