(function() {
  // создаем массив для хранения дел
  let todoArray = [];

  // создаем переменную для работы с LocalStorage
  let todoLocalStorageKey = '';

  // функция для определения id для нового дела
  function getNewItemId(arr) {
    let maxItemId = 0;
    for (let i = 0; i < arr.length; ++i) {
      if (Number.isInteger(arr[i].id) && arr[i].id > maxItemId) {
        maxItemId = arr[i].id;
      }
    }
    return maxItemId + 1;
  }

  // функция для сохранения списка дел в LocalStorage
  function saveListToLocalStorage(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
  }

  // функция для чтения списка дел из LocalStorage
  function getListFromLocalStorage(key) {
    let localData = JSON.parse(localStorage.getItem(key));
    return localData ? localData : [];
  }

  // функция для добавления дела в массив и LocalStorage
  function addItemToLocalStorage(obj) {
    todoArray.push(obj);
    saveListToLocalStorage(todoLocalStorageKey, todoArray);
  }

  // функция для удаления дела из массива и LocalStorage
  function removeItemFromLocalStorage(id) {
    let newTodoArray = [];
    for (let i = 0; i < todoArray.length; ++i) {
      if (todoArray[i].id !== id) {
        newTodoArray.push(todoArray[i]);
      }
    }
    todoArray = newTodoArray;
    saveListToLocalStorage(todoLocalStorageKey, todoArray);
  }

  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.setAttribute('disabled', true);

    form.addEventListener('input', function () {
      button.disabled = !input.value;
    });

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // создаем элемент списка
  function createTodoItem(obj) {
    let item = document.createElement('li');

    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    if (obj.done === true) {
      item.classList.add('list-group-item-success');
    }

    doneButton.addEventListener('click', function() {
      item.classList.toggle('list-group-item-success');
      for (let todoArrayItem of todoArray) {
        if (todoArrayItem.id === obj.id) {
          todoArrayItem.done = !todoArrayItem.done;
        }
      }
      saveListToLocalStorage(todoLocalStorageKey, todoArray);
    });

    deleteButton.addEventListener('click', function() {
      if (confirm('Вы уверены?')) {
        item.remove();
        removeItemFromLocalStorage(obj.id);
      }
    });

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  // функция создания приложения TODO
  function createTodoApp(container, title = 'Список дел', listName) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    todoLocalStorageKey = listName;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    todoArray = getListFromLocalStorage(todoLocalStorageKey);

    if (todoArray.length > 0) {
      for (let savedItem of todoArray) {
        let todoItem = createTodoItem(savedItem);
        todoList.append(todoItem.item);
      }
    }

    todoItemForm.form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      let todoObj = {
        id: getNewItemId(todoArray),
        name: todoItemForm.input.value,
        done: false,
      }

      let todoItem = createTodoItem(todoObj);
      todoList.append(todoItem.item);

      addItemToLocalStorage(todoObj);

      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    });
  }

  // регистрируем функцию создания приложения TODO в глобальном объекте window
  window.createTodoApp = createTodoApp;
})();
