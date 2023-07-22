import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { List } from 'src/app/interfaces/list.interface';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private localStorageKey: string = 'lists';
  private pinnedLocalStorageKey: string = 'pinned';

  lists: List[] = [];
  pinnedLists: string[] = [];

  listCreated$ = new Subject<void>();
  saveList$ = new Subject<void>();

  selectedList$ = new BehaviorSubject<string>('');

  constructor() { }

  saveTodoList(todoList: any) {
    todoList['updatedAt'] = new Date().toISOString();
    todoList['id'] = todoList['updatedAt'];

    this.lists = [...this.lists, todoList];
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.lists));

    this.listCreated$.next();
  }

  updateTodoList(todoList: any) {
    if (!todoList) {
      return;
    }

    todoList['updatedAt'] = new Date().toISOString();
    const listArr = this.lists.slice();
    const itemIndex = listArr.findIndex(list => list.id === todoList.id);
    listArr[itemIndex] = todoList;
    this.lists = listArr;
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.lists));
    this.listCreated$.next();
  }

  getTodoLists() {
    if (this.lists.length > 0) return this.lists.slice();

    const listsString = localStorage.getItem(this.localStorageKey);

    if (listsString) {
      const listArr = JSON.parse(listsString);
      this.lists = listArr;
      return this.lists.slice();
    }
    return [];
  }

  getTodoListByIndex(id: string): List | null {
    if (!id) return null;

    if (this.lists.length === 0) {

    }

    const foundItem = this.lists.find(list => list.id === id)!;

    return foundItem;
  }

  deleteTodoList(id: string) {
    const itemIndex = this.lists.findIndex(list => list.id === id);
    this.lists = [...this.lists.slice(0, itemIndex), ...this.lists.slice(itemIndex + 1)];
    if (this.pinnedLists.includes(id)) {
      this.pinnedLists = this.pinnedLists.filter(i => i !== id);
      localStorage.setItem(this.pinnedLocalStorageKey, JSON.stringify(this.pinnedLists));
    }
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.lists));
    this.listCreated$.next();
  }

  getPinnedLists() {
    if (this.pinnedLists.length === 0) {
      const pinnedListArr = localStorage.getItem(this.pinnedLocalStorageKey);
      if (pinnedListArr) {
        this.pinnedLists = JSON.parse(pinnedListArr);
      } else {
        this.pinnedLists = [];
      }
    }

    return this.pinnedLists.slice();
  }

  pinTodoList(id: string) {
    this.pinnedLists.push(id);
    localStorage.setItem(this.pinnedLocalStorageKey, JSON.stringify(this.pinnedLists));
    this.listCreated$.next();
  }

  unpinTodoList(id: string) {
    this.pinnedLists = this.pinnedLists.filter(i => i !== id);
    localStorage.setItem(this.pinnedLocalStorageKey, JSON.stringify(this.pinnedLists));
    this.listCreated$.next();
  }
}
