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
  question: "Which keyword declares a block-scoped variable in JavaScript?",
  answers: [
    { text: "let", correct: true },
    { text: "var", correct: false },
    { text: "const", correct: false },
    { text: "define", correct: false }
  ]
},
{
  question: "What symbol is used for jQuery selectors?",
  answers: [
    { text: "$", correct: true },
    { text: "@", correct: false },
    { text: "#", correct: false },
    { text: "&", correct: false }
  ]
},
{
  question: "Which method runs code after the DOM is fully loaded in jQuery?",
  answers: [
    { text: "$(document).ready()", correct: true },
    { text: "$(window).start()", correct: false },
    { text: "$.onLoad()", correct: false },
    { text: "$.DOMContentLoaded()", correct: false }
  ]
},
{
  question: "Which operator checks both value and type in JavaScript?",
  answers: [
    { text: "===", correct: true },
    { text: "==", correct: false },
    { text: "=", correct: false },
    { text: "!==", correct: false }
  ]
},
{
  question: "Which jQuery method hides an element?",
  answers: [
    { text: ".hide()", correct: true },
    { text: ".vanish()", correct: false },
    { text: ".invisible()", correct: false },
    { text: ".none()", correct: false }
  ]
},
{
  question: "What does DOM stand for?",
  answers: [
    { text: "Document Object Model", correct: true },
    { text: "Data Output Method", correct: false },
    { text: "Digital Object Management", correct: false },
    { text: "Document Order Map", correct: false }
  ]
},
{
  question: "Which method selects an element by ID in jQuery?",
  answers: [
    { text: "$('#id')", correct: true },
    { text: "$('.id')", correct: false },
    { text: "$('id')", correct: false },
    { text: "$('<id>')", correct: false }
  ]
},
{
  question: "Which JavaScript method outputs a message to the console?",
  answers: [
    { text: "console.log()", correct: true },
    { text: "message.print()", correct: false },
    { text: "log.console()", correct: false },
    { text: "write.console()", correct: false }
  ]
},
{
  question: "Which jQuery method changes HTML content?",
  answers: [
    { text: ".html()", correct: true },
    { text: ".changeHTML()", correct: false },
    { text: ".textHTML()", correct: false },
    { text: ".update()", correct: false }
  ]
},
{
  question: "Which symbol is used for comments in JavaScript?",
  answers: [
    { text: "// comment", correct: true },
    { text: "-- comment", correct: false },
    { text: "## comment", correct: false },
    { text: "<!-- comment -->", correct: false }
  ]
},
{
  question: "Which JavaScript method converts a JSON string into an object?",
  answers: [
    { text: "JSON.parse()", correct: true },
    { text: "JSON.convert()", correct: false },
    { text: "JSON.objectify()", correct: false },
    { text: "JSON.stringify()", correct: false }
  ]
},
{
  question: "Which jQuery method is used to add a class to an element?",
  answers: [
    { text: ".addClass()", correct: true },
    { text: ".classAdd()", correct: false },
    { text: ".appendClass()", correct: false },
    { text: ".newClass()", correct: false }
  ]
},
{
  question: "Which JavaScript method removes the last element of an array?",
  answers: [
    { text: "pop()", correct: true },
    { text: "push()", correct: false },
    { text: "shift()", correct: false },
    { text: "unshift()", correct: false }
  ]
},
{
  question: "Which jQuery method fades out an element?",
  answers: [
    { text: ".fadeOut()", correct: true },
    { text: ".lighter()", correct: false },
    { text: ".opacity()", correct: false },
    { text: ".transparent()", correct: false }
  ]
},
{
  question: "Which JavaScript function is used to delay code execution?",
  answers: [
    { text: "setTimeout()", correct: true },
    { text: "delay()", correct: false },
    { text: "wait()", correct: false },
    { text: "pause()", correct: false }
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
