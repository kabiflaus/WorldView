let todos = JSON.parse(localStorage.getItem('wv-todos') || '[]');

function saveTodos() {
    localStorage.setItem('wv-todos', JSON.stringify(todos));
}

function renderTodos() {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';

    todos.forEach((category, ci) => {
        const li = document.createElement('li');
        li.className = 'todo-category';
        li.innerHTML = `
            <div class="todo-cat-header">
                <span class="todo-cat-name">${category.name}</span>
                <button class="todo-cat-add" onclick="addItem(${ci})">＋ Aufgabe</button>
                <button class="todo-delete" onclick="deleteCategory(${ci})">✕</button>
            </div>
            <ul class="todo-items">
                ${category.items.map((item, ii) => `
                    <li class="todo-item ${item.done ? 'done' : ''}">
                        <button class="todo-check" onclick="toggleItem(${ci},${ii})">${item.done ? '✓' : ''}</button>
                        <span class="todo-text">${item.text}</span>
                        <button class="todo-delete" onclick="deleteItem(${ci},${ii})">✕</button>
                    </li>
                `).join('')}
            </ul>
        `;
        list.appendChild(li);
    });
}

function addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (!text) return;
    todos.push({ name: text, items: [] });
    saveTodos();
    renderTodos();
    input.value = '';
}

function addItem(ci) {
    const text = prompt('Aufgabe:');
    if (!text) return;
    todos[ci].items.push({ text, done: false });
    saveTodos();
    renderTodos();
}

function toggleItem(ci, ii) {
    todos[ci].items[ii].done = !todos[ci].items[ii].done;
    saveTodos();
    renderTodos();
}

function deleteItem(ci, ii) {
    todos[ci].items.splice(ii, 1);
    saveTodos();
    renderTodos();
}

function deleteCategory(ci) {
    todos.splice(ci, 1);
    saveTodos();
    renderTodos();
}

document.getElementById('todo-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTodo();
});

renderTodos();