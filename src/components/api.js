export function getUserInformation() {
  return fetch("https://nomoreparties.co/v1/wff-cohort-33/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "0ae5b52a-cf5b-4c64-a6ed-5b7a5c2cfd81",
    },
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response.status);
  });
}

export function getCards() {
  return fetch("https://nomoreparties.co/v1/wff-cohort-33/cards", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "0ae5b52a-cf5b-4c64-a6ed-5b7a5c2cfd81",
    },
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response.status);
  });
}

export function getCardsFromTheServer() {
  return Promise.all([getUserInformation(), getCards()]);
}

export function profileEditing() {
  return fetch("https://nomoreparties.co/v1/wff-cohort-33/users/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "0ae5b52a-cf5b-4c64-a6ed-5b7a5c2cfd81",
    },
    body: JSON.stringify({
      name: "Andrey",
      about: "I am a student",
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response.status);
  });
}

export function addNewCard(newCard) {
  return fetch("https://nomoreparties.co/v1/wff-cohort-33/cards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "0ae5b52a-cf5b-4c64-a6ed-5b7a5c2cfd81",
    },
    body: JSON.stringify({
      name: newCard.name,
      link: newCard.link,
      alt: newCard.alt,
    }),
  }).then((respone) => {
    if (respone.ok) {
      return respone.json();
    }
    return Promise.reject(respone.status);
  });
}

export function addLike(cardId) {
  return fetch(
    `https://nomoreparties.co/v1/wff-cohort-33/cards/likes/${cardId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "0ae5b52a-cf5b-4c64-a6ed-5b7a5c2cfd81",
      },
    }
  ).then((respone) => {
    if (respone) {
      return respone.json();
    }
    return Promise.reject(respone.status);
  });
}

export function deleteLike(cardId) {
  return fetch(
    `https://nomoreparties.co/v1/wff-cohort-33/cards/likes/${cardId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "0ae5b52a-cf5b-4c64-a6ed-5b7a5c2cfd81",
      },
    }
  ).then((respone) => {
    if (respone) {
      return respone.json();
    }
    return Promise.reject(respone.status);
  });
}

export function newAvatar() {
  return fetch("https://nomoreparties.co/v1/wff-cohort-33/users/me/avatar", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "0ae5b52a-cf5b-4c64-a6ed-5b7a5c2cfd81",
    },
    body: JSON.stringify({
      avatar:
        "https://yandex.ru/images/search?text=фотография+студента+мультяшного&pos=15&rpt=simage&img_url=https%3A%2F%2Fsun1-24.userapi.com%2Fs%2Fv1%2Fif1%2FOYDYbajaGGM4ZzBD7MHgxMNkBLbCl92YJASfkXcYNa9uQ97Xy5DsVAcmaHZdAtA9J_P8f38U.jpg%3Fsize%3D748x1080%26quality%3D96%26crop%3D0%2C0%2C748%2C1080%26ava%3D1&from=tabbar&lr=65",
    }),
  })
    .then((respones) => {
      if (respones.ok) {
        return respones.json();
      }
      return Promise.reject(respones.status);
    })
    .catch((error) => {
      console.error(error);
    });
}
