// Know Your Steelers - Main Application Logic
class KnowYourSteelers {
    constructor() {
        this.players = STEELERS_PLAYERS;
        this.currentMode = null;
        this.currentQuestion = null;
        this.currentAnswer = null;
        this.score = 0;
        this.questionCount = 0;
        this.correctAnswers = 0;
        this.totalCorrect = parseInt(localStorage.getItem('totalCorrect') || '0');
        this.totalPlayed = parseInt(localStorage.getItem('totalPlayed') || '0');
        this.gameTimer = null;
        this.timeRemaining = 60;
        this.maxQuestions = 10; // For non-timed modes
        
        this.initializeEventListeners();
        this.updateStats();
        this.showScreen('main-menu');
    }

    initializeEventListeners() {
        // Game mode selection
        document.querySelectorAll('.game-mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.startGame(mode);
            });
        });

        // Back button
        document.getElementById('back-btn').addEventListener('click', () => {
            this.endGame();
            this.showScreen('main-menu');
        });

        // Submit answer
        document.getElementById('submit-answer').addEventListener('click', () => {
            this.submitAnswer();
        });

        // Enter key for text input
        document.getElementById('answer-text').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitAnswer();
            }
        });

        // Multiple choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectChoice(parseInt(e.currentTarget.dataset.choice));
            });
        });

        // Next question button
        document.getElementById('next-question').addEventListener('click', () => {
            this.nextQuestion();
        });

        // Results screen buttons
        document.getElementById('play-again').addEventListener('click', () => {
            this.startGame(this.currentMode);
        });

        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.showScreen('main-menu');
        });
    }

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenName).classList.add('active');
    }

    startGame(mode) {
        this.currentMode = mode;
        this.score = 0;
        this.questionCount = 0;
        this.correctAnswers = 0;
        this.timeRemaining = 60;

        // Update mode display
        const modeNames = {
            'name-to-number': 'Name to Number',
            'number-to-name': 'Number to Name',
            'multiple-choice': 'Multiple Choice',
            'timed-challenge': 'Timed Challenge'
        };
        document.getElementById('current-mode').textContent = modeNames[mode];

        // Show/hide timer based on mode
        const timerElement = document.getElementById('timer');
        if (mode === 'timed-challenge') {
            timerElement.classList.remove('hidden');
            this.startTimer();
        } else {
            timerElement.classList.add('hidden');
        }

        this.showScreen('game-screen');
        this.nextQuestion();
    }

    startTimer() {
        this.updateTimer();
        this.gameTimer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimer();
            
            if (this.timeRemaining <= 0) {
                this.endGame();
                this.showResults();
            }
        }, 1000);
    }

    updateTimer() {
        const timerElement = document.getElementById('timer');
        timerElement.textContent = `Time: ${this.timeRemaining}s`;
        
        if (this.timeRemaining <= 10) {
            timerElement.classList.add('critical');
        } else {
            timerElement.classList.remove('critical');
        }
    }

    endGame() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }

    nextQuestion() {
        // Check if game should end (except for timed challenge)
        if (this.currentMode !== 'timed-challenge' && this.questionCount >= this.maxQuestions) {
            this.endGame();
            this.showResults();
            return;
        }

        this.questionCount++;
        this.generateQuestion();
        this.updateScore();
        
        // Hide feedback and show question
        document.getElementById('feedback').classList.add('hidden');
        document.getElementById('answer-text').value = '';
        document.getElementById('answer-text').focus();
        
        // Reset multiple choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected', 'correct', 'incorrect');
        });
    }

    generateQuestion() {
        // Get random player
        const player = this.players[Math.floor(Math.random() * this.players.length)];
        this.currentAnswer = player;

        const questionElement = document.getElementById('question');
        const answerInputElement = document.getElementById('answer-input');
        const multipleChoiceElement = document.getElementById('multiple-choice');

        // Hide all input types first
        answerInputElement.classList.add('hidden');
        multipleChoiceElement.classList.add('hidden');

        switch (this.currentMode) {
            case 'name-to-number':
                questionElement.textContent = `What jersey number does ${player.name} wear?`;
                answerInputElement.classList.remove('hidden');
                document.getElementById('answer-text').placeholder = 'Enter jersey number...';
                break;

            case 'number-to-name':
                questionElement.textContent = `Which player wears jersey number ${player.number}?`;
                answerInputElement.classList.remove('hidden');
                document.getElementById('answer-text').placeholder = 'Enter player name...';
                break;

            case 'multiple-choice':
            case 'timed-challenge':
                this.generateMultipleChoiceQuestion(player);
                break;
        }
    }

    generateMultipleChoiceQuestion(correctPlayer) {
        const questionElement = document.getElementById('question');
        const multipleChoiceElement = document.getElementById('multiple-choice');
        
        // Randomly choose question type for multiple choice
        const questionType = Math.random() < 0.5 ? 'name-to-number' : 'number-to-name';
        
        if (questionType === 'name-to-number') {
            questionElement.textContent = `What jersey number does ${correctPlayer.name} wear?`;
            this.generateNumberChoices(correctPlayer);
        } else {
            questionElement.textContent = `Which player wears jersey number ${correctPlayer.number}?`;
            this.generateNameChoices(correctPlayer);
        }
        
        multipleChoiceElement.classList.remove('hidden');
    }

    generateNumberChoices(correctPlayer) {
        const choices = [correctPlayer.number];
        const usedNumbers = new Set([correctPlayer.number]);
        
        // Generate 3 random incorrect numbers
        while (choices.length < 4) {
            const randomNumber = Math.floor(Math.random() * 99) + 1;
            if (!usedNumbers.has(randomNumber)) {
                choices.push(randomNumber);
                usedNumbers.add(randomNumber);
            }
        }
        
        // Shuffle choices
        this.shuffleArray(choices);
        this.correctChoiceIndex = choices.indexOf(correctPlayer.number);
        
        // Update choice buttons
        const choiceButtons = document.querySelectorAll('.choice-btn');
        choices.forEach((choice, index) => {
            choiceButtons[index].textContent = choice;
        });
    }

    generateNameChoices(correctPlayer) {
        const choices = [correctPlayer.name];
        const usedPlayers = new Set([correctPlayer.name]);
        
        // Generate 3 random incorrect players
        while (choices.length < 4) {
            const randomPlayer = this.players[Math.floor(Math.random() * this.players.length)];
            if (!usedPlayers.has(randomPlayer.name)) {
                choices.push(randomPlayer.name);
                usedPlayers.add(randomPlayer.name);
            }
        }
        
        // Shuffle choices
        this.shuffleArray(choices);
        this.correctChoiceIndex = choices.indexOf(correctPlayer.name);
        
        // Update choice buttons
        const choiceButtons = document.querySelectorAll('.choice-btn');
        choices.forEach((choice, index) => {
            choiceButtons[index].textContent = choice;
        });
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    selectChoice(choiceIndex) {
        // Remove previous selection
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Mark selected choice
        document.querySelectorAll('.choice-btn')[choiceIndex].classList.add('selected');
        
        // Auto-submit after short delay
        setTimeout(() => {
            this.submitMultipleChoice(choiceIndex);
        }, 500);
    }

    submitAnswer() {
        const answerText = document.getElementById('answer-text').value.trim();
        if (!answerText) return;

        let isCorrect = false;
        let correctAnswerText = '';

        switch (this.currentMode) {
            case 'name-to-number':
                isCorrect = parseInt(answerText) === this.currentAnswer.number;
                correctAnswerText = `${this.currentAnswer.name} wears #${this.currentAnswer.number}`;
                break;

            case 'number-to-name':
                isCorrect = this.normalizePlayerName(answerText) === this.normalizePlayerName(this.currentAnswer.name);
                correctAnswerText = `#${this.currentAnswer.number} is ${this.currentAnswer.name}`;
                break;
        }

        this.processAnswer(isCorrect, correctAnswerText);
    }

    submitMultipleChoice(choiceIndex) {
        const isCorrect = choiceIndex === this.correctChoiceIndex;
        const choiceButtons = document.querySelectorAll('.choice-btn');
        
        // Highlight correct and incorrect answers
        choiceButtons.forEach((btn, index) => {
            if (index === this.correctChoiceIndex) {
                btn.classList.add('correct');
            } else if (index === choiceIndex && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        let correctAnswerText = '';
        if (document.getElementById('question').textContent.includes('jersey number')) {
            correctAnswerText = `${this.currentAnswer.name} wears #${this.currentAnswer.number}`;
        } else {
            correctAnswerText = `#${this.currentAnswer.number} is ${this.currentAnswer.name}`;
        }

        this.processAnswer(isCorrect, correctAnswerText);
    }

    processAnswer(isCorrect, correctAnswerText) {
        const feedbackElement = document.getElementById('feedback');
        const feedbackTextElement = document.getElementById('feedback-text');

        if (isCorrect) {
            this.score += 10;
            this.correctAnswers++;
            feedbackElement.className = 'feedback correct';
            feedbackTextElement.innerHTML = `
                <div style="color: var(--success-green); font-size: 1.5em; margin-bottom: 10px;">✓ Correct!</div>
                <div>${correctAnswerText}</div>
                <div style="margin-top: 10px; color: var(--steelers-silver);">+10 points</div>
            `;
        } else {
            feedbackElement.className = 'feedback incorrect';
            feedbackTextElement.innerHTML = `
                <div style="color: var(--error-red); font-size: 1.5em; margin-bottom: 10px;">✗ Incorrect</div>
                <div>${correctAnswerText}</div>
                <div style="margin-top: 10px; color: var(--steelers-silver);">Position: ${this.currentAnswer.position}</div>
            `;
        }

        feedbackElement.classList.remove('hidden');
        this.updateScore();
        this.updateStats();

        // Auto-advance after delay in timed challenge mode
        if (this.currentMode === 'timed-challenge') {
            setTimeout(() => {
                this.nextQuestion();
            }, 2000);
        }
    }

    normalizePlayerName(name) {
        return name.toLowerCase()
            .replace(/[^a-z\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    updateScore() {
        document.getElementById('current-score').textContent = `Score: ${this.score}`;
    }

    updateStats() {
        // Update total stats
        this.totalPlayed = this.questionCount || parseInt(localStorage.getItem('totalPlayed') || '0');
        this.totalCorrect = this.correctAnswers || parseInt(localStorage.getItem('totalCorrect') || '0');
        
        // Save to localStorage
        localStorage.setItem('totalCorrect', this.totalCorrect.toString());
        localStorage.setItem('totalPlayed', this.totalPlayed.toString());

        // Update display
        document.getElementById('total-correct').textContent = this.totalCorrect;
        document.getElementById('total-played').textContent = this.totalPlayed;
        
        const accuracy = this.totalPlayed > 0 ? Math.round((this.totalCorrect / this.totalPlayed) * 100) : 0;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
    }

    showResults() {
        // Update total stats with current game
        const newTotalCorrect = parseInt(localStorage.getItem('totalCorrect') || '0') + this.correctAnswers;
        const newTotalPlayed = parseInt(localStorage.getItem('totalPlayed') || '0') + this.questionCount;
        
        localStorage.setItem('totalCorrect', newTotalCorrect.toString());
        localStorage.setItem('totalPlayed', newTotalPlayed.toString());

        // Update results display
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-correct').textContent = this.correctAnswers;
        document.getElementById('final-total').textContent = this.questionCount;
        
        const accuracy = this.questionCount > 0 ? Math.round((this.correctAnswers / this.questionCount) * 100) : 0;
        document.getElementById('final-accuracy').textContent = `${accuracy}%`;

        this.showScreen('results-screen');
        this.updateStats();
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KnowYourSteelers();
});