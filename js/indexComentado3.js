$(document).ready(function () { // Espera até que o documento esteja pronto para ser manipulado
    // Função para carregar tarefas do localStorage
    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Obtém as tarefas do localStorage ou cria uma lista vazia se não houver nenhuma
        tasks.sort((a, b) => b.priority - a.priority || a.text.localeCompare(b.text)); // Ordena as tarefas por prioridade e, em caso de empate, por texto
        $('#todoList').empty(); // Limpa a lista de tarefas
        tasks.forEach(task => { // Para cada tarefa, adiciona-a à lista
            addTaskToList(task);
        });
    }

    // Função para salvar tarefas no localStorage
    function saveTasks() {
        let tasks = [];
        $('#todoList li').each(function () { // Para cada item da lista de tarefas
            let text = $(this).find('.task-text').text(); // Obtém o texto da tarefa
            let priority = $(this).find('.priority span.active').length; // Obtém a prioridade da tarefa contando o número de estrelas ativas
            let done = $(this).hasClass('done'); // Verifica se a tarefa está marcada como concluída
            tasks.push({ text, priority, done }); // Adiciona a tarefa à lista de tarefas
        });
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Salva a lista de tarefas no localStorage
    }

    // Função para adicionar uma tarefa à lista
    function addTaskToList(task) {
        let stars = '';
        for (let i = 1; i <= 3; i++) { // Adiciona estrelas para indicar a prioridade da tarefa
            stars += `<span class="${i <= task.priority ? 'active' : 'inactive'}">&#9733;</span>`;
        }
        // Adiciona o HTML da tarefa à lista de tarefas
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
    //---------------------------------------------------------------
    // Função para capitalizar a primeira letra, tornando-a maiúscula
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    //---------------------------------------------------------------

    // Função para adicionar uma nova tarefa
    function addTask() {
        let taskText = $('#taskInput').val().trim(); // Obtém o texto da tarefa do campo de entrada
        if (taskText) { // Se o texto não estiver vazio
            taskText = capitalizeFirstLetter(taskText); // Capitaliza a primeira letra
            let task = { text: taskText, priority: 0, done: false }; // Cria um novo objeto de tarefa
            addTaskToList(task); // Adiciona a tarefa à lista
            saveTasks(); // Salva as tarefas no localStorage
            $('#taskInput').val(''); // Limpa o campo de entrada
            $('#taskInput').focus(); //Mantem o foco no input
        }
    }

    // Adiciona uma nova tarefa quando o botão de adicionar tarefa é clicado
    $('#addTaskBtn').click(function () {
        addTask();
    });

    // Adiciona uma nova tarefa quando a tecla Enter é pressionada no campo de entrada
    $('#taskInput').keypress(function (e) {
        if (e.which === 13) { // 13 é o código da tecla Enter
            addTask();
        }
    });

    // Atualiza a prioridade da tarefa quando uma estrela é clicada
    $('#todoList').on('click', '.priority span', function () {
        let index = $(this).index() + 1; // Obtém o índice da estrela clicada
        $(this).parent().find('span').each(function (i) { // Atualiza a classe das estrelas
            $(this).toggleClass('active', i < index).toggleClass('inactive', i >= index);
        });
        saveTasks(); // Salva as tarefas no localStorage
    });

    // Edita a tarefa quando o botão de edição é clicado
    $('#todoList').on('click', '.edit', function () {
        let taskText = $(this).closest('li').find('.task-text').text(); // Obtém o texto da tarefa
        $('#taskInput').val(taskText); // Coloca o texto da tarefa no campo de entrada
        $(this).closest('li').remove(); // Remove a tarefa da lista
        saveTasks(); // Salva as tarefas no localStorage
    });

    // Remove a tarefa quando o botão de excluir é clicado
    $('#todoList').on('click', '.delete', function () {
        $(this).closest('li').remove(); // Remove a tarefa da lista
        saveTasks(); // Salva as tarefas no localStorage
    });

    // Marca ou desmarca a tarefa como concluída quando o texto da tarefa é clicado
    $('#todoList').on('click', '.task-text', function () {
        $(this).closest('li').toggleClass('done'); // Alterna a classe 'done' na tarefa
        saveTasks(); // Salva as tarefas no localStorage
    });

    // Adiciona um botão para atualizar a prioridade das tarefas
    $('#updatePriorityBtn').click(function () {
        loadTasks(); // Recarrega as tarefas e as ordena
    });

    // Carrega as tarefas do localStorage ao carregar a página
    loadTasks();
});
