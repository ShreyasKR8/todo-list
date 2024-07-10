const mainContentDiv = document.querySelector(".main-content");

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
    displayTodos,
};