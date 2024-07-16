
class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
        
    }

    deleteTodo(todo) {
        const todoIndex = this.todos.indexOf(todo);
        if(todoIndex == -1) {
            return false;
        }
        this.todos.splice(todoIndex, 1);
        return true;
    }
}

export default Project;