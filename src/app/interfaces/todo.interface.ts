export interface SubTodo {
    title: string;
    description: string;
    dueDate: string;
    isFinished: string;
}

export interface Todo extends SubTodo {
    subTodoList: SubTodo[];
}