import { Component, inject } from '@angular/core';
import { modalControlerService } from '../../services/modal-controler.service';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  private readonly __modalControllerService = inject(modalControlerService);

  openEditTaskModal() {
    this.__modalControllerService.openEditTaskModal();
  }
}
