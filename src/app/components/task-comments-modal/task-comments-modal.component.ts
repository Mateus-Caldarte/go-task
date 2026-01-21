import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-task-comments-modal',
  imports: [],
  templateUrl: './task-comments-modal.component.html',
  styleUrl: './task-comments-modal.component.css',
})
export class TaskCommentsModalComponent {
  readonly _task = inject(DIALOG_DATA);
  private readonly _dialogRef = inject(DialogRef);

  closeModal() {
    this._dialogRef.close();
  }
}
