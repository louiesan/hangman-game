// setting the alphabet :

let alphabet = "abcdefghijklmnopqrstuvwxyz";

// setting the array for the key word section :

let AllKeyWords = Array.from(alphabet);

const levelSection = document.getElementById("high-level");

// Creating the KeyWords inside the html :

AllKeyWords.forEach((word) => {
  let newDiv = document.createElement("div");
  let divText = document.createTextNode(word);
  document.querySelector(".keywords").appendChild(newDiv);
  newDiv.appendChild(divText);
  newDiv.classList.add("word");
});

const Chances = document.getElementById("chances");
let level = [];
let highestLevel = 0;

if (
  window.localStorage.getItem("highLevel") ||
  window.localStorage.getItem("highestLevel")
) {
  level = JSON.parse(window.localStorage.getItem("highLevel"));
  highestLevel = Number(window.localStorage.getItem("highestLevel"));
}
// fetching the guessing word :
let fetchingKeys;

fetch("./hangman.json")
  .then((response) => response.json())
  .then((data) => {
    setTimeout(() => {
      if (level.length >= 10) {
        levelMax();
      } else {
      }
    }, 100);
    let mistake = 0;

    fetchingKeys = Object.keys(data);
    // setting random number for the key words subject :
    let randomSubjectNumber = Math.floor(Math.random() * fetchingKeys.length);
    // setting random subject :
    let randomSubject = fetchingKeys[randomSubjectNumber];
    // setting random subject array :
    let randomSubjectArray = data[randomSubject];
    // setting random number for guessing word :
    let randomGuessNumber = Math.floor(
      Math.random() * randomSubjectArray.length
    );
    // setting guessing word :
    let guessingWord = randomSubjectArray[randomGuessNumber];

    let confirmArray = [];
    for (let i = 0; i < fetchingKeys.length; i++) {
      for (let j = 0; j < data[fetchingKeys[i]].length; j++) {
        confirmArray.push(data[fetchingKeys[i]][j]);
      }
    }
    console.log(confirmArray);
    console.log(level.length);

    function newWordd() {
      let found = false;
      if (level.includes(guessingWord)) {
        for (let j = 0; j < randomSubject.length; j++) {
          randomSubject = fetchingKeys[j];
          for (let i = 0; i < randomSubjectArray.length; i++) {
            guessingWord = randomSubjectArray[i];
            if (level.includes(guessingWord)) {
              found = false;
              continue;
            } else {
              found = true;
              break;
            }
          }
          if (found) {
            break;
          } else {
            continue;
          }
        }
      }
    }
    newWordd();
    levelSection.innerText = highestLevel;
    document.getElementById("hint").innerHTML = randomSubject;
    console.log(fetchingKeys);
    console.log(fetchingKeys.length);

    let wordArr;

    //setting the display-word for the guessing word :
    wordArr = Array.from(guessingWord);
    wordArr.forEach((word) => {
      let div = document.createElement("span");
      document.querySelector(".words-display").appendChild(div);
      if (word === " ") {
        div.classList.add("space");
      }
      div.classList.add("word-box");
    });

    // setting the keyboard :
    let keyboard = document.querySelectorAll(".word");
    keyboard.forEach((key) => {
      key.addEventListener("click", () => {
        let status;
        status = false;
        let comparedWord = document.querySelectorAll(".word-box");
        let word = key.innerHTML.toUpperCase();
        key.classList.add("clicked");
        wordArr.forEach((ele, index) => {
          if (ele.toUpperCase() === word) {
            comparedWord[index].innerHTML = word;
            status = true;
            document.getElementById("correct").load();
            document.getElementById("correct").play();
          } else if (ele === " ") {
            comparedWord[index].innerHTML = " ";
            status = true;
          }
        });
        if (!status) {
          mistake++;
          Chances.innerHTML = 8 - mistake;
          document.querySelector(".draw").classList.add(`mistaken-${mistake}`);
          document.getElementById("wrong").load();
          document.getElementById("wrong").play();
          if (mistake === 1) {
            document.getElementById("spawn").load();
            document.getElementById("spawn").play();
            document.querySelector(".hang").classList.add("spawn");
          } else if (mistake > 1 && mistake <= 7) {
            document.getElementById("wosh").load();
            document.getElementById("wosh").play();
            if (Chances.innerHTML >= 3 && Chances.innerHTML <= 6) {
              Chances.classList.remove("safe");
              Chances.classList.add("careFul");
            } else {
              Chances.classList.remove("careFul");
              Chances.classList.add("in-danger");
            }
          }
          if (mistake === 8) {
            loss(guessingWord);
          }
        } else {
          win(mistake, guessingWord, confirmArray);
        }
      });
    });
    keyboard;
    console.log(level);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function win(Condition, guessingWord, confirmArray) {
  let behavior = 0;
  let condition = false;
  let comparedWord = document.querySelectorAll(".word-box");
  comparedWord.forEach((word) => {
    if (word.innerHTML !== "") {
      behavior++;
      if (behavior === comparedWord.length) {
        condition = true;
      } else {
        condition = false;
      }
    }
  });
  if (condition) {
    let div = document.createElement("div");
    let h4 = document.createElement("h4");
    let h2 = document.createElement("h2");
    let button = document.createElement("button");
    button.setAttribute("id", "play-again");
    div.classList.add("winner");
    if (Condition === 0) {
      h4.textContent = "Legend";
      h2.textContent = "AMAZING! You've won! ULTIMATE STREAK";
    } else if (Condition === 1) {
      h4.textContent = "Epic";
      h2.textContent = "AWSOME! You were to close to the Ultimate Streak!";
    } else if (Condition > 1 && Condition < 5) {
      h4.textContent = "Excellent";
      h2.textContent = "Well Played , You've won!";
    } else if (Condition > 5 && Condition < 6) {
      h4.textContent = "Fine";
      h2.textContent = "You've won!, But you gotta lock in";
    } else {
      h4.textContent = "Lucky Rookie";
      h2.textContent = "You won Rookie, next time won't be by yourside";
    }
    div.appendChild(h4);
    div.appendChild(h2);
    div.appendChild(button);
    button.textContent = "Next Level";
    document.body.appendChild(div);
    document.querySelector(".game-container").classList.add("blur");
    document.getElementById("won").play();
    highestLevel++;
    let btn = document.querySelector("#play-again");
    btn.addEventListener("click", () => {
      level.push(guessingWord);
      window.localStorage.setItem("highLevel", JSON.stringify(level));
      window.localStorage.setItem("highestLevel", highestLevel);
      window.location.reload();
    });
  } else {
    behavior = false;
  }
}

function loss(TheWord) {
  let div = document.createElement("div");
  let h4 = document.createElement("h4");
  let button = document.createElement("button");
  button.setAttribute("id", "play-again");
  div.classList.add("game-over");
  h4.innerHTML = `Game Over! The word was <span>"${TheWord.toUpperCase()}"</span>`;
  div.appendChild(h4);
  button.innerHTML = "Play Again ?";
  div.appendChild(button);
  document.body.appendChild(div);
  document.querySelector(".game-container").classList.add("blur");
  document.getElementById("loose").play();
  document.querySelectorAll(".word").forEach((word) => {
    word.classList.add("clicked");
  });
  let btn = document.querySelector("#play-again");

  btn.addEventListener("click", () => {
    window.localStorage.clear();
    location.reload();
  });
}

function levelMax() {
  let leveleDone = document.getElementById("level-max");
  let rest = document.getElementById("Restart");
  document.getElementById("won").load();
  document.getElementById("won").play();
  document.querySelector(".game-container").style.filter = "blur(10px)";
  leveleDone.classList.remove("none");
  leveleDone.classList.add("flex");
  rest.addEventListener("click", () => {
    window.localStorage.clear();
    location.reload();
  });
}
