import { Component, Input } from '@angular/core';
import { List } from 'src/app/interfaces/list.interface';
import { Todo } from 'src/app/interfaces/todo.interface';
import { AppService } from 'src/app/shared/services/app.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() list!: List;
  @Input() pinned = false;

  constructor(
    private appService: AppService
  ) {}

  checkIfDueDateIsToday(dueDate: string): boolean {
    const date = new Date(dueDate);
    const today = new Date();

    return this.compareDates(date, today);
  }

  checkIfDueDateIsTomorrow(dueDate: string) {
    const date = new Date(dueDate);
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    return this.compareDates(date, tomorrow);
  }

  compareDates(date1: Date, date2: Date) {
    if (date1.getDate() === date2.getDate() 
      && date1.getMonth() === date2.getMonth()
      && date1.getFullYear() === date2.getFullYear()
    ) {
      return true;
    }

    return false;
  }

  onCheckTodo() {
    this.appService.updateTodoList(this.list);
  }

  onCheckSubTodo() {
    this.appService.updateTodoList(this.list);
  }

  onCardClick() {
    console.log("On card click");
    this.appService.selectedList$.next(this.list.id);
  }

  onPinClick() {
    if (this.pinned) {
      this.appService.unpinTodoList(this.list.id);
    } else {
      this.appService.pinTodoList(this.list.id);
    }
  }

  onDeleteClick() {
    this.appService.deleteTodoList(this.list.id);
  }
}
