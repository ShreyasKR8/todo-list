import './style.css'
import Project from './components/project'
import Todo from "./components/todo";
import display from './components/display';
import storage from './components/storage'
import state from './components/state'

let projectNum = 1;
const defaultProjectBtn = document.querySelector(".project-btn");
const createTodoBtn = document.querySelector(".create-todo-btn");
const dialog = document.querySelector("dialog");
const confirmDialogBtn = document.querySelector(".confirm-dialog-btn");
const closeDialogBtn = document.querySelector(".close-dialog-btn");
const todoForm = document.querySelector(".todo-form");
const newProjectBtn = document.querySelector(".new-project-btn");

const defaultProject = new Project("default project");
// const todoItem1 = new Todo("Go Running", "hyhyhyy", "23/12", "HP");
// defaultProject.addTodo(todoItem1);
// storage.saveProjectToLocalStorage(defaultProject);
// state.setCurrentProject(defaultProject);
// display.displayProject(defaultProject);

function createProject() {
    const projectName = `new project ${projectNum++}`;
    const newProject = new Project(projectName);
    display.displayNewProject(newProject.name);
    state.setCurrentProject(newProject);
    storage.saveProjectToLocalStorage(newProject);
}

function createTodo(title, desc, dueDate, priority) {
    const todoItem = new Todo(title, desc, dueDate, priority);
    state.getCurrentProject().addTodo(todoItem);
    storage.saveProjectToLocalStorage(state.getCurrentProject());
}

createTodoBtn.addEventListener("click", () => {
    dialog.showModal();
});

confirmDialogBtn.addEventListener("click", (event) => {
    event.preventDefault();
    
    const title = document.getElementById("title").value;
    const desc = document.getElementById("desc").value;
    // const dueDate = document.getElementById("due-date").value;
    const dueDate = "26/11";
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

defaultProjectBtn.addEventListener("click", () => {
    let loadedProject = storage.loadProjectFromLocalStorage("default project");
    state.setCurrentProject(loadedProject);
    display.displayProject(state.getCurrentProject());
    // console.log
});