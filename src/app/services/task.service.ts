import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Itask } from '../interfaces/task.interface';
import { ITaskFormControls } from '../interfaces/task-form-controls.interface';
import { TaskStatus } from '../enums/task-status.enum';
import { generateUniqueIdWithTimestamp } from '../utils/generate-unique-id-with-timestamp';
import { Icomment } from '../interfaces/comment.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private todoTasks$ = new BehaviorSubject<Itask[]>([]);
  readonly todoTasks = this.todoTasks$
    .asObservable()
    .pipe(map((tasks) => structuredClone(tasks)));

  private doingTasks$ = new BehaviorSubject<Itask[]>([]);
  readonly doingTasks = this.doingTasks$
    .asObservable()
    .pipe(map((tasks) => structuredClone(tasks)));

  private doneTasks$ = new BehaviorSubject<Itask[]>([]);
  readonly doneTasks = this.doneTasks$
    .asObservable()
    .pipe(map((tasks) => structuredClone(tasks)));

  addTask(taskInfos: ITaskFormControls): void {
    const newTask: Itask = {
      ...taskInfos,
      status: TaskStatus.TODO,
      id: generateUniqueIdWithTimestamp(),
      comments: [],
    };

    const currentLists = this.todoTasks$.getValue();
    this.todoTasks$.next([...currentLists, newTask]);
  }

  updateTaskStatus(
    taskId: string | number,
    taskCurrentStatus: TaskStatus,
    taskNextStatus: TaskStatus
  ) {
    const currentTaskList$ = this.getTaskListByStatus(taskCurrentStatus);
    const nextTaskList$ = this.getTaskListByStatus(taskNextStatus);
    const currentTasks = currentTaskList$.value.find(
      (task) => task.id === taskId
    );

    if (currentTasks) {
      currentTasks.status = taskNextStatus;

      const currentTaskListWithoutTask = currentTaskList$.value.filter(
        (task) => task.id !== taskId
      );
      currentTaskList$.next([...currentTaskListWithoutTask]);
      nextTaskList$.next([...nextTaskList$.value, { ...currentTasks }]);
    }
  }

  updateTaskNameAndDescription(
    taskId: string | number,
    taskCurrentStatus: TaskStatus,
    newTaskName: string,
    newTaskDescription: string
  ) {
    const currentTaskList$ = this.getTaskListByStatus(taskCurrentStatus);
    const currentTasks = currentTaskList$.value.find(
      (task) => task.id === taskId
    );
    if (currentTasks) {
      currentTasks.name = newTaskName;
      currentTasks.description = newTaskDescription;
      const currentTaskListWithoutTask = currentTaskList$.value.filter(
        (task) => task.id !== taskId
      );
      currentTaskList$.next([
        ...currentTaskListWithoutTask,
        { ...currentTasks },
      ]);
    }
  }

  updateTaskComments(
    taskId: string | number,
    taskCurrentStatus: TaskStatus,
    newComments: Icomment[]
  ) {
    const currentTaskList$ = this.getTaskListByStatus(taskCurrentStatus);
    const currentTasks = currentTaskList$.value.find(
      (task) => task.id === taskId
    );
    if (currentTasks) {
      currentTasks.comments = newComments;
      const currentTaskListWithoutTask = currentTaskList$.value.filter(
        (task) => task.id !== taskId
      );
      currentTaskList$.next([
        ...currentTaskListWithoutTask,
        { ...currentTasks },
      ]);
    }
  }

  deleteTask(taskId: string | number, taskCurrentStatus: TaskStatus) {
    const currentTaskList$ = this.getTaskListByStatus(taskCurrentStatus);
    const currentTaskListWithoutTask = currentTaskList$.value.filter(
      (task) => task.id !== taskId
    );
    currentTaskList$.next([...currentTaskListWithoutTask]);
  }

  private getTaskListByStatus(
    taskStatus: TaskStatus
  ): BehaviorSubject<Itask[]> {
    const taskListObj = {
      [TaskStatus.TODO]: this.todoTasks$,
      [TaskStatus.DOING]: this.doingTasks$,
      [TaskStatus.DONE]: this.doneTasks$,
    };
    return taskListObj[taskStatus];
  }
}
