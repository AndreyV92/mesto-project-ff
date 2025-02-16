export function createCard(item, deleteCard, openImage, likeCard, cardTemplate) {
  const cardTemplateCopy = cardTemplate.querySelector('.places__item').cloneNode(true);
  cardTemplateCopy.querySelector('.card__image').src = item.link;
  cardTemplateCopy.querySelector('.card__image').name = item.name;
  cardTemplateCopy.querySelector('.card__title').textContent = item.name;
  const cardCopy = cardTemplateCopy.querySelector('.card__delete-button');
  cardCopy.addEventListener('click', (event) => {
    deleteCard(event.target.closest('.places__item'));
  })

  cardTemplateCopy.querySelector('.card__image').addEventListener('click', () => {
    openImage(item);
  })

  cardTemplateCopy.querySelector('.card__like-button').addEventListener('click', (event) => {
    likeCard(event.target)
  })

  return cardTemplateCopy;
}

export function deleteCard(cardTemplateCopy) {
  cardTemplateCopy.remove();
}

export function addCard(cardTemplateCopy, placesList) {
  placesList.prepend(cardTemplateCopy);
  return cardTemplateCopy
}

export function likeCard(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}

