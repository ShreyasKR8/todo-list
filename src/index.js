import './style.css';
import Project from './components/project';
import Todo from "./components/todo";
import display from './components/display';
import storage from './components/storage';
import state from './components/state';
import { format, isBefore } from 'date-fns';

let defaultProject = null;

const createTodoBtn = document.querySelector(".add-todo-btn");
const createTodoDialog = document.querySelector(".create-todo-dialog");
const createTodoForm = document.querySelector(".create-todo-form");
const confirmDialogBtn = document.querySelector(".confirm-add-dialog-btn");
const closeDialogBtn = document.querySelector(".close-create-dialog-btn");

const editTodoDialog = document.querySelector(".edit-todo-dialog");
const editTodoForm = document.querySelector(".edit-todo-form");
// const confirmEditsBtn = document.querySelector(".confirm-changes-btn");
const closeEditsDialogBtn = document.querySelector(".close-edit-dialog-btn");

// const editProjectDialog = document.querySelector(".edit-project-dialog");
// const editProjectForm = document.querySelector(".edit-project-form");
// const confirmEditProjectBtn = document.querySelector(".confirm-edit-project-btn");
// const closeEditProjectDialogBtn = document.querySelector(".close-edit-project-dialog-btn"); 

const newProjectBtn = document.querySelector(".new-project-btn");
const createProjectDialog = document.querySelector(".create-project-dialog");
const createProjectForm = document.querySelector(".create-project-form");
const confirmProjectDialogBtn = document.querySelector(".create-project-dialog-btn");
const closeProjectDialogBtn = document.querySelector(".close-project-dialog-btn");

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
    
    display.addDefaultProject(projectNames[0]);
    projectNames.slice(1).forEach(projectName => {
        display.addNewProject(projectName);
    });

    //display default project's todos.
    defaultProject = storage.loadProjectFromLocalStorage(projectNames[0]);
    state.setCurrentProject(defaultProject);
    display.displayProject(defaultProject);
    display.highlightDefaultProject();
}

function createDefaultProject() {
    defaultProject = new Project("Default project");
    const todoItem1 = new Todo("Go Running", "Run!", "29-08-2024", "High");
    defaultProject.addTodo(todoItem1);
    display.addDefaultProject(defaultProject.name);
    storage.saveProjectToLocalStorage(defaultProject);
    state.setCurrentProject(defaultProject);
    display.displayProject(defaultProject);
    display.highlightDefaultProject();
}

function createProject(projectName) {
    if(projectName == "") {
        return;
    }
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
    
    //date, you nightmare!!
    const dateObj = new Date();
    const currentDay = ("0" + dateObj.getDate()).slice(-2);
    const currentMonth = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const currentDate = dateObj.getFullYear() + "-" + currentMonth  + "-" + currentDay;
    if(isBefore(dueDateInput.value, currentDate)) {
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

function updateTodo(todoToUpdate) {
    const titleInput = document.getElementById("edit-title");
    const dueDateInput = document.getElementById("edit-due-date");
    const descInput = document.getElementById("edit-desc");
    const priorityInput = document.getElementById("edit-priority");
    const inputs = parseInputs(titleInput, descInput, dueDateInput, priorityInput);
    if(!inputs) { //check if inputs are valid
        return;
    }

    const currentProject = state.getCurrentProject();
    const todoInProject =  currentProject.getTodo(todoToUpdate);
    todoInProject.updateTodo(inputs.title, inputs.desc, inputs.dueDate, inputs.priority);
    display.displayTodos(currentProject.getAllTodos());//maybe make a function called addTodoToDisplay
    
    editTodoForm.reset();
    // editTodoDialog.close();
}

function isProjectNameValid(projectNameInput) {
    if(projectNameInput.value == "") {
        projectNameInput.setCustomValidity("Please fill the project name");
        projectNameInput.reportValidity();
        return false;
    }
    
    const existingProjectNames = storage.getAllProjectNames();
    if(existingProjectNames.includes(projectNameInput.value)) {
        projectNameInput.setCustomValidity("Project already exists!");
        projectNameInput.reportValidity();
        return false;
    }
    
    return true;
}

// function updateProjectDetails(projectNewName) {
//     display.updateProjectDetails(projectNewName);
    
//     const currentproject = state.getCurrentProject();
//     const projectOldName = currentproject.name;
//     currentproject.updateProject(projectNewName);
    
//     //save project to new key and delete old item from localStorage.
//     storage.saveProjectToLocalStorage(currentproject);
//     storage.deleteProjectFromLocalStorage(projectOldName);
    
// }

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

createTodoBtn.addEventListener("click", () => {
    createTodoDialog.showModal();
});

closeEditsDialogBtn.addEventListener("click", () => {
    editTodoDialog.close();
});

newProjectBtn.addEventListener("click", () => {
    createProjectDialog.showModal();
});

closeProjectDialogBtn.addEventListener("click", () => {
    createProjectForm.reset();
    createProjectDialog.close();
});

const projectNameInput = document.getElementById("project-name");
projectNameInput.addEventListener("click", () => {
    projectNameInput.setCustomValidity("");
});

confirmProjectDialogBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const projectNameInput = document.getElementById("project-name");
    
    if(!isProjectNameValid(projectNameInput)) {
        return;

    }

    createProject(projectNameInput.value);

    createProjectForm.reset();
    createProjectDialog.close();
});

// confirmEditProjectBtn.addEventListener("click", (event) => {
//     event.preventDefault();

//     const projectNameInput = document.getElementById("edit-project-name");
    
//     if(!isProjectNameValid(projectNameInput)) {
//         return;

//     }

//     updateProjectDetails(projectNameInput.value);

//     editProjectForm.reset();
//     editProjectDialog.close();
// });

// closeEditProjectDialogBtn.addEventListener("click", () => {
//     editProjectForm.reset();
//     editProjectDialog.close();
// });

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
});

document.addEventListener("checkboxChanged", (event) => {
    const { todoToUpdate, isTodoChecked } = event.detail;
    todoToUpdate.setStatus(isTodoChecked);
    storage.saveProjectToLocalStorage(state.getCurrentProject());
});

document.addEventListener("projectDeleted", () => {
    if(!defaultProject) {
        return;
    }
    state.setCurrentProject(defaultProject);
    display.displayProject(defaultProject);
    display.highlightDefaultProject();
});
