import { Component, OnDestroy, OnInit } from '@angular/core';
import { List } from '../interfaces/list.interface';
import { AppService } from '../shared/services/app.service';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.scss']
})
export class EditTodoComponent implements OnInit, OnDestroy {
  list!: List;

  constructor(
    private appService: AppService
  ) {}

  ngOnInit(): void {
    
  }

  onClose() {
    this.appService.selectedList$.next(-1);
  }
  
  ngOnDestroy(): void {
    
  }
}
