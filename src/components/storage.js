import Project from "./project";
import Todo from "./todo";

const PROJECT_ORDER_KEY = "projectOrder";

function saveProjectToLocalStorage(project) {
    localStorage.setItem(project.name, JSON.stringify(project)); //set the stringified object to its name key

    const projectOrder = JSON.parse(localStorage.getItem(PROJECT_ORDER_KEY)) || [];
    if(!projectOrder.includes(project.name)) {   //required as every update on project, this func is called.
        projectOrder.push(project.name);
        localStorage.setItem(PROJECT_ORDER_KEY, JSON.stringify(projectOrder));
    }
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
        todo.setStatus(todoData.isCompleted)
        
        project.addTodo(todo);
    });
    return project;
}

function deleteProjectFromLocalStorage(projectName) {
    localStorage.removeItem(projectName);

    let projectOrder = JSON.parse(localStorage.getItem(PROJECT_ORDER_KEY)) || [];
    projectOrder = projectOrder.filter(name => name !== projectName);
    localStorage.setItem(PROJECT_ORDER_KEY, JSON.stringify(projectOrder));
}

function getAllProjectNames() {
    return JSON.parse(localStorage.getItem(PROJECT_ORDER_KEY)) || [];
}

export default {
    saveProjectToLocalStorage,
    loadProjectFromLocalStorage,
    deleteProjectFromLocalStorage,
    getAllProjectNames,
};