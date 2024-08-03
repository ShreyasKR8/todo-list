import storage from "./storage";
import state from "./state";

const todosContentDiv = document.querySelector(".todos-content");
const projectsDiv = document.querySelector(".projects");
const confirmEditsBtn = document.querySelector(".confirm-changes-btn");
const editTodoDialog = document.querySelector(".edit-todo-dialog");
const editProjectDialog = document.querySelector(".edit-project-dialog");
let selectedProjectDiv = null;
let currentDescDisplayed = null;
let checkboxNum = 1;
let projectDivList = [];
let todoToEdit = [];
const DELETE_TODO_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="19" height="22" viewBox="0 0 24 24">
    <title>Delete Todo</title>
    <path d="M 10 2 L 9 3 L 5 3 C 4.448 3 4 3.448 4 4 C 4 4.552 4.448 5 5 5 L 7 5 L 17 5 L 19 5 C 19.552 5 20 4.552 20 4 C 20 3.448 19.552 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.105 5.895 22 7 22 L 17 22 C 18.105 22 19 21.105 19 20 L 19 7 L 5 7 z" fill="white"></path>
    </svg>`;
const DELETE_PROJECT_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="19" height="22" viewBox="0 0 24 24">
    <title>Delete Project</title>
    <path d="M 10 2 L 9 3 L 5 3 C 4.448 3 4 3.448 4 4 C 4 4.552 4.448 5 5 5 L 7 5 L 17 5 L 19 5 C 19.552 5 20 4.552 20 4 C 20 3.448 19.552 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.105 5.895 22 7 22 L 17 22 C 18.105 22 19 21.105 19 20 L 19 7 L 5 7 z" fill="white"></path>
    </svg>`;
