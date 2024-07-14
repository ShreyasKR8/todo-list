import storage from "./storage";
import state from "./state";

const mainContentDiv = document.querySelector(".main-content");
const projectsDiv = document.querySelector(".projects");
const dialog = document.querySelector("dialog");

function addEventListenersForBtn(btnEle) {
    btnEle.addEventListener("click", () => {
        dialog.showModal();
    })
}

function displayNewProject(projectName) {
    mainContentDiv.replaceChildren();
    const projectDiv = document.createElement("div");
    projectDiv.className = "project";
    projectsDiv.appendChild(projectDiv);

    const projectBtn = document.createElement("button");
    projectBtn.className = "project-btn";
    projectBtn.innerText = projectName;
    projectBtn.addEventListener("click", () => {
        let loadedProject = storage.loadProjectFromLocalStorage(projectName);
        state.setCurrentProject(loadedProject);
        displayProject(loadedProject);
    });

    const createTodoBtn = document.createElement("button");
    createTodoBtn.className = "create-todo-btn";
    createTodoBtn.innerText = "+";
    addEventListenersForBtn(createTodoBtn);

    projectDiv.appendChild(projectBtn);
    projectDiv.appendChild(createTodoBtn);

}

function displayProject(project) {
    displayTodos(project.todos);
}

function displayTodos(todos) {
    mainContentDiv.replaceChildren();
    let cardIndex = 0;
    todos.forEach(todo => {
        const todoCard = document.createElement("article");
        todoCard.className = `todo-card-${cardIndex++}`;
        mainContentDiv.appendChild(todoCard);

        const todoTitle = document.createElement("h3");
        todoTitle.className = "title";
        todoTitle.innerText = todo.title;

        const todoDesc = document.createElement("p");
        todoDesc.className = "desc";
        todoDesc.innerText = todo.description;

        const todoDueDate = document.createElement("p");
        todoDueDate.className = "due-date";
        todoDueDate.innerText = todo.dueDate;

        const todoPriority = document.createElement("p");
        todoPriority.className = "priority";
        todoPriority.innerText = todo.priority;

        todoCard.appendChild(todoTitle);
        todoCard.appendChild(todoDesc);
        todoCard.appendChild(todoDueDate);
        todoCard.appendChild(todoPriority);
        
    });
}

export default {
    displayProject,
    displayTodos,
    displayNewProject,
};