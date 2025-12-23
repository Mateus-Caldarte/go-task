import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Itask } from '../interfaces/task.interface';
import { ITaskFormControls } from '../interfaces/task-form-controls.interface';
import { TaskStatus } from '../enums/task-status.enum';
import { generateUniqueIdWithTimestamp } from '../utils/generate-unique-id-with-timestamp';

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
      commnets: [],
    };

    const currentLists = this.todoTasks$.getValue();
    this.todoTasks$.next([...currentLists, newTask]);
  }
}
