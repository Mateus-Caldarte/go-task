import { Component, inject } from '@angular/core';
import { modalControlerService } from '../../services/modal-controler.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-welcome-section',
  imports: [],
  templateUrl: './welcome-section.component.html',
  styleUrl: './welcome-section.component.css',
})
export class WelcomeSectionComponent {
  private readonly __modalControllerService = inject(modalControlerService);
  private readonly __taskService = inject(TaskService);

  openNewTaskModal() {
    const dialofRef = this.__modalControllerService.openNewTaskModal();
    dialofRef.closed.subscribe((taskForm) => {
      if (taskForm) {
        this.__taskService.addTask(taskForm);
      }
    });
  }
}
