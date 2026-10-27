document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.task-form');
  const list = document.querySelector('.task-list');
  const template = document.querySelector('#task-template');
  const heading = form.querySelector('.task-form__heading');
  const submitBtn = form.querySelector('button[type="submit"]');
  const cancelBtn = form.querySelector('.task-form__cancel');

  let isEditing = false;
  let currentEditedElement = null;

  function resetForm() {
    form.reset();
    isEditing = false;
    if (currentEditedElement) {
      currentEditedElement.classList.remove('task-card--editing');
    }
    currentEditedElement = null;
    heading.textContent = 'Нове завдання';
    submitBtn.textContent = 'Додати';
    cancelBtn.hidden = true;
  }

  // Відправка форми: додавання або редагування
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const taskData = Object.fromEntries(new FormData(form));

    if (!taskData.title.trim() || !taskData.desc.trim()) {
      alert('Заповніть назву й опис завдання.');
      return;
    }

    if (isEditing && currentEditedElement) {
      // Редагування: оновлюємо textContent елементів BEM новими даними
      currentEditedElement.querySelector('.task-card__title').textContent = taskData.title;
      currentEditedElement.querySelector('.task-card__desc').textContent = taskData.desc;
      currentEditedElement.querySelector('.task-card__priority').textContent =
        'Пріоритет: ' + taskData.priority;
      currentEditedElement.dataset.priority = taskData.priority;
    } else {
      // Додавання: клонуємо шаблон
      const card = template.content.cloneNode(true).querySelector('.task-card');
      card.querySelector('.task-card__title').textContent = taskData.title;
      card.querySelector('.task-card__desc').textContent = taskData.desc;
      card.querySelector('.task-card__priority').textContent =
        'Пріоритет: ' + taskData.priority;
      card.dataset.priority = taskData.priority;
      list.append(card);
    }

    resetForm();
  });

  // Делегування подій: один обробник на батьківському контейнері
  list.addEventListener('click', (event) => {
    const card = event.target.closest('.task-card');
    if (!card) return;

    if (event.target.closest('.task-card__btn--delete')) {
      if (confirm('Видалити це завдання?')) {
        if (card === currentEditedElement) resetForm();
        card.remove();
      }
    }

    if (event.target.closest('.task-card__btn--edit')) {
      if (currentEditedElement) {
        currentEditedElement.classList.remove('task-card--editing');
      }
      isEditing = true;
      currentEditedElement = card;
      card.classList.add('task-card--editing');

      form.elements.title.value = card.querySelector('.task-card__title').textContent;
      form.elements.desc.value = card.querySelector('.task-card__desc').textContent;
      form.elements.priority.value = card.dataset.priority;

      heading.textContent = 'Редагування завдання';
      submitBtn.textContent = 'Зберегти';
      cancelBtn.hidden = false;
      form.elements.title.focus();
    }
  });

  cancelBtn.addEventListener('click', resetForm);
});