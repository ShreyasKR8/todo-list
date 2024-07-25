
class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
        
    }

    deleteTodo(todoToDelete) {
        const todoIndex = this.todos.indexOf(todoToDelete);
        if(todoIndex == -1) {
            return false;
        }
        this.todos.splice(todoIndex, 1);
        return true;
    }

    getTodo(todoToFind) {
        const todoIndex = this.todos.indexOf(todoToFind);
        if(todoIndex == -1) {
            return null;
        }
        return this.todos[todoIndex];
    }

    getAllTodos() {
        return this.todos;
    }
}

export default Project;