// setting the alphabet :

let alphabet = "abcdefghijklmnopqrstuvwxyz";

// setting the array for the key word section :

let AllKeyWords = Array.from(alphabet);

// Creating the KeyWords inside the html :

AllKeyWords.forEach((word) => {
  let newDiv = document.createElement("div");
  let divText = document.createTextNode(word);
  document.querySelector(".keywords").appendChild(newDiv);
  newDiv.appendChild(divText);
  newDiv.classList.add("word");
});

// fetching the guessing word :
let fetchingKeys;

fetch("./hangman.json")
  .then((response) => response.json())
  .then((data) => {
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
    document.getElementById("hint").innerHTML = randomSubject;

    //setting the display-word for the guessing word :
    let wordArr = Array.from(guessingWord);
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
          }
          if (mistake === 8) {
            loss(guessingWord);
          }
        } else {
          win(mistake);
        }
      });
    });
    keyboard;
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function win(Condition) {
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
    button.textContent = "Play Again!";
    document.body.appendChild(div);
    document.querySelector(".game-container").classList.add("blur");
    document.getElementById("won").play();
    let btn = document.querySelector("#play-again");
    btn.addEventListener("click", () => {
      window.location.reload();
    });
  } else {
    behavior = false;
    ("not yet");
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
    window.location.reload();
  });
}
