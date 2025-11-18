document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    const restartButton = document.getElementById('restart-btn');
    const homeCard = document.getElementById('home-card');
    const quizCard = document.getElementById('quiz-card');
    const resultCard = document.getElementById('result-card');

    const questionEl = document.getElementById('question');
    const answerButtons = document.getElementById('answer-buttons');
    const nextButton = document.getElementById('next-btn');
    const progressFill = document.getElementById('progress-fill');

    const finalScoreEl = document.getElementById('final-score');
    const correctAnswersEl = document.getElementById('correct-answers');
    const incorrectAnswersEl = document.getElementById('incorrect-answers');
    const successRateEl = document.getElementById('success-rate');
    const incorrectListEl = document.getElementById('incorrect-list');

    let currentQuestionIndex = 0;
    let score = 0;
    let incorrectQuestions = [];

    /* Quiz data */
    const quizData = [
        {
            question: "What is the correct syntax for referring to an external script called 'app.js'?",
            answers: [
                { text: "<script src='app.js'></script>", correct: true },
                { text: "<script href='app.js'></script>", correct: false },
                { text: "<script name='app.js'></script>", correct: false },
                { text: "<script file='app.js'></script>", correct: false }
            ]
        },
        {
            question: "Which event occurs when the user clicks on an HTML element?",
            answers: [
                { text: "onclick", correct: true },
                { text: "onchange", correct: false },
                { text: "onmouseover", correct: false },
                { text: "onfocus", correct: false }
            ]
        },
        {
            question: "Which HTML tag is used to define an internal style sheet?",
            answers: [
                { text: "<style>", correct: true },
                { text: "<script>", correct: false },
                { text: "<link>", correct: false },
                { text: "<css>", correct: false }
            ]
        },
        {
            question: "How do you create a function in JavaScript?",
            answers: [
                { text: "function myFunction()", correct: true },
                { text: "create function myFunction()", correct: false },
                { text: "function:myFunction()", correct: false },
                { text: "function = myFunction()", correct: false }
            ]
        },
        {
            question: "How do you call a function named 'myFunction'?",
            answers: [
                { text: "myFunction()", correct: true },
                { text: "call myFunction()", correct: false },
                { text: "call function myFunction()", correct: false },
                { text: "myFunction[]", correct: false }
            ]
        },
        {
            question: "How do you add a comment in JavaScript?",
            answers: [
                { text: "// This is a comment", correct: true },
                { text: "<!-- This is a comment -->", correct: false },
                { text: "' This is a comment", correct: false },
                { text: "/* This is a comment */", correct: false }
            ]
        },
        {
            question: "Which operator is used to assign a value to a variable?",
            answers: [
                { text: "=", correct: true },
                { text: "==", correct: false },
                { text: "===", correct: false },
                { text: ":", correct: false }
            ]
        },
        {
            question: "What does CSS stand for?",
            answers: [
                { text: "Cascading Style Sheets", correct: true },
                { text: "Creative Style Sheets", correct: false },
                { text: "Computer Style Sheets", correct: false },
                { text: "Cascading Simple Sheets", correct: false }
            ]
        },
        {
            question: "What is the default value of the 'position' property in CSS?",
            answers: [
                { text: "static", correct: true },
                { text: "relative", correct: false },
                { text: "absolute", correct: false },
                { text: "fixed", correct: false }
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
        }
    ];

    /* Start Quiz */
    startButton.addEventListener('click', () => {
        homeCard.style.display = 'none';
        quizCard.style.display = 'block';
        startQuiz();
    });

    /* Restart Quiz */
    restartButton.addEventListener('click', () => {
        resultCard.style.display = 'none';
        homeCard.style.display = 'block';
    });

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        incorrectQuestions = [];
        nextButton.style.display = 'none';
        showQuestion();
        updateProgress();
    }

    function showQuestion() {
        resetState();
        const q = quizData[currentQuestionIndex];
        questionEl.innerText = q.question;

        q.answers.forEach(answer => {
            const button = document.createElement('button');
            button.classList.add('btn');
            button.innerText = answer.text;
            button.dataset.correct = answer.correct;
            button.addEventListener('click', selectAnswer);
            answerButtons.appendChild(button);
        });
    }

    function resetState() {
        nextButton.style.display = 'none';
        while (answerButtons.firstChild) answerButtons.removeChild(answerButtons.firstChild);
    }

    function selectAnswer(e) {
        const selected = e.target;
        Array.from(answerButtons.children).forEach(b => b.classList.remove('selected'));
        selected.classList.add('selected');
        nextButton.style.display = 'flex';
    }

    nextButton.addEventListener('click', () => {
        const selected = document.querySelector('#answer-buttons .selected');
        const correct = selected.dataset.correct === 'true';

        if (correct) score++;
        else {
            incorrectQuestions.push({
                question: quizData[currentQuestionIndex].question,
                yourAnswer: selected.innerText,
                correctAnswer: quizData[currentQuestionIndex].answers.find(a => a.correct).text
            });
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            showQuestion();
            updateProgress();
        } else {
            showResults();
        }
    });

    function updateProgress() {
        progressFill.style.width =
            `${(currentQuestionIndex / quizData.length) * 100}%`;
    }

    function showResults() {
        quizCard.style.display = 'none';
        resultCard.style.display = 'block';

        finalScoreEl.innerText = `You scored ${score} out of ${quizData.length}`;
        correctAnswersEl.innerText = `Correct Answers: ${score}`;
        incorrectAnswersEl.innerText = `Incorrect Answers: ${quizData.length - score}`;
        successRateEl.innerText = `Success Rate: ${(score / quizData.length * 100).toFixed(2)}%`;

        incorrectListEl.innerHTML = '';

        /* Build incorrect review list */
        incorrectQuestions.forEach((q, i) => {
            const li = document.createElement('li');

            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question');
            questionDiv.innerText = `${i + 1}. ${q.question}`;

            const yourCard = document.createElement('div');
            yourCard.classList.add('answer-card', 'your-answer-card');
            yourCard.innerText = `Your Answer: ${q.yourAnswer}`;

            const correctCard = document.createElement('div');
            correctCard.classList.add('answer-card', 'correct-answer-card');
            correctCard.innerText = `Correct Answer: ${q.correctAnswer}`;

            li.appendChild(questionDiv);
            li.appendChild(yourCard);
            li.appendChild(correctCard);

            incorrectListEl.appendChild(li);
        });

        if (incorrectQuestions.length === 0) {
            incorrectListEl.innerHTML = `<li>All answers were correct! Great job!</li>`;
        }
    }
});
