// Game state
let playerWins = 0;
let computerWins = 0;
const WINNING_SCORE = 3;  // First to 3 wins (tournament mode)
let tournamentActive = true;
let currentRoundWinner = null;
let matchHistory = [];

// DOM elements
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const progressBar = document.getElementById('progressBar');
const roundInfo = document.getElementById('roundInfo');
const playerChoiceDisplay = document.getElementById('playerChoiceDisplay');
const computerChoiceDisplay = document.getElementById('computerChoiceDisplay');
const fightAnnouncer = document.getElementById('fightAnnouncer');
const historyList = document.getElementById('historyList');
const rockBtn = document.getElementById('rockBtn');
const paperBtn = document.getElementById('paperBtn');
const scissorsBtn = document.getElementById('scissorsBtn');
const resetTournamentBtn = document.getElementById('resetTournamentBtn');
const newMatchBtn = document.getElementById('newMatchBtn');

// Emoji mappings
const choiceEmojis = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
};

const choiceNames = {
    rock: 'ROCK',
    paper: 'PAPER',
    scissors: 'SCISSORS'
};

// Taunts and messages for fun
const winTaunts = [
    "💪 DOMINATION! +1 point!",
    "🎯 PERFECT SHOT! You're on fire!",
    "🔥 UNSTOPPABLE! Keep going!",
    "⭐ MASTER MOVE! CPU stunned!",
    "🏆 EPIC WIN! One step closer!"
];

const loseTaunts = [
    "😤 CPU strikes back! Stay focused!",
    "💀 Ouch! CPU levels up!",
    "🤖 Robot revenge! Keep trying!",
    "⚡ Good fight! Next round is yours!",
    "🎲 Close one! Shake it off!"
];

const tieMessages = [
    "🤝 TIE! Same move, play again!",
    "🔄 DRAW! No points awarded.",
    "⚖️ EQUAL! Rematch!",
    "🌀 Stalemate! Try different move!"
];

// Helper: Update UI scores & progress
function updateUI() {
    playerScoreEl.textContent = playerWins;
    computerScoreEl.textContent = computerWins;
    
    const progressPercent = ((playerWins + computerWins) / (WINNING_SCORE * 2)) * 100;
    progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
    
    const roundsPlayed = playerWins + computerWins;
    roundInfo.textContent = `Round ${roundsPlayed} / ${WINNING_SCORE * 2 - 1} (First to ${WINNING_SCORE})`;
    
    // Check tournament win condition
    if (playerWins >= WINNING_SCORE) {
        tournamentActive = false;
        fightAnnouncer.innerHTML = "🏆 YOU WIN THE TOURNAMENT! 🏆";
        fightAnnouncer.style.background = "#ffd700";
        fightAnnouncer.style.color = "#5a2a0a";
        
        // Celebration confetti
        canvasConfetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            startVelocity: 20,
            colors: ['#ffd700', '#ffaa44', '#ff6600']
        });
        canvasConfetti({
            particleCount: 100,
            spread: 130,
            origin: { y: 0.5, x: 0.3 }
        });
        canvasConfetti({
            particleCount: 100,
            spread: 130,
            origin: { y: 0.5, x: 0.7 }
        });
        
        addHistoryEntry("🏆🏆🏆 TOURNAMENT VICTORY! YOU ARE THE CHAMPION! 🏆🏆🏆", true);
        disableButtons(true);
    } 
    else if (computerWins >= WINNING_SCORE) {
        tournamentActive = false;
        fightAnnouncer.innerHTML = "🤖 CPU WINS TOURNAMENT! 🤖";
        fightAnnouncer.style.background = "#6b4c3b";
        addHistoryEntry("💀 GAME OVER! CPU won the tournament! Press RESET to challenge again 💀", false);
        disableButtons(true);
    } else {
        // re-enable if tournament active
        if (tournamentActive) disableButtons(false);
        else disableButtons(true);
    }
}

// Disable/Enable action buttons
function disableButtons(disabled) {
    const btns = [rockBtn, paperBtn, scissorsBtn];
    btns.forEach(btn => {
        if (disabled) btn.disabled = true;
        else btn.disabled = false;
    });
}

// Add entry to battle log
function addHistoryEntry(message, isPlayerWin = null) {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'history-entry';
    if (isPlayerWin === true) entryDiv.classList.add('win-highlight');
    entryDiv.textContent = message;
    historyList.prepend(entryDiv);
    
    // Keep history limited to 20 entries
    while (historyList.children.length > 20) {
        historyList.removeChild(historyList.lastChild);
    }
    
    // Remove empty placeholder if exists
    const emptyMsg = historyList.querySelector('.history-empty');
    if (emptyMsg && historyList.children.length > 1) {
        emptyMsg.remove();
    }
}

// Get random taunt
function getRandomTaunt(tauntsArray) {
    return tauntsArray[Math.floor(Math.random() * tauntsArray.length)];
}

// Determine winner
function determineWinner(player, computer) {
    if (player === computer) return 'tie';
    if (
        (player === 'rock' && computer === 'scissors') ||
        (player === 'scissors' && computer === 'paper') ||
        (player === 'paper' && computer === 'rock')
    ) {
        return 'player';
    }
    return 'computer';
}

