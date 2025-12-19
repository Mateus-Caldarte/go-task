import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { IfomrModalData } from '../../interfaces/task-form-modal-data.interface';

@Component({
  selector: 'app-task-form-modal',
  imports: [],
  templateUrl: './task-form-modal.component.html',
  styleUrl: './task-form-modal.component.css',
})
export class TaskFormModalComponent {
  readonly _data: IfomrModalData = inject(DIALOG_DATA);
  readonly _dialogRef = inject(Dialog);

  cloneModal() {
    this._dialogRef.closeAll();
  }
}
