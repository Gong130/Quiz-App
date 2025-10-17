// ===== DOM 引用 =====
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");

const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");

const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const totalQuestionsDupSpan = document.getElementById("total-questions-dup");

const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");

const progressBar = document.getElementById("progress");

// ===== 题库（示例） =====
const quizQuestions = [
  {
    question: "法国的首都是哪座城市？",
    answers: [
      { text: "巴黎", correct: true },
      { text: "伦敦", correct: false },
      { text: "罗马", correct: false },
      { text: "柏林", correct: false },
    ],
  },
  {
    question: "太阳系中被称为“红色星球”的是？",
    answers: [
      { text: "地球", correct: false },
      { text: "火星", correct: true },
      { text: "木星", correct: false },
      { text: "金星", correct: false },
    ],
  },
  {
    question: "JavaScript 是一种？",
    answers: [
      { text: "标记语言", correct: false },
      { text: "样式语言", correct: false },
      { text: "编程语言", correct: true },
      { text: "数据库语言", correct: false },
    ],
  },
  {
    question: "CSS 的主要作用是？",
    answers: [
      { text: "定义网页结构", correct: false },
      { text: "定义网页样式", correct: true },
      { text: "定义服务器行为", correct: false },
      { text: "存储数据", correct: false },
    ],
  },
];

// ===== 状态 =====
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

// ===== 初始化 =====
function init() {
  // 显示总题数
  totalQuestionsSpan.textContent = quizQuestions.length;
  totalQuestionsDupSpan.textContent = quizQuestions.length;
  maxScoreSpan.textContent = quizQuestions.length;

  // 事件
  startButton.addEventListener("click", startQuiz);
  restartButton.addEventListener("click", restartQuiz);
}
document.addEventListener("DOMContentLoaded", init); // 保险起见（同时也用了 defer）

// ===== 逻辑 =====
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;

  // 切屏
  startScreen.classList.remove("active");
  resultScreen.classList.remove("active");
  quizScreen.classList.add("active");

  // 初始进度
  updateProgress();

  // 出第一题
  showQuestion();
}

function showQuestion() {
  answersDisabled = false;

  const current = quizQuestions[currentQuestionIndex];
  currentQuestionSpan.textContent = currentQuestionIndex + 1;
  updateProgress();

  // 更新题干
  questionText.textContent = current.question;

  // 清空并生成答案按钮
  answersContainer.innerHTML = "";
  current.answers.forEach((answer) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.type = "button";
    btn.textContent = answer.text;
    // 用 data-* 存 correct 标记
    btn.dataset.correct = String(!!answer.correct);
    btn.addEventListener("click", onSelectAnswer);
    answersContainer.appendChild(btn);
  });
}

function onSelectAnswer(e) {
  if (answersDisabled) return;
  answersDisabled = true;

  const selected = e.currentTarget;
  const isCorrect = selected.dataset.correct === "true";

  // 显示对/错样式
  [...answersContainer.children].forEach((btn) => {
    if (btn.dataset.correct === "true") {
      btn.classList.add("correct");
    } else if (btn === selected) {
      btn.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  // 稍等片刻给用户反馈，再切下一题 / 结果页
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 850);
}

function showResults() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = score;

  const pct = (score / quizQuestions.length) * 100;
  resultMessage.textContent =
    pct === 100 ? "完美！你太棒了！" :
    pct >= 80 ? "很棒！继续保持～" :
    pct >= 60 ? "还不错，再接再厉！" :
    "别灰心，下次一定更好！";
}

function restartQuiz() {
  // 回到起始页
  resultScreen.classList.remove("active");
  startScreen.classList.add("active");
}

function updateProgress() {
  const percent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = percent + "%";
}
