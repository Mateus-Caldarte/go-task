import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { IfomrModalData } from '../../interfaces/task-form-modal-data.interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ITaskFormControls } from '../../interfaces/task-form-controls.interface';

@Component({
  selector: 'app-task-form-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form-modal.component.html',
  styleUrl: './task-form-modal.component.css',
})
export class TaskFormModalComponent {
  readonly _data: IfomrModalData = inject(DIALOG_DATA);
  readonly _dialogRef = inject(DialogRef);

  taskform: FormGroup = new FormGroup({
    name: new FormControl(this._data.formValues.name, [Validators.required]),
    description: new FormControl(this._data.formValues.description, [
      Validators.required,
    ]),
  });

  closeModal(fromValues: ITaskFormControls | undefined = undefined) {
    this._dialogRef.close(fromValues);
  }

  onFormSubmit() {
    this.closeModal(this.taskform.value);
    console.log(this.taskform.value);
  }

  isNameFieldInvalid(): boolean {
    const nameControl = this.taskform.get('name');
    return !!(nameControl?.invalid && nameControl?.touched);
  }

  isDescriptionFieldInvalid(): boolean {
    const descriptionControl = this.taskform.get('description');
    return !!(descriptionControl?.invalid && descriptionControl?.touched);
  }
}
