// Know Your Steelers - Reimplemented with new game modes
class KnowYourSteelers {
    constructor() {
        this.api = window.steelersAPI;
        this.currentMode = null;
        this.currentQuestion = null;
        this.currentAnswer = null;
        this.currentQuestionData = null;
        this.score = 0;
        this.questionCount = 0;
        this.correctAnswers = 0;
        this.totalCorrect = parseInt(localStorage.getItem('totalCorrect') || '0');
        this.totalPlayed = parseInt(localStorage.getItem('totalPlayed') || '0');
        this.maxQuestions = 10;
        this.isLoading = false;
        
        // Game mode data
        this.currentPlayers = [];
        this.newFaces = [];
        this.legends = [];
        
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

    async startGame(mode) {
        this.currentMode = mode;
        this.score = 0;
        this.questionCount = 0;
        this.correctAnswers = 0;

        // Update mode display
        const modeNames = {
            'current-players': 'Current Players',
            'new-faces': 'New Faces',
            'team-legends': 'Team Legends'
        };
        document.getElementById('current-mode').textContent = modeNames[mode];

        // Hide timer (not used in new modes)
        document.getElementById('timer').classList.add('hidden');

        // Load game data
        try {
            this.showLoadingState(true);
            await this.loadGameData(mode);
            this.showLoadingState(false);
            this.showScreen('game-screen');
            this.nextQuestion();
        } catch (error) {
            this.showLoadingState(false);
            this.showError('Failed to load game data. Please try again.');
        }
    }

    async loadGameData(mode) {
        switch (mode) {
            case 'current-players':
                this.currentPlayers = await this.api.getCurrentPlayers();
                break;
            case 'new-faces':
                this.newFaces = await this.api.getNewFaces();
                break;
            case 'team-legends':
                this.legends = await this.api.getTeamLegends();
                break;
        }
    }

    showLoadingState(isLoading) {
        this.isLoading = isLoading;
        const loadingText = isLoading ? 'Loading...' : '';
        // You could add a loading spinner here if needed
    }

    showError(message) {
        alert(message); // Simple error display - could be enhanced with better UI
    }

    endGame() {
        // No timers to clear in the new implementation
    }

    nextQuestion() {
        // Check if game should end
        if (this.questionCount >= this.maxQuestions) {
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
        let questionData;
        
        switch (this.currentMode) {
            case 'current-players':
                questionData = this.generateCurrentPlayerQuestion();
                break;
            case 'new-faces':
                questionData = this.generateNewFaceQuestion();
                break;
            case 'team-legends':
                questionData = this.generateLegendQuestion();
                break;
        }

        this.currentQuestionData = questionData;
        this.displayQuestion(questionData);
    }

    generateCurrentPlayerQuestion() {
        const players = this.currentPlayers;
        if (!players || players.length === 0) {
            throw new Error('No current players data available');
        }

        const player = players[Math.floor(Math.random() * players.length)];
        const questionTypes = ['name-to-number', 'number-to-name', 'position-guess', 'college-guess'];
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        switch (questionType) {
            case 'name-to-number':
                return {
                    type: 'text',
                    question: `What jersey number does ${player.name} wear?`,
                    answer: player.number.toString(),
                    player: player,
                    hint: `Position: ${player.position}`
                };
            case 'number-to-name':
                return {
                    type: 'text',
                    question: `Which current Steelers player wears jersey number ${player.number}?`,
                    answer: player.name,
                    player: player,
                    hint: `Position: ${player.position}`
                };
            case 'position-guess':
                return {
                    type: 'multiple-choice',
                    question: `What position does ${player.name} play?`,
                    answer: player.position,
                    player: player,
                    choices: this.generatePositionChoices(player.position)
                };
            case 'college-guess':
                return {
                    type: 'multiple-choice',
                    question: `Which college did ${player.name} attend?`,
                    answer: player.college,
                    player: player,
                    choices: this.generateCollegeChoices(player.college)
                };
        }
    }

    generateNewFaceQuestion() {
        const newFaces = this.newFaces;
        if (!newFaces || newFaces.length === 0) {
            // Fallback to current players if no new faces
            return this.generateCurrentPlayerQuestion();
        }

        const player = newFaces[Math.floor(Math.random() * newFaces.length)];
        const questionTypes = ['name-to-number', 'experience-guess', 'college-guess'];
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        switch (questionType) {
            case 'name-to-number':
                return {
                    type: 'text',
                    question: `What jersey number does new addition ${player.name} wear?`,
                    answer: player.number.toString(),
                    player: player,
                    hint: `This ${player.position} joined the Steelers recently`
                };
            case 'experience-guess':
                return {
                    type: 'multiple-choice',
                    question: `How many years of NFL experience does ${player.name} have?`,
                    answer: player.experience.toString(),
                    player: player,
                    choices: this.generateExperienceChoices(player.experience)
                };
            case 'college-guess':
                return {
                    type: 'multiple-choice',
                    question: `Which college did ${player.name} attend?`,
                    answer: player.college,
                    player: player,
                    choices: this.generateCollegeChoices(player.college)
                };
        }
    }

    generateLegendQuestion() {
        const legends = this.legends;
        if (!legends || legends.length === 0) {
            throw new Error('No legends data available');
        }

        const legend = legends[Math.floor(Math.random() * legends.length)];
        const questionTypes = ['achievement', 'years', 'number', 'fun-fact'];
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        switch (questionType) {
            case 'achievement':
                const achievement = legend.achievements[Math.floor(Math.random() * legend.achievements.length)];
                return {
                    type: 'multiple-choice',
                    question: `Which Steelers legend was known for: "${achievement}"?`,
                    answer: legend.name,
                    player: legend,
                    choices: this.generateLegendChoices(legend.name)
                };
            case 'years':
                return {
                    type: 'text',
                    question: `What years did ${legend.name} play for the Steelers?`,
                    answer: legend.years,
                    player: legend,
                    hint: `This ${legend.position} was a key player in Steelers history`
                };
            case 'number':
                return {
                    type: 'text',
                    question: `What jersey number did ${legend.name} wear?`,
                    answer: legend.number.toString(),
                    player: legend,
                    hint: `This legendary ${legend.position} played during ${legend.years}`
                };
            case 'fun-fact':
                return {
                    type: 'multiple-choice',
                    question: `Which player is known for: "${legend.funFact}"?`,
                    answer: legend.name,
                    player: legend,
                    choices: this.generateLegendChoices(legend.name)
                };
        }
    }

    generatePositionChoices(correctPosition) {
        const positions = ['QB', 'RB', 'WR', 'TE', 'OT', 'G', 'C', 'DE', 'DT', 'OLB', 'ILB', 'CB', 'S', 'K', 'P'];
        const choices = [correctPosition];
        
        while (choices.length < 4) {
            const randomPos = positions[Math.floor(Math.random() * positions.length)];
            if (!choices.includes(randomPos)) {
                choices.push(randomPos);
            }
        }
        
        return this.shuffleArray([...choices]);
    }

    generateCollegeChoices(correctCollege) {
        const colleges = ['Alabama', 'Ohio State', 'Georgia', 'LSU', 'Clemson', 'Notre Dame', 'Michigan', 'USC', 'Penn State', 'Wisconsin'];
        const choices = [correctCollege];
        
        while (choices.length < 4) {
            const randomCollege = colleges[Math.floor(Math.random() * colleges.length)];
            if (!choices.includes(randomCollege)) {
                choices.push(randomCollege);
            }
        }
        
        return this.shuffleArray([...choices]);
    }

    generateExperienceChoices(correctExperience) {
        const choices = [correctExperience.toString()];
        const baseYears = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        
        while (choices.length < 4) {
            const randomYears = baseYears[Math.floor(Math.random() * baseYears.length)];
            if (!choices.includes(randomYears.toString())) {
                choices.push(randomYears.toString());
            }
        }
        
        return this.shuffleArray([...choices]);
    }

    generateLegendChoices(correctLegend) {
        const legendNames = this.legends.map(legend => legend.name);
        const choices = [correctLegend];
        
        while (choices.length < 4) {
            const randomLegend = legendNames[Math.floor(Math.random() * legendNames.length)];
            if (!choices.includes(randomLegend)) {
                choices.push(randomLegend);
            }
        }
        
        return this.shuffleArray([...choices]);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    displayQuestion(questionData) {
        const questionElement = document.getElementById('question');
        const answerInputElement = document.getElementById('answer-input');
        const multipleChoiceElement = document.getElementById('multiple-choice');

        questionElement.textContent = questionData.question;

        // Hide all input types first
        answerInputElement.classList.add('hidden');
        multipleChoiceElement.classList.add('hidden');

        if (questionData.type === 'text') {
            answerInputElement.classList.remove('hidden');
            document.getElementById('answer-text').placeholder = 'Enter your answer...';
        } else if (questionData.type === 'multiple-choice') {
            multipleChoiceElement.classList.remove('hidden');
            this.setupMultipleChoice(questionData.choices, questionData.answer);
        }
    }

    setupMultipleChoice(choices, correctAnswer) {
        this.correctChoiceIndex = choices.indexOf(correctAnswer);
        const choiceButtons = document.querySelectorAll('.choice-btn');
        
        choices.forEach((choice, index) => {
            choiceButtons[index].textContent = choice;
        });
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

        const isCorrect = this.checkTextAnswer(answerText);
        this.processAnswer(isCorrect);
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

        this.processAnswer(isCorrect);
    }

    checkTextAnswer(userAnswer) {
        const correctAnswer = this.currentQuestionData.answer;
        
        // Normalize both answers for comparison
        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
        
        return normalize(userAnswer) === normalize(correctAnswer);
    }

    processAnswer(isCorrect) {
        const feedbackElement = document.getElementById('feedback');
        const feedbackTextElement = document.getElementById('feedback-text');
        const questionData = this.currentQuestionData;

        if (isCorrect) {
            this.score += 10;
            this.correctAnswers++;
            feedbackElement.className = 'feedback correct';
            feedbackTextElement.innerHTML = `
                <div style="color: var(--success-green); font-size: 1.5em; margin-bottom: 10px;">✓ Correct!</div>
                <div>Answer: ${questionData.answer}</div>
                ${questionData.hint ? `<div style="margin-top: 10px; color: var(--steelers-silver);">${questionData.hint}</div>` : ''}
                <div style="margin-top: 10px; color: var(--steelers-silver);">+10 points</div>
            `;
        } else {
            feedbackElement.className = 'feedback incorrect';
            feedbackTextElement.innerHTML = `
                <div style="color: var(--error-red); font-size: 1.5em; margin-bottom: 10px;">✗ Incorrect</div>
                <div>Correct Answer: ${questionData.answer}</div>
                ${questionData.hint ? `<div style="margin-top: 10px; color: var(--steelers-silver);">${questionData.hint}</div>` : ''}
                ${this.getAdditionalInfo(questionData)}
            `;
        }

        feedbackElement.classList.remove('hidden');
        this.updateScore();
        this.updateStats();
    }

    getAdditionalInfo(questionData) {
        const player = questionData.player;
        if (!player) return '';

        if (player.years) {
            // Legend
            return `<div style="margin-top: 10px; color: var(--steelers-silver);">Years: ${player.years} | Position: ${player.position}</div>`;
        } else {
            // Current player
            return `<div style="margin-top: 10px; color: var(--steelers-silver);">Position: ${player.position} | College: ${player.college}</div>`;
        }
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