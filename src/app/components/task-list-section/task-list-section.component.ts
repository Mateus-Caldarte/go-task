import { Component, inject } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskService } from '../../services/task.service';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Itask } from '../../interfaces/task.interface';
import { AsyncPipe } from '@angular/common';
import { TaskStatus } from '../../enums/task-status.enum';

@Component({
  selector: 'app-task-list-section',
  imports: [TaskCardComponent, CdkDropList, CdkDrag, AsyncPipe],
  templateUrl: './task-list-section.component.html',
  styleUrl: './task-list-section.component.css',
})
export class TaskListSectionComponent {
  readonly _taskService = inject(TaskService);

  onCardDrop(event: CdkDragDrop<Itask[]>) {
    this.moveCardToColumn(event);

    const taskId = event.item.data.id;
    const taskCurrentStatus = event.item.data.status;
    const droppedColumn = event.container.id;

    this.updateTaskStatus(taskId, taskCurrentStatus, droppedColumn);
  }

  private updateTaskStatus(
    taskId: string,
    taskCurrentStatus: TaskStatus,
    droppedColumn: string
  ) {
    let TaskNextStatus: TaskStatus;

    switch (droppedColumn) {
      case 'to-do-column':
        TaskNextStatus = TaskStatus.TODO;
        break;
      case 'doing-column':
        TaskNextStatus = TaskStatus.DOING;
        break;
      case 'done-column':
        TaskNextStatus = TaskStatus.DONE;
        break;
      default:
        return;
    }

    this._taskService.updateTaskStatus(
      taskId,
      taskCurrentStatus,
      TaskNextStatus
    );
  }

  private moveCardToColumn(event: CdkDragDrop<Itask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
