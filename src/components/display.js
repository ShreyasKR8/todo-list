import storage from "./storage";
import state from "./state";

const todosContentDiv = document.querySelector(".todos-content");
const projectsDiv = document.querySelector(".projects");
let selectedProjectDiv = null;
let currentDescDisplayed = null;
const dialog = document.querySelector("dialog");
const DELETE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 24 24">
    <path d="M 10 2 L 9 3 L 5 3 C 4.448 3 4 3.448 4 4 C 4 4.552 4.448 5 5 5 L 7 5 L 17 5 L 19 5 C 19.552 5 20 4.552 20 4 C 20 3.448 19.552 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.105 5.895 22 7 22 L 17 22 C 18.105 22 19 21.105 19 20 L 19 7 L 5 7 z"></path>
    </svg>`;
const EDIT_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 24 24">
    <path d="M 18.414062 2 C 18.158188 2 17.902031 2.0974687 17.707031 2.2929688 L 16 4 L 20 8 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.925594 2.0974687 18.669937 2 18.414062 2 z M 14.5 5.5 L 3 17 L 3 21 L 7 21 L 18.5 9.5 L 14.5 5.5 z"></path>
    </svg>`;

function addEventListenersForBtn(btnEle) {
    btnEle.addEventListener("click", () => {
        dialog.showModal();
    })
}

function addDefaultProject(projectName) {
    todosContentDiv.replaceChildren();
    const projectDiv = document.createElement("div");
    projectDiv.className = "project default-project";
    projectsDiv.appendChild(projectDiv);
    projectDiv.addEventListener("click", () => {
        if(selectedProjectDiv) {
            selectedProjectDiv.classList.remove("highlight-project")
        }
        projectDiv.classList.add("highlight-project");
        selectedProjectDiv = projectDiv;
        let loadedProject = storage.loadProjectFromLocalStorage(projectName);
        state.setCurrentProject(loadedProject);
        displayProject(loadedProject);
    });


    const projectNameEle = document.createElement("p");
    projectNameEle.className = "project-name";
    projectNameEle.innerText = projectName;

    const createTodoBtn = document.createElement("button");
    createTodoBtn.className = "create-todo-btn-default";
    createTodoBtn.innerText = "+";
    addEventListenersForBtn(createTodoBtn);

    projectDiv.appendChild(projectNameEle);
    projectDiv.appendChild(createTodoBtn);
}

function addNewProject(projectName) {
    todosContentDiv.replaceChildren();
    const projectDiv = document.createElement("div");
    projectDiv.className = "project";
    projectsDiv.appendChild(projectDiv);
    projectDiv.addEventListener("click", () => {
        if(selectedProjectDiv) {
            selectedProjectDiv.classList.remove("highlight-project")
        }
        projectDiv.classList.add("highlight-project");
        selectedProjectDiv = projectDiv;
        let loadedProject = storage.loadProjectFromLocalStorage(projectName);
        state.setCurrentProject(loadedProject);
        displayProject(loadedProject);
    });
    
    const projectNameEle = document.createElement("p");
    projectNameEle.className = "project-name";
    projectNameEle.innerText = projectName;

    const createTodoBtn = document.createElement("button");
    createTodoBtn.className = "create-todo-btn";
    createTodoBtn.innerText = "+";
    addEventListenersForBtn(createTodoBtn);

    const deleteProjectBtn = document.createElement("button");
    deleteProjectBtn.className = "delete-project-btn";
    deleteProjectBtn.innerHTML = DELETE_ICON_SVG;
    deleteProjectBtn.addEventListener("click", () => {
        projectsDiv.removeChild(projectDiv);
        todosContentDiv.replaceChildren();
        storage.deleteProjectFromLocalStorage(projectName);
    });

    projectDiv.appendChild(projectNameEle);
    projectDiv.appendChild(createTodoBtn);
    projectDiv.appendChild(deleteProjectBtn);

}

function displayProject(project) {
    displayTodos(project.todos);
}

function displayTodos(todos) {
    todosContentDiv.replaceChildren();
    let cardIndex = 0;
    todos.forEach(todo => {
        const todoCard = document.createElement("article");
        todoCard.className = `todo-card todo-card-${cardIndex++}`;
        
        const todoTitle = document.createElement("h3");
        todoTitle.className = "title";
        todoTitle.innerText = todo.title;
        
        const todoDesc = document.createElement("p");
        todoDesc.className = "desc";
        todoDesc.innerText = todo.description;
        todoDesc.addEventListener("mouseover", () => {
            currentDescDisplayed = showTodoDescription(todoCard, todoDesc.innerText);
        });

        todoDesc.addEventListener("mouseout", () => {
            hideTodoDescription(todoCard, currentDescDisplayed);
        })
        
        const todoDueDate = document.createElement("p");
        todoDueDate.className = "due-date";
        todoDueDate.innerText = todo.dueDate;
        
        const todoPriority = document.createElement("p");
        todoPriority.className = "priority";
        todoPriority.innerText = todo.priority;
        
        const editTodoBtn = document.createElement("button");
        editTodoBtn.className = "edit-todo-btn";
        editTodoBtn.innerHTML = EDIT_ICON_SVG;
        editTodoBtn.addEventListener("click", () => {
            // bring up the dialog filled with current todo card info.
        })
        
        const deleteTodoBtn = document.createElement("button");
        deleteTodoBtn.className = "delete-todo-btn";
        deleteTodoBtn.innerHTML = DELETE_ICON_SVG;
        deleteTodoBtn.addEventListener("click", () => {
            deleteTodo(todoCard, todo);
        })
        
        todoCard.appendChild(todoTitle);
        todoCard.appendChild(todoDesc);
        todoCard.appendChild(todoDueDate);
        todoCard.appendChild(todoPriority);
        todoCard.appendChild(editTodoBtn);
        todoCard.appendChild(deleteTodoBtn);
        
        todosContentDiv.appendChild(todoCard);
        addTodoSeparator();
    });
}

function deleteTodo(todoCard, todo) {
    todosContentDiv.removeChild(todoCard);
    sendDeleteTodoMessage(todo);
}

function sendDeleteTodoMessage(todo) {
    const eventDeleteTodo = new CustomEvent("deleteTodo", {detail: todo});
    document.dispatchEvent(eventDeleteTodo);
}

function addTodoSeparator() {
    const borderAfterTodoCard = document.createElement("p");
    borderAfterTodoCard.style.borderBottom = "1px solid rgb(153, 153, 153)";
    todosContentDiv.appendChild(borderAfterTodoCard);
}

function showTodoDescription(todoCard, todoDescription) {
    const descDiv = document.createElement("div");
    descDiv.className = "display-desc";
    const descContent = document.createElement("p");
    descContent.innerText = todoDescription;
    descDiv.appendChild(descContent);
    todoCard.appendChild(descDiv);
    return descDiv;
}

function hideTodoDescription(todoCard, descDiv) {
    if(descDiv == null) {
        return;
    }
    todoCard.removeChild(descDiv);
    descDiv = null;
}

export default {
    addDefaultProject,
    addNewProject,
    displayProject,
    displayTodos,
};