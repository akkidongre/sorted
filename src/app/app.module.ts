import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DpDatePickerModule } from 'ng2-date-picker';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AddTodoComponent } from './add-todo/add-todo.component';
import { FormComponent } from './shared/form/form.component';
import { FormFieldComponent } from './shared/form/form-field/form-field.component';
import { CardListComponent } from './card-list/card-list.component';
import { CardComponent } from './card-list/card/card.component';
import { ModalComponent } from './shared/modal/modal.component';
import { HeaderComponent } from './header/header.component';
import { EditTodoComponent } from './edit-todo/edit-todo.component';

@NgModule({
  declarations: [
    AppComponent,
    AddTodoComponent,
    FormComponent,
    FormFieldComponent,
    CardListComponent,
    CardComponent,
    ModalComponent,
    HeaderComponent,
    EditTodoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
