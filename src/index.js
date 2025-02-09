import "./pages/index.css";


import {initialCards} from './components/cards';

const addIcon = new URL("./images/add-icon.svg", import.meta.url);
const avatar = new URL("./images/avatar.jpg", import.meta.url);
const card1 = new URL("./images/card_1.jpg", import.meta.url);
const card2 = new URL("./images/card_2.jpg", import.meta.url);
const card3 = new URL("./images/card_3.jpg", import.meta.url);
const close = new URL("./images/close.svg", import.meta.url);
const deleteIcon = new URL("./images/delete-icon.svg", import.meta.url);
const editIcon = new URL("./images/edit-icon.svg", import.meta.url);
const likeActive = new URL("./images/like-active.svg", import.meta.url);
const logo = new URL("./images/logo.svg", import.meta.url);
const likeInactive = new URL("./images/like-inactive.svg", import.meta.url);


const images = [
  // меняем исходные пути на переменные
  { name: "addIcon", link: addIcon },
  { name: "avatar", link: avatar },
  { name: "card1", link: card1 },
  { name: "card2", link: card2 },
  { name: "card3", link: card3 },
  { name: "close", link: close },
  { name: "deleteIcon", link: deleteIcon },
  { name: "editIcon", link: editIcon },
  { name: "likeActive", link: likeActive },
  { name: "likeInactive", link: likeInactive },
  { name: "logo", link: logo },
];




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


