'use strict';

// создали переменные - нашли нужные нам элементы на странице
const addTaskBtn = document.querySelector('#add-task');
const inputDescription = document.querySelector('#description');
const ToDos = document.querySelector('.todos');

// создали основной массив с задачами, в него будут поступать все новые созданные
// этот массив напрямую связан с локальным хранилищем
let taskList;

// описали функцию занесения массива с задачами в локальное хранилище
const updateLocal = () => {
    localStorage.setItem('taskList', JSON.stringify(taskList))
}

// нам важно отрисовывать сохраненные элементы в локальном хранилище при перезагрузке страницы
// поэтому обращаемся в локальное хранилище, и если не пустое - парсим данные оттуда и вставляем в массив для отрисовки на странице 
!localStorage.taskList ? taskList=[] : taskList=JSON.parse(localStorage.getItem('taskList'));

// создали новый массив, в него будут помещаться все элементы, которые уже ОТРИСОВАНЫ на странице
// это нужно, чтобы добавлять различные оформления на отрисованные элементы
let todoItemElems =[];

//создаем класс Task, по которому будем создавать объект задач и вставлять его в массив
class Task {
    constructor(description) {
        this.description = description;
        this.completed = false;
    }
}

// ниже мы создаем отрисовку одной задачи в блоке Список задач
const createTemplate = (task, index) => {
    return `
        <div class="todo-item" ${task.completed ? 'checked' : ''}>
            <div class="description">${task.description}</div>
            <div class="actions">
                <input onclick="completeTask(${index})" type="checkbox" ${task.completed ? 'checked' : ''}>
                <button onclick="deleteTask(${index})" class="del-btn">Удалить</button>
            </div>
        </div>
    `
}

// функция фильтрации выполненных и невыполненных заданий
// отфильтровали исходный массив по completed, создали 2 новых массива и по очереди вставили их в taskList (обновили его)
// (обязательно распространение массивов через ..., поскольку идет конкатенация)
// дальше этот новый массив мы вставляем в fillHtmlList (ниже функция), которая нам отрисовывает наполнение HTML-элементов на странице
const filterTasks = () => {
    const activeTasks = taskList.length && taskList.filter(item => item.completed == false);
    const completedTasks = taskList.length && taskList.filter(item => item.completed == true);
    taskList = [...activeTasks, ...completedTasks]
}

// функция, по которой идет наполнение элементов в Списке задач для их отрисовки
const fillHtmlList = () => {
    ToDos.innerHTML = ''; // сначала стираем содержимое
    if(taskList.length > 0) {
        filterTasks(); // вызвали отфильтрованный массив
        taskList.forEach((item, index) => { // для каждого элемента массива
            ToDos.innerHTML += createTemplate(item, index); // вызвали функцию отрисовки и вставки в блок Список задач
        });
        todoItemElems = document.querySelectorAll('.todo-item'); // отрисованные элементы сохралили в новом массиве отрисованных элементов (ранее создали массив)
    }
}

// теперь выводится массив с сохраненными значениями и автофильтрующийся по выполненным/активным задачам
fillHtmlList();

// Описание функции завершения задачи (или наоборот "активизации" задачи)
const completeTask = index => {
    taskList[index].completed = !taskList[index].completed;
    if (taskList[index].completed) {
        todoItemElems[index].classList.add('checked');
    } else {todoItemElems[index].classList.remove('checked')}
    updateLocal(); // всякий раз нам нужно обновлять локальное хранилище
    fillHtmlList(); // и заново перерисовывать отображение на странице
}

// Описание функции удаления элемента (и со страницы, и из массива, и из локального хранилища)
// поскольку элемент еще не орисован, создали функцию, а уже в createTemplate (выше) на нужный нам элемент..
// ..повесили обработчик события через onclick='deleteTask(${index})'
// индекс нужен, чтобы обработчик понимал, на каком элементе нужно выполнить событие
const deleteTask = index => {
    todoItemElems[index].classList.add('smooth'); // при нажатии на "Удалить" добавляем класс, чтобы он успел проиграть
    setTimeout(() => { // сначала идет отрисовка анимации
        taskList.splice(index, 1); // далее этот элемент удаляется из массива
        updateLocal(); // обновляем локальное хранилище, чтобы элемент удалился оттуда
        fillHtmlList(); // заново орисовываем на странице элементы
    },500) // задержка в выполнении полсекунды после клика
}

// на кнопку добавления повесили слушатель события и описали логику создания новой задачи
// получение значения из пользовательского инпута
// добавление в массив задач
addTaskBtn.addEventListener('click', (e) => {
    e.preventDefault();
    taskList.push(new Task(inputDescription.value));
    updateLocal();
    fillHtmlList();
    inputDescription.value='';
});


