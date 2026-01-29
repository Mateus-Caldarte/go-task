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
  private readonly STORAGE_KEYS = {
    TODO_TASKS: 'goTask_todoTasks',
    DOING_TASKS: 'goTask_doingTasks',
    DONE_TASKS: 'goTask_doneTasks',
  };

  private todoTasks$ = new BehaviorSubject<Itask[]>(
    this.loadTasksFromStorage(this.STORAGE_KEYS.TODO_TASKS)
  );
  readonly todoTasks = this.todoTasks$
    .asObservable()
    .pipe(map((tasks) => structuredClone(tasks)));

  private doingTasks$ = new BehaviorSubject<Itask[]>(
    this.loadTasksFromStorage(this.STORAGE_KEYS.DOING_TASKS)
  );
  readonly doingTasks = this.doingTasks$
    .asObservable()
    .pipe(map((tasks) => structuredClone(tasks)));

  private doneTasks$ = new BehaviorSubject<Itask[]>(
    this.loadTasksFromStorage(this.STORAGE_KEYS.DONE_TASKS)
  );
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
    const updatedTasks = [...currentLists, newTask];
    this.todoTasks$.next(updatedTasks);
    this.saveTasksToStorage(this.STORAGE_KEYS.TODO_TASKS, updatedTasks);
  }

  // Métodos de persistência no localStorage
  private loadTasksFromStorage(key: string): Itask[] {
    try {
      const storedTasks = localStorage.getItem(key);
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error(
        `Erro ao carregar tarefas do localStorage (${key}):`,
        error
      );
      return [];
    }
  }

  private saveTasksToStorage(key: string, tasks: Itask[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(tasks));
    } catch (error) {
      console.error(`Erro ao salvar tarefas no localStorage (${key}):`, error);
    }
  }

  // Método público para limpar todas as tarefas do localStorage
  clearAllTasks(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.TODO_TASKS);
      localStorage.removeItem(this.STORAGE_KEYS.DOING_TASKS);
      localStorage.removeItem(this.STORAGE_KEYS.DONE_TASKS);

      this.todoTasks$.next([]);
      this.doingTasks$.next([]);
      this.doneTasks$.next([]);
    } catch (error) {
      console.error('Erro ao limpar tarefas do localStorage:', error);
    }
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
      const updatedNextTaskList = [...nextTaskList$.value, { ...currentTasks }];

      currentTaskList$.next([...currentTaskListWithoutTask]);
      nextTaskList$.next(updatedNextTaskList);

      // Salvar no localStorage
      this.saveTasksToStorage(
        this.getStorageKeyByStatus(taskCurrentStatus),
        currentTaskListWithoutTask
      );
      this.saveTasksToStorage(
        this.getStorageKeyByStatus(taskNextStatus),
        updatedNextTaskList
      );
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
      const updatedTaskList = [
        ...currentTaskListWithoutTask,
        { ...currentTasks },
      ];

      currentTaskList$.next(updatedTaskList);
      this.saveTasksToStorage(
        this.getStorageKeyByStatus(taskCurrentStatus),
        updatedTaskList
      );
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
      const updatedTaskList = [
        ...currentTaskListWithoutTask,
        { ...currentTasks },
      ];

      currentTaskList$.next(updatedTaskList);
      this.saveTasksToStorage(
        this.getStorageKeyByStatus(taskCurrentStatus),
        updatedTaskList
      );
    }
  }

  deleteTask(taskId: string | number, taskCurrentStatus: TaskStatus) {
    const currentTaskList$ = this.getTaskListByStatus(taskCurrentStatus);
    const currentTaskListWithoutTask = currentTaskList$.value.filter(
      (task) => task.id !== taskId
    );

    currentTaskList$.next([...currentTaskListWithoutTask]);
    this.saveTasksToStorage(
      this.getStorageKeyByStatus(taskCurrentStatus),
      currentTaskListWithoutTask
    );
  }

  private getStorageKeyByStatus(taskStatus: TaskStatus): string {
    const storageKeyObj = {
      [TaskStatus.TODO]: this.STORAGE_KEYS.TODO_TASKS,
      [TaskStatus.DOING]: this.STORAGE_KEYS.DOING_TASKS,
      [TaskStatus.DONE]: this.STORAGE_KEYS.DONE_TASKS,
    };
    return storageKeyObj[taskStatus];
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
