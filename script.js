$(document).ready(function () {
  const $start = $('#start-btn');
  const $restart = $('#restart-btn');
  const $home = $('#home-card');
  const $quiz = $('#quiz-card');
  const $result = $('#result-card');
  const $question = $('#question');
  const $answers = $('#answer-buttons');
  const $next = $('#next-btn');
  const $progress = $('#progress-fill');  // Progress bar element
  const $final = $('#final-score');
  const $correct = $('#correct-answers');
  const $incorrect = $('#incorrect-answers');
  const $rate = $('#success-rate');
  const $review = $('#incorrect-list');
  
  let currentQuestionIndex = 0;
  let score = 0;
  let incorrectQuestions = [];

const quizData = [
  {
    question: "What is the correct syntax for an external script 'app.js'?",
    answers: [
      { text: "<script src='app.js'></script>", correct: true },
      { text: "<script href='app.js'></script>", correct: false },
      { text: "<script name='app.js'></script>", correct: false },
      { text: "<script file='app.js'></script>", correct: false }
    ]
  },
  {
    question: "Which property is used to change the background color in CSS?",
    answers: [
      { text: "background-color", correct: true },
      { text: "bgcolor", correct: false },
      { text: "color", correct: false },
      { text: "background", correct: false }
    ]
  },
  {
    question: "Which JavaScript method is used to select an element by ID?",
    answers: [
      { text: "getElementById()", correct: true },
      { text: "querySelectorAll()", correct: false },
      { text: "getElementsByClassName()", correct: false },
      { text: "getElement()", correct: false }
    ]
  },
  {
    question: "Which operator is used for strict equality in JS?",
    answers: [
      { text: "===", correct: true },
      { text: "==", correct: false },
      { text: "=", correct: false },
      { text: "!==", correct: false }
    ]
  },
  {
    question: "Which tag is used to define a table row in HTML?",
    answers: [
      { text: "<tr>", correct: true },
      { text: "<td>", correct: false },
      { text: "<th>", correct: false },
      { text: "<table>", correct: false }
    ]
  },
  {
    question: "What does CSS stand for?",
    answers: [
      { text: "Cascading Style Sheets", correct: true },
      { text: "Computer Style Sheets", correct: false },
      { text: "Creative Style Syntax", correct: false },
      { text: "Colorful Style Sheet", correct: false }
    ]
  },
  {
    question: "Which HTML attribute specifies an alternate text for an image?",
    answers: [
      { text: "alt", correct: true },
      { text: "src", correct: false },
      { text: "title", correct: false },
      { text: "longdesc", correct: false }
    ]
  },
  {
    question: "Which symbol is used for ID selectors in CSS?",
    answers: [
      { text: "#", correct: true },
      { text: ".", correct: false },
      { text: "*", correct: false },
      { text: "$", correct: false }
    ]
  },
  {
    question: "Which HTML tag is used to define an unordered list?",
    answers: [
      { text: "<ul>", correct: true },
      { text: "<ol>", correct: false },
      { text: "<li>", correct: false },
      { text: "<list>", correct: false }
    ]
  },
  {
    question: "Which JavaScript keyword is used to declare a variable?",
    answers: [
      { text: "let", correct: true },
      { text: "various", correct: false },
      { text: "int", correct: false },
      { text: "set", correct: false }
    ]
  },
  {
    question: "Which property is used to change the font of text in CSS?",
    answers: [
      { text: "font-family", correct: true },
      { text: "text-font", correct: false },
      { text: "font-style", correct: false },
      { text: "font-weight", correct: false }
    ]
  },
  {
    question: "Which HTML element defines the title of a document?",
    answers: [
      { text: "<title>", correct: true },
      { text: "<head>", correct: false },
      { text: "<meta>", correct: false },
      { text: "<header>", correct: false }
    ]
  },
  {
    question: "Which method is used to add an element at the end of an array in JavaScript?",
    answers: [
      { text: "push()", correct: true },
      { text: "pop()", correct: false },
      { text: "shift()", correct: false },
      { text: "unshift()", correct: false }
    ]
  },
  {
    question: "Which CSS property controls the text size?",
    answers: [
      { text: "font-size", correct: true },
      { text: "text-style", correct: false },
      { text: "text-size", correct: false },
      { text: "font-style", correct: false }
    ]
  },
  {
    question: "Which HTML attribute is used to define inline styles?",
    answers: [
      { text: "style", correct: true },
      { text: "class", correct: false },
      { text: "font", correct: false },
      { text: "styles", correct: false }
    ]
  }
];

  function doHoverShake($el) {
    $el.addClass('hover-shake');
    setTimeout(() => $el.removeClass('hover-shake'), 400);
  }

  function doClickShake($el) {
    $el.addClass('click-shake');
    setTimeout(() => $el.removeClass('click-shake'), 350);
  }

  $start.on('mouseenter', () => doHoverShake($start));
  $next.on('mouseenter', () => doHoverShake($next));
  $restart.on('mouseenter', () => doHoverShake($restart));

  $start.click(function () {
    doClickShake($start);
    $home.hide();
    $quiz.show();
    startQuiz();
  });

  function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    incorrectQuestions = [];
    showQuestion();
    updateProgress();  // Update progress bar on quiz start
  }

  function showQuestion() {
    resetState();
    const q = quizData[currentQuestionIndex];
    $question.text(q.question);

    q.answers.forEach(answer => {
      const $btn = $('<button>')
        .addClass('btn')
        .text(answer.text)
        .data('correct', answer.correct)
        .attr('tabindex', 0);

      $btn.on('mouseenter focus', () => doHoverShake($btn));

      $btn.on('click', function () {
        doClickShake($btn);
        $answers.children().removeClass('selected'); // remove previous selection
        $btn.addClass('selected'); // mark this button as selected
      });

      $answers.append($btn);
    });
  }

  function resetState() {
    $answers.empty();
  }

  $next.click(function () {
    doClickShake($next);
    const $selected = $answers.children('.selected');
    if ($selected.length === 0) return;

    const correct = $selected.data('correct') === true;

    if (correct) {
      score++;
    } else {
      incorrectQuestions.push({
        question: quizData[currentQuestionIndex].question,
        yourAnswer: $selected.text(),
        correctAnswer: quizData[currentQuestionIndex].answers.find(a => a.correct).text
      });
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
      showQuestion();
      updateProgress();  // Update progress bar after every question
    } else {
      showResults();
    }
  });

  function updateProgress() {
    const percent = (currentQuestionIndex / quizData.length) * 100;
    $progress.css('width', `${percent}%`);
  }

  function showResults() {
    $quiz.hide();
    $result.show();

    // Display score summary
    $final.text(`You scored ${score} out of ${quizData.length}`);
    $correct.text(`Correct Answers: ${score}`);
    $incorrect.text(`Incorrect Answers: ${quizData.length - score}`);
    $rate.text(`Success Rate: ${(score / quizData.length * 100).toFixed(2)}%`);

    // Clear previous review content
    $review.empty();

    if (incorrectQuestions.length === 0) {
      $review.append('<li>All answers were correct! Great job!</li>');
    } else {
      incorrectQuestions.forEach((q, i) => {
        const $li = $('<li>').addClass('review-item');

        // Question
        const $questionDiv = $('<div>')
          .addClass('question')
          .text(`${i + 1}. ${q.question}`);
        $li.append($questionDiv);

        // User's Answer
        const $yourAnswerDiv = $('<div>')
          .addClass('answer-card your-answer-card')
          .text(`Your Answer: ${q.yourAnswer}`);
        $li.append($yourAnswerDiv);

        // Correct Answer
        const $correctAnswerDiv = $('<div>')
          .addClass('answer-card correct-answer-card')
          .text(`Correct Answer: ${q.correctAnswer}`);
        $li.append($correctAnswerDiv);

        $review.append($li);
      });
    }
  }

  $restart.click(function () {
    doClickShake($restart);
    $result.hide();
    $home.show();
  });
});
