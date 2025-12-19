import { Component, inject } from '@angular/core';
import { modalControlerService } from '../../services/modal-controler.service';

@Component({
  selector: 'app-welcome-section',
  imports: [],
  templateUrl: './welcome-section.component.html',
  styleUrl: './welcome-section.component.css',
})
export class WelcomeSectionComponent {
  private readonly __modalControllerService = inject(modalControlerService);

  openNewTaskModal() {
    this.__modalControllerService.openNewTaskModal();
  }
}
