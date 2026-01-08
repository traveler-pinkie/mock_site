document.querySelector('#todoButton').addEventListener('click', function() {
    const todoInput = document.querySelector('#todoInput');
    const todoList = document.querySelector('.todo-list');
    const newTask = document.createElement('li');
    newTask.textContent = todoInput.value;
    todoList.appendChild(newTask);
    todoInput.value = '';
});