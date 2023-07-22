import { Todo } from "./todo.interface";

export interface List {
    id: string;
    title: string;
    description: string;
    todoList: Todo[];
    updatedAt: string;
}