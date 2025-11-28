// --- 1. QUIZ DATA ---
const quizData = [
    {
        question: "What is the capital of France?",
        options: ["London", "Paris", "Rome", "Berlin"],
        answer: "Paris"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        answer: "Mars"
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        answer: "Pacific"
    },
    {
        question: "What is 7 multiplied by 8?",
        options: ["54", "56", "64", "48"],
        answer: "56"
    }
];

// --- 2. DOM ELEMENTS AND STATE ---
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-button');
const feedbackElement = document.getElementById('feedback');
// NEW ELEMENTS
const timerElement = document.getElementById('timer');
const questionNumberElement = document.getElementById('question-number');

let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false;
let timerInterval;
const TIME_LIMIT = 30; // Time limit in seconds

// --- 3. TIMER FUNCTIONS ---

/**
 * Starts the countdown timer for the current question.
 */
function startTimer() {
    let timeLeft = TIME_LIMIT;
    timerElement.textContent = `${timeLeft}s`;
    timerElement.classList.remove('low-time');

    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `${timeLeft}s`;

        if (timeLeft <= 10) {
            timerElement.classList.add('low-time');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeIsUp();
        }
    }, 1000);
}

/**
 * Stops the current timer.
 */
function stopTimer() {
    clearInterval(timerInterval);
    timerElement.classList.remove('low-time');
    timerElement.textContent = `${TIME_LIMIT}s`; // Reset timer display
}

/**
 * Handles the logic when the time runs out.
 */
function timeIsUp() {
    // Treat as an incorrect answer
    feedbackElement.textContent = `Time's up! The correct answer was: ${quizData[currentQuestionIndex].answer}`;
    
    // Disable all option buttons and show the correct answer
    Array.from(optionsContainer.children).forEach(button => {
        button.disabled = true;
        if (button.textContent === quizData[currentQuestionIndex].answer) {
            button.classList.add('correct');
        }
    });

    // Show the next button
    nextButton.style.display = 'block';
    answerSelected = true;
}


// --- 4. CORE QUIZ FUNCTIONS ---

/**
 * Loads the current question and generates buttons for the options.
 */
function loadQuestion() {
    stopTimer(); // Ensure any previous timer is stopped

    // Check if we are done with all questions
    if (currentQuestionIndex >= quizData.length) {
        showResult();
        return;
    }

    // Update Question Number Display
    questionNumberElement.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;

    const currentQuiz = quizData[currentQuestionIndex];
    questionElement.textContent = currentQuiz.question;
    optionsContainer.innerHTML = ''; // Clear previous options
    feedbackElement.textContent = ''; // Clear previous feedback
    nextButton.style.display = 'none'; // Hide next button initially
    answerSelected = false;

    // Start the new timer
    startTimer();

    // Create a button for each option
    currentQuiz.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button');
        button.addEventListener('click', () => checkAnswer(button, option, currentQuiz.answer));
        optionsContainer.appendChild(button);
    });
}

/**
 * Checks the user's selected answer against the correct answer.
 * @param {HTMLButtonElement} selectedButton - The button the user clicked.
 * @param {string} selectedOption - The text of the option selected.
 * @param {string} correctAnswer - The correct answer text.
 */
function checkAnswer(selectedButton, selectedOption, correctAnswer) {
    // Only allow checking if an answer hasn't been selected yet
    if (answerSelected) return;
    
    stopTimer(); // Stop the timer immediately after selection
    answerSelected = true;

    // Disable all option buttons
    Array.from(optionsContainer.children).forEach(button => {
        button.disabled = true;
    });

    if (selectedOption === correctAnswer) {
        // Correct answer
        score++;
        selectedButton.classList.add('correct');
        feedbackElement.textContent = 'Correct! 🎉';
    } else {
        // Incorrect answer
        selectedButton.classList.add('incorrect');
        feedbackElement.textContent = `Incorrect. The correct answer was: ${correctAnswer}`;
        // Also highlight the correct answer
        Array.from(optionsContainer.children).forEach(button => {
            if (button.textContent === correctAnswer) {
                button.classList.add('correct');
            }
        });
    }

    // Show the next button
    nextButton.style.display = 'block';
}

/**
 * Moves to the next question.
 */
function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

/**
 * Displays the final score and a button to restart.
 */
function showResult() {
    stopTimer(); // Make sure timer is stopped at the end
    questionElement.textContent = 'Quiz Finished!';
    optionsContainer.innerHTML = '';
    questionNumberElement.textContent = 'Results';
    feedbackElement.textContent = `You scored ${score} out of ${quizData.length} questions.`;
    nextButton.textContent = 'Restart Quiz';
    nextButton.style.display = 'block';
    
    // Change the restart button function
    nextButton.onclick = restartQuiz;
}

/**
 * Resets the quiz state and starts over.
 */
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.textContent = 'Next Question';
    nextButton.onclick = nextQuestion; // Re-assign the normal next function
    loadQuestion();
}


// --- 5. EVENT LISTENERS AND INITIALIZATION ---

// Set up the listener for the Next button
nextButton.addEventListener('click', nextQuestion);

// Start the quiz when the page loads
loadQuestion();