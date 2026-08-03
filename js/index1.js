$(document).ready(function() {
    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.sort((a, b) => b.priority - a.priority || a.text.localeCompare(b.text));
        $('#todoList').empty();
        tasks.forEach(task => {
            addTaskToList(task);
        });
    }

    function saveTasks() {
        let tasks = [];
        $('#todoList li').each(function() {
            let text = $(this).find('.task-text').text();
            let priority = $(this).find('.priority span.active').length;
            let done = $(this).hasClass('done');
            tasks.push({ text, priority, done });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function addTaskToList(task) {
        let stars = '';
        for (let i = 1; i <= 3; i++) {
            stars += `<span class="${i <= task.priority ? 'active' : 'inactive'}">&#9733;</span>`;
        }
        $('#todoList').append(`
            <li class="${task.done ? 'done' : ''}">
                <span class="task-text">${task.text}</span>
                <div class="priority">${stars}</div>
                <div class="actions">
                    <button class="edit">&#9998;</button>
                    <button class="delete">&#10005;</button>
                </div>
            </li>
        `);
    }

    $('#addTaskBtn').click(function() {
        let taskText = $('#taskInput').val().trim();
        if (taskText) {
            let task = { text: taskText, priority: 0, done: false };
            addTaskToList(task);
            saveTasks();
            $('#taskInput').val('');
        }
    });

    $('#todoList').on('click', '.priority span', function() {
        let index = $(this).index() + 1;
        $(this).parent().find('span').each(function(i) {
            $(this).toggleClass('active', i < index).toggleClass('inactive', i >= index);
        });
        saveTasks();
    });

    $('#todoList').on('click', '.edit', function() {
        let taskText = $(this).closest('li').find('.task-text').text();
        $('#taskInput').val(taskText);
        $(this).closest('li').remove();
        saveTasks();
    });

    $('#todoList').on('click', '.delete', function() {
        $(this).closest('li').remove();
        saveTasks();
    });

    $('#todoList').on('click', 'li', function() {
        $(this).toggleClass('done');
        saveTasks();
    });

    loadTasks();
});
