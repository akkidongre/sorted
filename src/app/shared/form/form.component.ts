import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { FormFieldComponent } from './form-field/form-field.component';
import { AppService } from '../services/app.service';
import { List } from 'src/app/interfaces/list.interface';
import { SubTodo, Todo } from 'src/app/interfaces/todo.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  @Input() formMode: 'add' | 'edit' = 'add';

  todoListForm = this.fb.group({
    title: [''],
    description: [''],
    todoList: this.fb.array([])
  });

  selectedListIndex: number = -1;
  selectedList!: List | null;

  @ViewChildren('listItem') allListItems!: QueryList<FormFieldComponent>;
  @ViewChildren('subListItem') subListItems!: QueryList<FormFieldComponent>;
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;

  @Output() save = new EventEmitter<void>();

  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    if (this.formMode === 'edit') {
      const selectedListIndexSub = this.appService.selectedList$.subscribe((index) => {
        this.selectedListIndex = index;
        this.selectedList = this.appService.getTodoListByIndex(index);
  
        if (this.selectedList) {
          this.patchValuesToForm();
        }
      });
  
      this.subscription.add(selectedListIndexSub);
    }
  }

  patchValuesToForm() {
    this.todoListForm.patchValue({
      title: this.selectedList?.title,
      description: this.selectedList?.description
    });

    this.selectedList?.todoList.forEach((todo, i) => {
      this.addTodoList(todo, i);
    });

    console.log(this.todoListForm);
  }

  get todoList() {
    return this.todoListForm.get('todoList') as FormArray;
  }

  addTodoList(todo: Todo | null = null, index: number = -1) {
    this.todoList.push(this.fb.group({
      title: [todo?.title || ''],
      description: [todo?.description || ''],
      dueDate: [todo?.dueDate || ''],
      isFinished: [todo?.isFinished || false],
      subTodoList: this.fb.array([])
    }));

    if (todo) {
      todo.subTodoList.forEach((subTodo) => {
        console.log(subTodo);
        this.addSubTodoList(index, subTodo);
      });
    }

    if (!todo) {
      this.selectLastTodo();
    }
  }

  deleteTodoList(index: number) {
    this.todoList.removeAt(index);
  }

  getSubTodoList(index: number) {
    return this.todoList.at(index).get('subTodoList') as FormArray;
  }

  addSubTodoList(listIndex: number, subTodo: SubTodo | null = null) {
    this.getSubTodoList(listIndex).push(this.fb.group({
      title: [subTodo?.title || ''],
      description: [subTodo?.description || ''],
      dueDate: [subTodo?.dueDate || ''],
      isFinished: [subTodo?.isFinished || false]
    }));

    if (!subTodo) {
      this.selectLastSubTodo();
    }
  }

  deleteSubTodoList(listIndex: number, subIndex: number) {
    this.getSubTodoList(listIndex).removeAt(subIndex);
  }

  getFormControl(index: number, controlName: string) {
    return this.todoList.at(index).get(controlName) as FormControl;
  }

  getSubFormControl(mainIndex: number, subIndex: number, controlName: string) {
    return this.getSubTodoList(mainIndex).at(subIndex).get(controlName) as FormControl;
  }

  resetForm() {
    this.todoList.clear();
    this.todoListForm.reset();
  }

  selectLastTodo() {
    // Adding this timer to avoid ExpressionChangedAfterItHasBeenCheckedError
    // By adding a setter or by subscribing to allListItem.changes, the above error gets triggered.
    const timerSub = timer(0).subscribe(_ => {
      if (this.allListItems.length === 0) {
        this.titleInput.nativeElement.focus();
        return;
      }
      this.allListItems.last.listItemInput.nativeElement.focus();
    });
    this.subscription.add(timerSub);
  }

  selectLastSubTodo() {
    const timerSub = timer(0).subscribe(_ => {
      if (this.subListItems.length === 0) {
        this.selectLastTodo();
        return;
      }
      this.subListItems.last.listItemInput.nativeElement.focus();
    });
    this.subscription.add(timerSub);
  }

  onSubmit() {
    if (this.formMode === 'add') {
      this.appService.saveTodoList(this.todoListForm.value);
    } else {
      this.appService.updateTodoList(this.todoListForm.value, this.selectedListIndex);
    }
    this.resetForm();
    this.save.emit();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
