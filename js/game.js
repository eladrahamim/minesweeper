'use strict';
// there are some vars in functions that i didnt use yet, thats because I want an easy access for CSS

const MINE = '💣';
const FLAG = '🚩';
const NORMAL = '😃';
const DAD = '🤯';
const WIN = '😎';
const HINT = '🤫';
const HINTCLICKED = '🤭';

var gBeginnerLevel = {
    SIZE: 4,
    MINES: 2
};
var gMediumeLevel = {
    SIZE: 8,
    MINES: 12
};
var gExpertLevel = {
    SIZE: 12,
    MINES: 30
};

var gGame;
var gBoard;
var gLevel;
var gLives;
var gMines = [];
var gHint = {};
var gIntervalrunTimer;

function initGame(level) {
    gGame = {
        isOn: false,
        isOver: false,
        shownCount: 0,
        markedCount: 0,
        regularShownCount: 0,
        minesMarkedCount: 0,
        secsPassed: 0
    };
    gLevel = {
        SIZE: level.SIZE,
        MINES: level.MINES
    };
    gLives = 3;
    gHint.isClicked = false;
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gBoard);
    clearInterval(gIntervalrunTimer);
    renderElement('.timer', gGame.secsPassed);
    renderElement('.lives', 'LIVES ' + 3);
    renderElement('.restart', NORMAL);
    var el = document.querySelector('.win');
    el.style.display = 'none';
    el = document.querySelector('.gameover');
    el.style.display = 'none';
    renderHint();
}

function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                i: i,
                j: j
            }
            board[i][j] = cell;
        }
    }
    return board;
}

function createMine(cell) {
    var emptyCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (i === cell.i && j === cell.j) continue;
            var currCell = gBoard[i][j];
            emptyCells.push(currCell);
        }
    }
    for (var i = 0; i < gLevel.MINES; i++) {
        var num = getRandomInt(0, emptyCells.length);
        emptyCells[num].isMine = true
        gMines.push(emptyCells[num]);
        emptyCells.splice(num, 1);
    }
    setMinesNegsCount(gBoard);
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            if (!cell.isMine) {
                var minesCount = countMines(cell);
                cell.minesAroundCount = minesCount;
            }

        }
    }
}

function countMines(cell) {
    var count = 0;
    for (var i = cell.i - 1; i <= cell.i + 1; i++) {
        if (i < 0 || i === gBoard.length) continue;
        for (var j = cell.j - 1; j <= cell.j + 1; j++) {
            if (j < 0 || j === gBoard.length ||
                (i === cell.i && j === cell.j)) continue;
            var currCell = gBoard[i][j];
            if (currCell.isMine) count++
        }
    }
    return count;
}


function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j];
    if (gGame.isOver) return;
    if (!gGame.isOn) {
        gGame.isOn = true;
        createMine(cell);
        runTimer();
    }
    if (cell.isShown) return;
    if (gHint.isClicked) {
        revealHint(cell);
        return;
    }
    elCell.style.backgroundColor = 'bisque';
    if (cell.minesAroundCount > 0) {
        cell.isShown = true;
        gGame.shownCount++;
        renderCell(cell, cell.minesAroundCount);
    } else if (cell.isMine) {
        cell.isShown = true;
        gLives--;
        renderCell(cell, MINE);
        renderElement('.lives', 'LIVES ' + gLives);
        checkGameOver();
    } else {
        expandShown(cell);
    }
    checkIfWin();
}

function cellMarked(elCell, i, j) {
    var cell = gBoard[i][j];
    if (gGame.isOver) return;
    if (!gGame.isOn) {
        gGame.isOn = true;
        createMine(cell);
        runTimer();
    }
    var noContext = document.getElementById('noContextMenu');
    noContext.addEventListener('contextmenu', function (event) { event.preventDefault(); });
    if (cell.isMine) {
        gGame.markedCount++;
    } else if (cell.isShown) return;
    renderCell(cell, FLAG);
    cell.isMarked = true;
    checkIfWin();
}

function expandShown(cell) {
    for (var i = cell.i - 1; i <= cell.i + 1; i++) {
        if (i < 0 || i === gBoard.length) continue;
        for (var j = cell.j - 1; j <= cell.j + 1; j++) {
            if (j < 0 || j === gBoard.length) continue;
            var currCell = gBoard[i][j];
            if (currCell.isShown) continue;
            currCell.isShown = true;
            gGame.shownCount++;
            renderCell(currCell, currCell.minesAroundCount);
            if (currCell.minesAroundCount === 0) expandShown(currCell);
        }

    }
    checkIfWin();
}

function revealHint(cell) {
    for (var i = cell.i - 1; i <= cell.i + 1; i++) {
        if (i < 0 || i === gBoard.length) continue;
        for (var j = cell.j - 1; j <= cell.j + 1; j++) {
            if (j < 0 || j === gBoard[0].length) continue;
            var currCell = gBoard[i][j];
            if (currCell.isMine) {
                renderCell(currCell, MINE);
            } else {
                renderCell(currCell, currCell.minesAroundCount);
            }

        }
    }
    gHint.isClicked = false;
    setTimeout(removeHint, 1000);
}

function removeHint() {
    renderBoard(gBoard);
    var elBtn = gHint.elBtn
    elBtn.style.display = 'none';
}

function restart() {
    initGame(gLevel);
}

function checkIfWin() {
    var mineCell = gLevel.MINES;
    var regularCell = gLevel.SIZE ** 2 - mineCell;
    if (gGame.markedCount === mineCell && gGame.shownCount === regularCell) {
        renderElement('.restart', WIN)
        var elGreet = document.querySelector('.win');
        elGreet.style.display = 'block';
        killGame();
    }
}

function checkGameOver() {
    if (gLives === 0) {
        for (var i = 0; i < gMines.length; i++) {
            renderCell(gMines[i], MINE);
        }
        renderElement('.restart', DAD);
        var elGreet = document.querySelector('.gameover');
        elGreet.style.display = 'block';
        killGame();
    } else {
        renderElement('.restart', DAD);
        setTimeout(function () { renderElement('.restart', NORMAL); }, 100);
    }

}

function killGame() {
    gGame.isOn = false;
    gGame.isOver = true;
    clearInterval(gIntervalrunTimer);
}