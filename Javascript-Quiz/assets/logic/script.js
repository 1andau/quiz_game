//Variables = qNumber(null), timer(num), score(num), initials(text)
let timer = 190;
let runningTimer;
let score = 0;
let username = "";
let qNumber;
let finalScore;
const MAX_HIGH_SCORES = 100;

//DOM Objects = START BUTTON, ANSWER BUTTONS, QUESTION CONTAINER, QUESTION ELEMENT
const startButton = document.getElementById("startButton");
const qContainer = document.getElementById("questionsContainer");
const qElement = document.getElementById("question");
const answerButtons = document.getElementById("answers");
const countdown = document.getElementById("timerArea");
const scoreArea = document.getElementById("scoreArea");
const highScoresButton = document.getElementById("showScoresButton");

//LocalStorage Objects
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
//

startButton.addEventListener("click", startGame);
highScoresButton.addEventListener("click", displayScores);

//function to start the game
//called when start button is clicked, should run the function to display questions and the function to start the timer

function startGame() {
  startButton.classList.add("hide");
  scoreArea.classList.add("hide");
  answerButtons.classList.remove("hide");
  qNumber = 0;
  qContainer.classList.remove("hide");
  scoreArea.innerHTML = "";
  startClock();
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
  showQuestion(questions[qNumber]);
}

//function to display the questions
//should load one object from the questions array into the proper html elements, then run the function to collect answers
function showQuestion(question) {
  qElement.innerText = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });
}

//function to start the timer
//should run a countdown that is displayed in the HTML, when time is up, should run the game over function
function startClock() {
  countdown.innerHTML = "Time Remaining: " + timer;
  if (timer <= 0) {
    gameOver();
  } else {
    timer -= 1;
    runningTimer = setTimeout(startClock, 1000);
  }
}

//function to collect answers
//should listen for what answer the user clicks on, compare it to the correct answer, and decrease the timer if wrong. should then run the next question function
//unless the current question is the last, then it should run the game over function
function selectAnswer(e) {
  const selectedButton = e.target;
  if (!selectedButton.dataset.correct) {
    timer = timer - 1;
    console.log(timer);
  }
  if (qNumber == questions.length - 1) {
    gameOver();
  } else {
    clearQuestion();
    qNumber++;
    showQuestion(questions[qNumber]);
    console.log(score);
  }
}

//function to clear the current question
//should empty the HTML elements that are occupied with the currently displayed question
function clearQuestion() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

//function for game over
//should grab the current time remaining and set it as the score, hide the questions area, display the score to the user, and give them the chance to try again or submit
//their high scores via a text box for intials and the high scores function
function gameOver() {
  clearInterval(runningTimer);
  countdown.innerHTML = "конец";
  clearQuestion();
  showResults();
  startButton.innerText = "заново";
  startButton.classList.remove("hide");
  score = 1;
}

function showResults() {
  finalScore = score;
  if (finalScore < 0) {
    finalScore = 0;
  }
  qElement.innerText = "";
  scoreArea.classList.remove("hide");
  answerButtons.classList.add("hide");
  scoreArea.innerHTML = `если у тебя больше 0, ты конч, а у тебя ${finalScore}!<div id="init">: <input type="text" name="initials" id="initials" placeholder="введи имя"><button id="save-btn" class="save-btn btn" onclick="submitScores(event)" disabled>сохранить</button>`;
  username = document.getElementById("initials");
  saveButton = document.getElementById("save-btn");
  username.addEventListener("keyup", function() {
    saveButton.disabled = !username.value;
  });
}

//function to submit high scores
//should grab the users score and initials and add it to the high scores object, ranked numerically, and run the function to display the high scores
function submitScores(e) {
  const score = {
    score: finalScore,
    name: username.value
  };
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(MAX_HIGH_SCORES);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  displayScores();
}

//function to display high scores
//should populate the HTML with a ranked display of the high scores and and provide the option to clear the scores via a function
function displayScores() {
  clearInterval(runningTimer);
  countdown.innerHTML = "";
  clearQuestion();
  qElement.innerText = "";
  scoreArea.classList.remove("hide");

  scoreArea.innerHTML = `<h2>счет</h2><ul id="highScoresList"></ul><button id="clearScores" class="btn" onclick="clearScores()">стереть счет</button>`;
  const highScoresList = document.getElementById("highScoresList");
  highScoresList.innerHTML = highScores
    .map(score => {
      return `<li class="scoresList">${score.name} - ${score.score}</li>`;
    })
    .join("");
  startButton.classList.remove("hide");
  highScoresButton.classList.add("hide");
}

//function to clear high scores
//should fire on click, and erase the values of the high scores object
function clearScores() {
  highScores = [];
  highScoresList.innerHTML = "<h3>счет стерт, расслабься</h3>";
  document.getElementById("clearScores").classList.add("hide");
}

/////
//Questions go Here
/////
const questions = [
  {
    question: "пиздишь ли ты по громкой связи находясь в общественном пространстве?",
    answers: [
      { text: "я чучмек, это моя обязанность", correct: false },
      { text: "нет, я не долбаеб", correct: true },
      { text: "иногда да, бывает", correct: false },
      { text: "это мое хобби", correct: false }
    ]
  },
  {
    question: "ты ссышь в раковину?",
    answers: [
      { text: "да, я свинья", correct: false },
      { text: "мне так удобнее и быстрее", correct: false },
      { text: "я женщина, у меня не получается", correct: false },
      { text: "нет", correct: true }
    ]
  },
  {
    question: "предположим ты узнал что твой друг ненавидит человеческие ступни, станешь ли ты специально их оголять?",
    answers: [
      { text: "угар, да", correct: false },
      { text: "нет, я не конч", correct: true }
    ]
  },
  {
    question: 'сверхраса это:',
    answers: [
      { text: 'русские', correct: false },
      { text: 'хохлы', correct: false },
      { text: 'чучмеки', correct: false },
      { text: 'евреи', correct: true }
    ]
  },
  {
    question: "кто лучший человек на планете",
    answers: [
      { text: "Сарочка", correct: true },
      { text: "не Сарочка", correct: false },
      { text: "не Сарочка", correct: false },
      { text: "не Сарочка", correct: false }
    ]
  },
  {
    question: 'твое действие, если рядом находится Сара ',
    answers: [
      { text: "пердеть", correct: false },
      { text: "рагать ей в лицо", correct: false },
      { text: "быть норм парнягой а не уебаном", correct: true },
      { text: "оголять ступни", correct: false }
    ]
  },
  {
    question: "сколько лет Саре",
    answers: [
      { text: "23", correct: true },
      { text: "32", correct: false },
      { text: "27", correct: false },
      { text: "56", correct: false }
    ]
  },
  {
    question: "что лучше:",
    answers: [
      { text: "апрашка", correct: false },
      { text: "цыгане", correct: false },
      { text: "волосатая жопа", correct: false },
      { text: "вся обувь от Доктора Мартинса", correct: true }
    ]
  },
  {
    question: "сколько человек говорило тебе что ты токсик и душнила?",
    answers: [
      { text: "более 5", correct: false },
      { text: "3-4", correct: false },
      { text: "1, но он(а) сам(а) душнила", correct: true },
      { text: "2", correct: false }
    ]
  }
];
