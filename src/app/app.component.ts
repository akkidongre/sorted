import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from './shared/services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'sorted';

  showEditTodo = false;

  private subscription = new Subscription();

  constructor(
    private appService: AppService
  ) {}

  ngOnInit(): void {
    this.subscription = this.appService.selectedList$.subscribe((index) => {
      if (index < 0) {
        this.showEditTodo = false;
      } else {
        this.showEditTodo = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
