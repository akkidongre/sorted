import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatePickerComponent, ISelectionEvent } from 'ng2-date-picker';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent {
  @Input() checkboxControl!: FormControl;
  @Input() titleControl!: FormControl;
  @Input() dueDateControl!: FormControl;
  @Input() descriptionControl!: FormControl;
  @Input() isSubList: boolean = false;
  @Input() placeholder!: string;

  @Output() addBtnClick = new EventEmitter<void>();
  @Output() deleteBtnClick = new EventEmitter<void>();

  @ViewChild('listItemInput')
  get listItemInput() {
    return this._listItemInput;
  };
  set listItemInput(itemInput: ElementRef) {
    this._listItemInput = itemInput;
  }
  private _listItemInput!: ElementRef;

  @ViewChild('datePicker')
  datePicker!: DatePickerComponent;

  datePickerConfig = {
    hideInputContainer: true
  }

  onSelectDate(event: ISelectionEvent) {
    const date = event.date.toString();
    this.dueDateControl.setValue(date);
  }

  onCalendarClick() {
    this.datePicker.api.open();
  }

  onAddBtnClick() {
    this.addBtnClick.emit();
  }

  onDeleteBtnClick() {
    this.deleteBtnClick.emit();
  }
}
