import './style.css'
import Project from './components/project'
import Todo from "./components/todo";
import display from './components/display';
import storage from './components/storage'
import state from './components/state'
import { format } from 'date-fns'

let projectNum = 1;
// const defaultProjectBtn = document.querySelector(".project-btn");
// const createTodoBtn = document.querySelector(".create-todo-btn");
const dialog = document.querySelector("dialog");
const confirmDialogBtn = document.querySelector(".confirm-dialog-btn");
const closeDialogBtn = document.querySelector(".close-dialog-btn");
const todoForm = document.querySelector(".todo-form");
const newProjectBtn = document.querySelector(".new-project-btn");


loadProjects();

function loadProjects() {
    //retrieve projects from localStorage, if any
    const projectNames = storage.getAllProjectNames();
    if(projectNames.length == 0) {
        //if empty, we are loading for the first time
        createDefaultProject();
        return;
    }

    //add retreived projects to sidebar
    projectNum = projectNames.length;
    display.addDefaultProject(projectNames[0]);
    projectNames.slice(1).forEach(projectName => {
        display.addNewProject(projectName);
    });

    //display default project's todos.
    const defaultProject = storage.loadProjectFromLocalStorage(projectNames[0]);
    state.setCurrentProject(defaultProject);
    display.displayProject(defaultProject);
}

function createDefaultProject() {
    const defaultProject = new Project("default project");
    const todoItem1 = new Todo("Go Running", "hyhyhyy", "23/12", "HP");
    defaultProject.addTodo(todoItem1);
    display.addDefaultProject(defaultProject.name);
    storage.saveProjectToLocalStorage(defaultProject);
    state.setCurrentProject(defaultProject);
    display.displayProject(defaultProject);
}

function createProject() {
    const projectName = `new project ${projectNum++}`;
    const newProject = new Project(projectName);
    display.addNewProject(newProject.name);
    state.setCurrentProject(newProject);
    storage.saveProjectToLocalStorage(newProject);
}

function createTodo(title, desc, dueDate, priority) {
    const todoItem = new Todo(title, desc, dueDate, priority);
    state.getCurrentProject().addTodo(todoItem);
    storage.saveProjectToLocalStorage(state.getCurrentProject());
}

confirmDialogBtn.addEventListener("click", (event) => {
    event.preventDefault();
    
    const title = document.getElementById("title").value;
    const desc = document.getElementById("desc").value;
    const dueDateInput = document.getElementById("due-date").value;
    const dueDate = format(new Date(dueDateInput), 'dd/mm/yyyy');
    // const dueDate = "26/11";
    const priority = document.getElementById("priority").value;
    createTodo(title, desc, dueDate, priority);
    display.displayTodos(state.getCurrentProject().todos);

    todoForm.reset();
    dialog.close();
});

closeDialogBtn.addEventListener("click", () => {
    dialog.close();
})

newProjectBtn.addEventListener("click", createProject);

document.addEventListener("deleteTodo", (event) => {
    const todoToDelete = event.detail;
    state.getCurrentProject().deleteTodo(todoToDelete);
    const currentProject = state.getCurrentProject();
    storage.saveProjectToLocalStorage(currentProject);
})