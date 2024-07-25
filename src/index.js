import './style.css'
import Project from './components/project'
import Todo from "./components/todo";
import display from './components/display';
import storage from './components/storage'
import state from './components/state'
import { format, isPast } from 'date-fns'

let projectNum = 1;
const createTodoDialog = document.querySelector(".create-todo-dialog");
const createTodoForm = document.querySelector(".create-todo-form");
const confirmDialogBtn = document.querySelector(".confirm-dialog-btn");
const closeDialogBtn = document.querySelector(".close-dialog-btn");

const editTodoDialog = document.querySelector(".edit-todo-dialog");
const editTodoForm = document.querySelector(".edit-todo-form");
// const confirmEditsBtn = document.querySelector(".confirm-changes-btn");
const closeEditsDialogBtn = document.querySelector(".close-edit-dialog-btn");

const newProjectBtn = document.querySelector(".new-project-btn");

loadProjects();

function loadProjects() {
    //retrieve projects from localStorage, if any
    const projectNames = storage.getAllProjectNames();
    if (projectNames.length == 0) {
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
    //Correct the date please.
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

function isInputValid(titleInput, dueDateInput) {
    if(titleInput.value == "") {
        titleInput.setCustomValidity("Please fill the title");
        titleInput.reportValidity();
        return false;
    }

    if(dueDateInput.value == "") {
        dueDateInput.setCustomValidity("Please fill the due date");
        dueDateInput.reportValidity();
        return false;
    }
    
    if(isPast(new Date(dueDateInput.value))) {
        dueDateInput.setCustomValidity("Please select a valid date");
        dueDateInput.reportValidity();
        return false;
    }

    return true;
}

function parseInputs(titleInput, descInput, dueDateInput, priorityInput) {
    if (!isInputValid(titleInput, dueDateInput)) {
        return null;
    }

    const title = titleInput.value;
    const desc = descInput.value;
    const dueDate = format(new Date(dueDateInput.value), 'dd/MM/yyyy');
    const priority = priorityInput.value;
    return {title, desc, dueDate, priority};
}

confirmDialogBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const titleInput = document.getElementById("title");
    const dueDateInput = document.getElementById("due-date");
    const descInput = document.getElementById("desc");
    const priorityInput = document.getElementById("priority");
    const inputs = parseInputs(titleInput, descInput, dueDateInput, priorityInput);
    if(!inputs) { //check if inputs are valid
        return;
    }

    createTodo(inputs.title, inputs.desc, inputs.dueDate, inputs.priority);
    display.displayTodos(state.getCurrentProject().getAllTodos()); //maybe make a function called addTodoToDisplay

    createTodoForm.reset();
    createTodoDialog.close();
});

closeDialogBtn.addEventListener("click", () => {
    createTodoDialog.close();
});

function updateTodo(todoToUpdate) {
    const titleInput = document.getElementById("edit-title");
    const dueDateInput = document.getElementById("edit-due-date");
    const descInput = document.getElementById("edit-desc");
    const priorityInput = document.getElementById("edit-priority");
    const inputs = parseInputs(titleInput, descInput, dueDateInput, priorityInput);
    if(!inputs) { //check if inputs are valid
        return;
    }

    //make a function
    const currentProject = state.getCurrentProject();
    const todoInProject =  currentProject.getTodo(todoToUpdate);
    todoInProject.updateTodo(inputs.title, inputs.desc, inputs.dueDate, inputs.priority);
    display.displayTodos(currentProject.getAllTodos());//maybe make a function called addTodoToDisplay

    editTodoForm.reset();
    // editTodoDialog.close();
}

closeEditsDialogBtn.addEventListener("click", () => {
    editTodoDialog.close();
});

newProjectBtn.addEventListener("click", createProject);

document.addEventListener("deleteTodo", (event) => {
    const todoToDelete = event.detail;
    state.getCurrentProject().deleteTodo(todoToDelete);
    const currentProject = state.getCurrentProject();
    storage.saveProjectToLocalStorage(currentProject);
});

document.addEventListener("updateTodo", (event) => {
    const { todoToUpdate } = event.detail;
    updateTodo(todoToUpdate);
    // todoToUpdate.setStatus(isTodoChecked);
    storage.saveProjectToLocalStorage(state.getCurrentProject());
})

document.addEventListener("checkboxChanged", (event) => {
    const { todoToUpdate, isTodoChecked } = event.detail;
    todoToUpdate.setStatus(isTodoChecked);
    storage.saveProjectToLocalStorage(state.getCurrentProject());
});

