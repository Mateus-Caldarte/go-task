import { Component, inject, Input } from '@angular/core';
import { modalControlerService } from '../../services/modal-controler.service';
import { Itask } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Itask;

  private readonly __modalControllerService = inject(modalControlerService);

  private readonly _taskService = inject(TaskService);

  openEditTaskModal() {
    const dialofRef = this.__modalControllerService.openEditTaskModal({
      name: this.task.name,
      description: this.task.description ?? '',
    });
    dialofRef.closed.subscribe((taskForm) => {
      if (taskForm) {
        this._taskService.updateTaskNameAndDescription(
          this.task.id,
          this.task.status,
          taskForm.name,
          taskForm.description
        );
      }
    });
  }

  openTaskCommentsModal() {
    this.task.comments = [
      { id: 1, description: 'Comentário de teste 1' },
      { id: 2, description: 'Comentário de teste 2' },
    ];
    this.__modalControllerService.openTaskCommentsModal(this.task);
  }
}
