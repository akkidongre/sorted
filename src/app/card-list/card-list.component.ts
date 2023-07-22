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
  pinnedIds: string[] = [];
  pinnedLists: List[] = [];
  otherLists: List[] = [];
  sortedLists: List[] = [];

  sortOrder: "asc" | "desc" = "desc";

  private subscription = new Subscription();

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.getLists();
    this.sortLists();
    this.updateOnListCreated();
  }

  updateOnListCreated() {
    this.subscription = this.appService.listCreated$.subscribe(() => {
      this.getLists();
      this.sortLists();
    });
  }

  getLists() {
    this.lists = this.appService.getTodoLists();
    this.pinnedIds = this.appService.getPinnedLists();

    this.pinnedLists = this.lists.filter(list => this.pinnedIds.includes(list.id));
    this.otherLists = this.lists.filter(list => !this.pinnedIds.includes(list.id));
  }

  sortLists() {
    this.pinnedLists = this.pinnedLists.sort((list1, list2) => {
      const date1 = new Date(list1.updatedAt);
      const date2 = new Date(list2.updatedAt);

      if (this.sortOrder === 'asc') {
        return date1.getTime() - date2.getTime();
      } else {
        return date2.getTime() - date1.getTime();
      }
    });

    this.otherLists = this.otherLists.sort((list1, list2) => {
      const date1 = new Date(list1.updatedAt);
      const date2 = new Date(list2.updatedAt);

      if (this.sortOrder === 'asc') {
        return date1.getTime() - date2.getTime();
      } else {
        return date2.getTime() - date1.getTime();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
