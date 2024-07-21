class Todo {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority  = priority;
        this.isCompleted = false;
    }

    setStatus(isDone) {
        this.isCompleted = isDone;
    }
}

export default Todo;