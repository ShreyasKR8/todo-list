import './style.css'
import Project from './project'
import Todo from "./todo";
import './display'
import display from './display';

const defaultProjectBtn = document.querySelector(".default-project-btn");
const createTodoBtn = document.querySelector(".create-todo-btn");
const dialog = document.querySelector("dialog");
const confirmDialogBtn = document.querySelector(".confirm-dialog-btn");
const closeDialogBtn = document.querySelector(".close-dialog-btn");
const todoForm = document.querySelector(".todo-form");

const defaultProject = new Project("default");
const todoItem1 = new Todo("Go Running", "hyhyhyy", "23/12", "HP");
defaultProject.addTodo(todoItem1);
display.displayTodos(defaultProject.todos);

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

    const todoItem = new Todo(title, desc, dueDate, priority);
    defaultProject.addTodo(todoItem);
    display.displayTodos(defaultProject.todos);

    todoForm.reset();
    dialog.close();
});

closeDialogBtn.addEventListener("click", () => {
    dialog.close();
})