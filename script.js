// ===== عناصر DOM =====
const statusDisplay = document.getElementById('statusDisplay');
const cells = document.querySelectorAll('.cell');
const resetBtn = document.getElementById('resetBtn');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');
const scoreDrawDisplay = document.getElementById('scoreDraw');

// ===== متغيرات حالة اللعبة =====
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let scores = { X: 0, O: 0, Draw: 0 };

// ===== الرسائل =====
const winningMessage = () => `🎉 اللاعب ${currentPlayer} فاز!`;
const drawMessage = () => `🤝 انتهت اللعبة بالتعادل!`;
const currentPlayerTurn = () => `دور اللاعب ${currentPlayer}`;

// ===== شروط الفوز =====
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// ===== دوال اللعبة =====

// دالة لمعالجة نقرة الخلية
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    // التحقق إذا كانت الخلية مشغولة أو اللعبة منتهية
    if (board[clickedCellIndex] !== '' || !isGameActive) {
        return;
    }

    // تحديث الخلية والحالة
    handleCellPlayed(clickedCell, clickedCellIndex);
    // التحقق من النتيجة
    handleResultValidation();
}

// دالة لتحديث اللوحة والواجهة
function handleCellPlayed(clickedCell, clickedCellIndex) {
    board[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
}

// دالة لتغيير اللاعب
function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = currentPlayerTurn();
    statusDisplay.className = 'status'; // إعادة التعيين للنمط الافتراضي
}

// دالة للتحقق من الفوز أو التعادل
function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        statusDisplay.className = `status win-${currentPlayer.toLowerCase()}`;
        isGameActive = false;
        updateScore(currentPlayer);
        createConfetti(); // تفعيل تأثير الفوز
        return;
    }

    let roundDraw = !board.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        statusDisplay.className = 'status draw';
        isGameActive = false;
        updateScore('Draw');
        return;
    }

    handlePlayerChange();
}

// دالة لإعادة ضبط اللعبة
function handleResetGame() {
    isGameActive = true;
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.innerHTML = currentPlayerTurn();
    statusDisplay.className = 'status';
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('x', 'o');
    });
}

// دالة لتحديث سجل النتائج
function updateScore(winner) {
    scores[winner]++;
    scoreXDisplay.textContent = scores.X;
    scoreODisplay.textContent = scores.O;
    scoreDrawDisplay.textContent = scores.Draw;

    // إضافة تأثير التمييز
    if(winner !== 'Draw') {
        document.getElementById(`score${winner}`).parentElement.classList.add('highlight');
        setTimeout(() => {
            document.getElementById(`score${winner}`).parentElement.classList.remove('highlight');
        }, 2000);
    }
}

// ===== مؤثر confetti (من الكود الأصلي) =====
function createConfetti() {
    const colors = ['#e74c3c', '#3498db', '#f1c40f', '#667eea', '#764ba2'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 1.5 + 's';
        document.body.appendChild(confetti);
        setTimeout(() => document.body.removeChild(confetti), 2200);
    }
}


// ===== ربط الأحداث =====
document.addEventListener('DOMContentLoaded', () => {
    statusDisplay.innerHTML = currentPlayerTurn();
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', handleResetGame);
});