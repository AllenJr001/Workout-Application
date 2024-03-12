"use strict";
const body = document.querySelector("body");
const apiKey = "77oaqnNFiSLn+0uUArCHVw==n4dGclKU9Uz7UAAQ";
const url = "https://api.api-ninjas.com/v1/exercises?muscle=";
const inputWorkout = document.querySelector(".input-workout");
const formWorkout = document.querySelector(".form-workout");
const formWorkoutBtns = document.querySelectorAll(".form-workout__button");
const formContainer = document.querySelector(".form-workout__container");
const addWorkoutBtns = document.querySelectorAll(
  ".search-workout-card__btn-add"
);
const grid2 = document.querySelector(".grid__col-2");
const backdrop = document.querySelector(".backdrop");
const popupBtn = document.querySelector(".popup-container__form__btn");
const popupContainer = document.querySelector(".popup-container");
const inputReps = document.querySelector(".popup-container__form__input-reps");
const inputSets = document.querySelector(".popup-container__form__input-sets");
const searchContainer = document.querySelector(".search__card-container");

const infoBtnLeave = document.querySelector(".info-container__btn-leave");
const infoContainer = document.querySelector(".info-container");

let i;
let searchWorkoutCard;
let curId;
const cardData = [];
async function getExercises(input) {
  searchContainer.innerHTML = "";
  cardData.splice(0, 10);
  let curMuscle = input;
  try {
    const response = await fetch(url + curMuscle, {
      method: "GET",
      headers: {
        "X-Api-Key": `${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    i = 0;
    data.forEach((obj) => {
      const { name, type, muscle, instructions, equipment, difficulty } = obj;
      i++;
      cardData.push({
        name,
        type,
        muscle,
        instructions,
        equipment,
        difficulty,
      });
      let htmlSearchCard = `
<div  id="card-${i}" class="search-workout-card  margin-auto margin-top-small">
<div class="search-workout-card__name align">${name}</div>
<div class="flex-container">
  <div class="search-workout-card__type">${type}</div>
  <div class="search-workout-card__muscle">${muscle}</div>
  <div class="search-workout-card__equipment">${equipment}</div>
</div>
<button class="search-workout-card__btn-add " id="${i}">add workout</button>
</div>
`;
      setTimeout(() => {
        searchWorkoutCard = document.querySelectorAll(".search-workout-card");
      }, 1000);

      searchContainer.insertAdjacentHTML("afterbegin", htmlSearchCard);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
formWorkout.addEventListener("submit", (e) => {
  e.preventDefault();
  formWorkoutBtns.forEach((btn) => btn.classList.add("hidden"));
  if (inputWorkout.value === "") {
    return;
  }

  formWorkoutBtns.forEach((btn) => {
    if (btn.textContent.includes(inputWorkout.value)) {
      btn.classList.remove("hidden");
    }
  });
});
formWorkoutBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    getExercises(btn.textContent);
  })
);
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("search-workout-card__btn-add")) {
    curId = e.target.id;
    if (!searchWorkoutCard) {
      return;
    }

    popupContainer.classList.remove("hidden");
    backdrop.classList.remove("hidden");
  }
});
popupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const { difficulty, equipment, instructions, muscle, name, type } =
    cardData[curId - 1];
  const reps = inputReps.value;
  const sets = inputSets.value;

  if (
    reps === "" ||
    isNaN(reps) ||
    sets === "" ||
    isNaN(sets) ||
    reps < 0 ||
    sets < 0
  ) {
    return;
  }

  let htmlCard = `
    <div class="workout-card margin-auto ">
            <div class="workout-card-extras">
              <div class="workout-card__name">${name}</div>
              <button class="workout-card__btn workout-card__btn-close">
              <img title="exit" class="workout-card__btn-close-icon-close" src="icon-close.png" alt=""/>
            </button>
            <button title="info" class="workout-card__btn workout-card__btn-info">
              <img class="workout-card__btn-close-icon-info" src="icon-info.png" alt="" />
            </button>
            <button class="workout-card__btn workout-card__btn-edit" title="edit">
              <img class="workout-card__btn-edit-icon-edit" src="icon-edit.png" alt="" />
            </button>
          </div>

            
            <div class="workout-card-misc">
              <div class="workout-card-misc__reps">${inputReps.value} reps</div>
              <div class="workout-card-misc__sets">${inputSets.value} sets</div>
            </div>
          </div>
    `;
  grid2.insertAdjacentHTML("afterbegin", htmlCard);
  popupContainer.classList.add("hidden");
  backdrop.classList.add("hidden");
});
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("workout-card__btn-close")) {
    const curCard = e.target.parentElement.parentElement;
    grid2.removeChild(curCard);
  }
});
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("workout-card__btn-info")) {
    const { difficulty, equipment, instructions, muscle, name, type } =
      cardData[curId - 1];
    let cardHTML = `
      <div class="info-container">
      <img
          title="exit"
          class="info-container__btn-leave"
          src="icon-close.png"
          alt=""
        />
      <p class="info-container-text info-container-text__title align">${name}</p>
      <p class="info-container-text workout-card-extras__muscle">
        muscle group: ${muscle}
      </p>
      <p class="info-container-text workout-card-extras__type">${type}</p>
      <p class="info-container-text workout-card-extras__equipment">
        equipment:${equipment}
      </p>
      <p class="info-container-text workout-card-extras__muscle">
        difficulty: ${difficulty}
      </p>
      <p class="info-container-text info-container-text__description">
       Instructions:  ${instructions}
      </p>
    </div>
      `;

    backdrop.classList.remove("hidden");
    body.insertAdjacentHTML("beforeend", cardHTML);
  }
});
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("info-container__btn-leave")) {
    backdrop.classList.add("hidden");
    const curCard = e.target.parentElement;
    body.removeChild(curCard);
  }
});
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("workout-card__btn-edit")) {
    backdrop.classList.remove("hidden");
    popupContainer.classList.remove("hidden");
    const curCard = e.target.parentElement.parentElement;
    grid2.removeChild(curCard);
  }
});
