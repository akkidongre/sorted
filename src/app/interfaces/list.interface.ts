import { Todo } from "./todo.interface";

export interface List {
    title: string;
    description: string;
    todoList: Todo[];
}