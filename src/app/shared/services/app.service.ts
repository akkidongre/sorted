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
  pinnedLists: number[] = [];

  listCreated$ = new Subject<void>();
  saveList$ = new Subject<void>();

  selectedList$ = new BehaviorSubject<number>(-1);

  constructor() { }

  saveTodoList(todoList: any) {
    todoList['createdAt'] = new Date().toString();
    todoList['id'] = todoList['createdAt'];

    // if (this.lists.length > 0) {
    this.lists = [...this.lists, todoList];
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.lists));
    // } else {
    //   const listsStr = localStorage.getItem(this.localStorageKey);
    //   let listsArr = [];
    //   if (listsStr) {
    //     listsArr = JSON.parse(listsStr);
    //   }

    //   listsArr.push(todoList);
    //   this.lists = listsArr;
    //   localStorage.setItem(this.localStorageKey, JSON.stringify(listsArr));
    // }
    this.listCreated$.next();
  }

  updateTodoList(todoList: any, index: number) {
    if (index < 0 || index > this.lists.length) {
      return;
    }

    const listArr = this.lists.slice();
    listArr[index] = todoList;
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

  getTodoListByIndex(index: number): List | null {
    if (index < 0) return null;

    if (this.lists.length === 0) {

    }

    return this.lists[index];
  }

  deleteTodoList(index: number) {
    this.lists = [...this.lists.slice(0, index), ...this.lists.slice(index + 1)];
    if (this.pinnedLists.includes(index)) {
      this.pinnedLists = this.pinnedLists.filter(i => i !== index);
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

  pinTodoList(index: number) {
    this.pinnedLists.push(index);
    localStorage.setItem(this.pinnedLocalStorageKey, JSON.stringify(this.pinnedLists));
    this.listCreated$.next();
  }

  unpinTodoList(index: number) {
    this.pinnedLists = this.pinnedLists.filter(i => i !== index);
    localStorage.setItem(this.pinnedLocalStorageKey, JSON.stringify(this.pinnedLists));
    this.listCreated$.next();
  }
}
