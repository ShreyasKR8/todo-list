
class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
        
    }

    displayTodo() {
        console.log(this.todos);
    }
}

export default Project;