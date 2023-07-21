import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from '../shared/services/app.service';
import { List } from '../interfaces/list.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit, OnDestroy {
  lists: List[] = [];
  pinnedIndices: number[] = [];

  private subscription = new Subscription();

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.getAndSortLists();
    this.updateOnListCreated();
  }

  updateOnListCreated() {
    this.subscription = this.appService.listCreated$.subscribe(() => {
      this.getAndSortLists();
    });
  }

  getAndSortLists() {
    this.lists = this.appService.getTodoLists();
    this.pinnedIndices = this.appService.getPinnedLists();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