const EDIT_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
    <title>Edit Todo</title>
    <path d="M 18.414062 2 C 18.158188 2 17.902031 2.0974687 17.707031 2.2929688 L 16 4 L 20 8 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.925594 2.0974687 18.669937 2 18.414062 2 z M 14.5 5.5 L 3 17 L 3 21 L 7 21 L 18.5 9.5 L 14.5 5.5 z" fill="white"></path>
    </svg>`;
    
function addEventListenersForBtn(btnEle) {
    btnEle.addEventListener("click", () => {
        editProjectDialog.showModal();
    })
}

function addDefaultProject(projectName) {
    todosContentDiv.replaceChildren();
    addProjectSeparator();
    const projectDiv = document.createElement("div");
    projectDiv.className = "project default-project";
    projectsDiv.appendChild(projectDiv);
    projectDiv.addEventListener("click", () => {
        let loadedProject = storage.loadProjectFromLocalStorage(projectName);
        if(!loadedProject) {
            return;
        }
        state.setCurrentProject(loadedProject);
        highlightProject(projectDiv);
        displayProject(loadedProject);
    });

    const projectNameEle = document.createElement("p");
    projectNameEle.className = "project-name";
    projectNameEle.innerText = projectName;

    projectDiv.appendChild(projectNameEle);
    projectDivList.push(projectDiv);
    addProjectSeparator();
}

function addNewProject(projectName) {
    todosContentDiv.replaceChildren();
    const projectDiv = document.createElement("div");
    projectDiv.className = "project";
    projectsDiv.appendChild(projectDiv);
    projectDiv.addEventListener("click", () => {
        let loadedProject = storage.loadProjectFromLocalStorage(projectName);
        if(!loadedProject) {
            return;
        }
        state.setCurrentProject(loadedProject);
        highlightProject(projectDiv);
        displayProject(loadedProject);
    });
    
    const projectNameEle = document.createElement("p");
    projectNameEle.className = "project-name";
    projectNameEle.innerText = projectName;

    // const editProjectBtn = document.createElement("button");
    // editProjectBtn.className = "edit-project-btn";
    // editProjectBtn.innerHTML = EDIT_ICON_SVG;
    // addEventListenersForBtn(editProjectBtn);

    const deleteProjectBtn = document.createElement("button");
    deleteProjectBtn.className = "delete-project-btn";
    deleteProjectBtn.innerHTML = DELETE_PROJECT_ICON_SVG;
    deleteProjectBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteProject(projectDiv, projectName);
    });

    projectDiv.appendChild(projectNameEle);
    // projectDiv.appendChild(editProjectBtn);
    projectDiv.appendChild(deleteProjectBtn);

    projectDivList.push(projectDiv);

    //default project is highlighted if it first time load of page
    if(selectedProjectDiv) { 
        highlightProject(projectDiv);
    }

    addProjectSeparator();
}

function highlightDefaultProject() {
    selectedProjectDiv = document.querySelector(".default-project");
    document.querySelector(".default-project").classList.add("highlight-project");
}

function highlightProject(projectDiv) {
    if(selectedProjectDiv) {
        selectedProjectDiv.classList.remove("highlight-project")
    }
    projectDiv.classList.add("highlight-project");
    selectedProjectDiv = projectDiv;
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
        
        const todoCheckbox = document.createElement("input");
        todoCheckbox.setAttribute("type", "checkbox");
        todoCheckbox.id = `todo-checkbox-${checkboxNum++}`;
        todoCheckbox.checked = todo.isCompleted;
        todoCheckbox.addEventListener("change", () => {
            handleTodoCheckboxChange(todo, todoCard, todoCheckbox.checked);
        })

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
            todoToEdit = todo;
            editTodoDialog.showModal();
            fillEditForm(todo);
        })
        
        const deleteTodoBtn = document.createElement("button");
        deleteTodoBtn.className = "delete-todo-btn";
        deleteTodoBtn.innerHTML = DELETE_TODO_ICON_SVG;
        deleteTodoBtn.addEventListener("click", () => {
            deleteTodo(todoCard, todo);
        })
        
        todoCard.appendChild(todoCheckbox);
        todoCard.appendChild(todoTitle);
        todoCard.appendChild(todoDesc);
        todoCard.appendChild(todoDueDate);
        todoCard.appendChild(todoPriority);
        todoCard.appendChild(editTodoBtn);
        todoCard.appendChild(deleteTodoBtn);
        setTodoStyles(todoCard, todo.isCompleted);
        todosContentDiv.appendChild(todoCard);
        addTodoSeparator();
        setPriorityTextColor(todoPriority);
    });
}

function setPriorityTextColor(domElement) { 
    if(domElement.innerText == "High") {
        
        domElement.style.color = "rgb(211, 31, 31)";
    }
}

function updateProjectDetails(projectNewName) {
    const projectNameEle = selectedProjectDiv.children[0];
    projectNameEle.innerText = projectNewName;
}

function deleteProject(projectDiv, projectName) {
    const separatorLine = projectDiv.nextSibling;
    projectsDiv.removeChild(separatorLine);

    //remove project from sidebar.
    projectsDiv.removeChild(projectDiv);
    deleteProjectDivFromList(projectDiv);

    storage.deleteProjectFromLocalStorage(projectName);
    
    //clear content and display default project content
    todosContentDiv.replaceChildren();
    sendProjectDeletedMessage();

}

function deleteProjectDivFromList(projectDiv) {
    const index = projectDivList.indexOf(projectDiv);
    projectDivList.splice(index, 1);
}

function deleteTodo(todoCard, todo) {
    const separatorLine = todoCard.nextSibling;
    todosContentDiv.removeChild(separatorLine);
    todosContentDiv.removeChild(todoCard);
    sendDeleteTodoMessage(todo);
}

function sendProjectDeletedMessage() {
    const eventProjectDeleted = new Event("projectDeleted");
    document.dispatchEvent(eventProjectDeleted);
}

function sendDeleteTodoMessage(todo) {
    const eventDeleteTodo = new CustomEvent("deleteTodo", {detail: todo});
    document.dispatchEvent(eventDeleteTodo);
}

function handleTodoCheckboxChange(todoToUpdate, todoCard, isTodoChecked) {
    //changes for dom elements
    setTodoStyles(todoCard, isTodoChecked);
    sendCheckboxClicked(todoToUpdate, isTodoChecked);
}

function setTodoStyles(todoCard, isTodoChecked) {
    const todoChildren = todoCard.children;
    const childrenArray = Array.from(todoChildren);
    childrenArray.forEach(childEle => {
        if(isTodoChecked) {
            childEle.style.color = "grey";
        }
        else {
            let contentColor = getComputedStyle(document.documentElement).getPropertyValue('--todo-content-color');
            childEle.style.color = contentColor;
        }
    })
}

function sendCheckboxClicked(todoToUpdate, isTodoChecked) {
    const eventChangeCheckbox = new CustomEvent("checkboxChanged", {detail: {todoToUpdate, isTodoChecked}});
    document.dispatchEvent(eventChangeCheckbox);
}

function addTodoSeparator() {
    const borderAfterTodoCard = document.createElement("p");
    borderAfterTodoCard.style.borderBottom = "1px solid rgb(153, 153, 153)";
    todosContentDiv.appendChild(borderAfterTodoCard);
}

function addProjectSeparator() {
    const borderAfterProjectDiv = document.createElement("p");
    borderAfterProjectDiv.style.borderBottom = "1px solid rgb(153, 153, 153)";
    projectsDiv.appendChild(borderAfterProjectDiv);
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

function getOptionIndex(priorityInput, priorityValueToSet) {
    for(let i = 0; i < priorityInput.options.length; i++) {
        if(priorityInput.options[i].innerText == priorityValueToSet) {
            return i;
        }
    }
    return 0;
}

function fillEditForm(todo) {
    document.getElementById("edit-title").value = todo.title;
    document.getElementById("edit-desc").value = todo.description;

    //format Date
    const day = todo.dueDate.slice(0, 2);
    const month = todo.dueDate.slice(3, 5);
    const year = todo.dueDate.slice(6, 10);
    const dateString = year + "-" + month + "-" + day;
    document.getElementById("edit-due-date").valueAsDate = new Date(dateString);
    
    const priorityInput = document.getElementById("edit-priority");
    const optionIndex = getOptionIndex(priorityInput, todo.priority);
    priorityInput.selectedIndex = optionIndex;
}

//send update todo after clicking confirm changes.
function sendUpdateTodoMessage(todoToUpdate) {
    const eventUpdateTodo = new CustomEvent("updateTodo", { detail: { todoToUpdate } });
    document.dispatchEvent(eventUpdateTodo);
}

confirmEditsBtn.addEventListener("click", (event) => {
    event.preventDefault();
    sendUpdateTodoMessage(todoToEdit);
    editTodoDialog.close();
});

export default {
    addDefaultProject,
    addNewProject,
    displayProject,
    displayTodos,
    highlightDefaultProject,
    updateProjectDetails,
};