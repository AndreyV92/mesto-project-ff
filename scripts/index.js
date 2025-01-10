// @todo: Темплейт карточки
// @todo: DOM узлы


// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

// 

const cardTemplate = document.querySelector('#card-template').content;
const content = document.querySelector('.content');
const placesList = content.querySelector('.places__list');



function createCard(item, deleteCard) {
  const cardTemplateCopy = cardTemplate.querySelector('.places__item').cloneNode(true);
  cardTemplateCopy.querySelector('.card__image').src = item.link;
  cardTemplateCopy.querySelector('.card__image').alt = item.alt;
  cardTemplateCopy.querySelector('.card__title').textContent = item.name;

  const cardCopy = cardTemplateCopy.querySelector('.card__delete-button');
  cardCopy.addEventListener('click', (event) => {
    deleteCard(event.target.closest('.places__item'));
  })
  return cardTemplateCopy;
}

function deleteCard(cardTemplateCopy) {
  cardTemplateCopy.remove();
}

function addCard(cardTemplateCopy, placesList) {
  placesList.append(cardTemplateCopy);
  return cardTemplateCopy
}

initialCards.forEach((item) => {
  addCard(createCard(item, deleteCard), placesList)
})


