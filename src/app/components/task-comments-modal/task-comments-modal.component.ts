import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Icomment } from '../../interfaces/comment.interface';
import { generateUniqueIdWithTimestamp } from '../../utils/generate-unique-id-with-timestamp';

@Component({
  selector: 'app-task-comments-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-comments-modal.component.html',
  styleUrl: './task-comments-modal.component.css',
})
export class TaskCommentsModalComponent {
  readonly _task = inject(DIALOG_DATA);
  private readonly _dialogRef = inject(DialogRef);

  commentControl = new FormControl('', [Validators.required]);

  taskCommentsChanged = false;

  @ViewChild('commentInput') commentInputRef!: ElementRef<HTMLInputElement>;

  closeModal() {
    this._dialogRef.close(this.taskCommentsChanged);
  }

  onAddComment() {
    const newComment: Icomment = {
      id: generateUniqueIdWithTimestamp(),
      description: this.commentControl.value ? this.commentControl.value : '',
    };

    this._task.comments.unshift(newComment);

    this.commentControl.reset();

    this.taskCommentsChanged = true;

    this.commentInputRef.nativeElement.focus();
  }

  onDeleteComment(commentId: string | number) {
    const commentIndex = this._task.comments.findIndex(
      (comment: Icomment) => comment.id === commentId
    );

    if (commentIndex !== -1) {
      this._task.comments.splice(commentIndex, 1);
      this.taskCommentsChanged = true;
    }
  }
}
