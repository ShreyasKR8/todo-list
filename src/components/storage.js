import Project from "./project";
import Todo from "./todo";

function saveProjectToLocalStorage(project) {
    localStorage.setItem(project.name, JSON.stringify(project)) //set the stringified object to its name key
}

function loadProjectFromLocalStorage(projectName) {
    const projectData = localStorage.getItem(projectName);
    if(!projectData) {
        return null;
    }

    const parsedProject = JSON.parse(projectData);
    const project = new Project(parsedProject.name);
    parsedProject.todos.forEach(todoData => {
        const todo = new Todo(todoData.title, 
            todoData.description, 
            todoData.dueDate, 
            todoData.priority
        );

        if(todoData.isCompleted) {
            todo.markAsCompleted();
        }
        project.addTodo(todo);
    });
    return project;
}

function deleteProjectFromLocalStorage(projectName) {
    localStorage.removeItem(projectName);
}

function getAllProjectNames() {
    return Object.keys(localStorage);
}

export default {
    saveProjectToLocalStorage,
    loadProjectFromLocalStorage,
    deleteProjectFromLocalStorage,
    getAllProjectNames,
};