// Update display with animations
function updateChoiceDisplays(playerChoice, computerChoice, winner) {
    // Update emojis
    playerChoiceDisplay.querySelector('.choice-emoji').textContent = choiceEmojis[playerChoice];
    computerChoiceDisplay.querySelector('.choice-emoji').textContent = choiceEmojis[computerChoice];
    
    // Flash effect on winner side
    if (winner === 'player') {
        playerChoiceDisplay.style.transform = 'scale(1.05)';
        setTimeout(() => { playerChoiceDisplay.style.transform = ''; }, 200);
        fightAnnouncer.innerHTML = "🎉 YOU WIN THE ROUND! 🎉";
        fightAnnouncer.style.background = "#44cc44";
    } else if (winner === 'computer') {
        computerChoiceDisplay.style.transform = 'scale(1.05)';
        setTimeout(() => { computerChoiceDisplay.style.transform = ''; }, 200);
        fightAnnouncer.innerHTML = "💻 CPU WINS THIS ROUND! 💻";
        fightAnnouncer.style.background = "#cc4444";
    } else {
        fightAnnouncer.innerHTML = "🤝 TIE ROUND! 🤝";
        fightAnnouncer.style.background = "#ffaa33";
        playerChoiceDisplay.style.transform = 'scale(1)';
        computerChoiceDisplay.style.transform = 'scale(1)';
    }
    
    // reset announcer color after 1.5 sec
    setTimeout(() => {
        if (tournamentActive && playerWins < WINNING_SCORE && computerWins < WINNING_SCORE) {
            fightAnnouncer.innerHTML = "⚔️ FIGHT! ⚔️";
            fightAnnouncer.style.background = "#ff4d4d";
        }
    }, 1500);
}

// Process player move
function playRound(playerChoice) {
    if (!tournamentActive) {
        addHistoryEntry("⛔ Tournament finished! Press 'RESET TOURNAMENT' to play again.", false);
        return;
    }
    
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    const winner = determineWinner(playerChoice, computerChoice);
    
    // Update displays with animations
    updateChoiceDisplays(playerChoice, computerChoice, winner);
    
    // Process winner and scores
    let roundMessage = `You chose ${choiceNames[playerChoice]} | CPU chose ${choiceNames[computerChoice]}. `;
    
    if (winner === 'player') {
        playerWins++;
        roundMessage += getRandomTaunt(winTaunts);
        addHistoryEntry(`✅ ROUND WIN: ${roundMessage}`, true);
        currentRoundWinner = 'player';
    } 
    else if (winner === 'computer') {
        computerWins++;
        roundMessage += getRandomTaunt(loseTaunts);
        addHistoryEntry(`❌ ROUND LOSS: ${roundMessage}`, false);
        currentRoundWinner = 'computer';
    } 
    else {
        roundMessage += getRandomTaunt(tieMessages);
        addHistoryEntry(`🔄 TIE: ${roundMessage}`, null);
        currentRoundWinner = 'tie';
    }
    
    updateUI();
    
    // Check tournament win after UI update
    if (playerWins >= WINNING_SCORE) {
        addHistoryEntry("🏆🏆🏆 CHAMPION! You conquered the tournament! 🏆🏆🏆", true);
    } else if (computerWins >= WINNING_SCORE) {
        addHistoryEntry("💀 DEFEAT! CPU wins the tournament. Reset to claim victory! 💀", false);
    }
}

// Full tournament reset
function resetTournament() {
    playerWins = 0;
    computerWins = 0;
    tournamentActive = true;
    currentRoundWinner = null;
    
    // Reset displays
    playerChoiceDisplay.querySelector('.choice-emoji').textContent = '❓';
    computerChoiceDisplay.querySelector('.choice-emoji').textContent = '❓';
    fightAnnouncer.innerHTML = "⚔️ FIGHT! ⚔️";
    fightAnnouncer.style.background = "#ff4d4d";
    
    updateUI();
    disableButtons(false);
    
    // Clear history but keep first empty / or show fresh log
    historyList.innerHTML = '<div class="history-empty">✨ Tournament reset! Make a move to begin! ✨</div>';
    
    // add entry about reset
    addHistoryEntry("🔄 TOURNAMENT RESET! First to 3 wins claims victory! 🔥", null);
    
    // small confetti pop for reset spirit
    canvasConfetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.7 },
        startVelocity: 12
    });
}

// New match but keep scores? Actually "NEW MATCH" resets tournament as well
// According to UX: new match = fresh tournament
function newMatch() {
    resetTournament();
    addHistoryEntry("⚡ NEW MATCH STARTED! Let the battle begin! ⚡", null);
}

// Event listeners
rockBtn.addEventListener('click', () => playRound('rock'));
paperBtn.addEventListener('click', () => playRound('paper'));
scissorsBtn.addEventListener('click', () => playRound('scissors'));
resetTournamentBtn.addEventListener('click', resetTournament);
newMatchBtn.addEventListener('click', newMatch);

// Keyboard shortcuts: 1 for rock, 2 paper, 3 scissors (just for fun)
document.addEventListener('keydown', (e) => {
    if (!tournamentActive) return;
    if (e.key === '1') playRound('rock');
    if (e.key === '2') playRound('paper');
    if (e.key === '3') playRound('scissors');
    if (e.key === 'r' || e.key === 'R') resetTournament();
});

// Initial setup
resetTournament();