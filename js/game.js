'use strict';

const MINE = '💣';

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gID = 1
var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gIsGameOver = false;
var gIntervalrunTimer;

var gBoard = buildBoard();
setMinesNegsCount(gBoard);
renderBoard(gBoard);

function buildBoard() {
    var SIZE = gLevel.SIZE;
    var emptyCells = [];
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < SIZE; j++) {
            var cell = {
                id: gID,
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                i: i,
                j: j
            }
            board[i][j] = cell;
            emptyCells.push(cell);
            gID++
        }
    }
    createMine(emptyCells);
    return board;
}



function createMine(emptyCells) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var num = getRandomInt(0, emptyCells.length);
        emptyCells[num].isMine = true
        emptyCells.splice(num, 1);
    }
}



function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var minesCount = countMines(cell);
            cell.minesAroundCount = minesCount;
        }
    }
}


function countMines(cell) {
    var count = 0;
    for (var i = cell.i - 1; i <= cell.i + 1; i++) {
        for (var j = cell.j - 1; j <= cell.j + 1; j++) {
            if (i < 0 || i === gBoard.length ||
                j < 0 || j === gBoard.length ||
                i === cell.i && j === cell.j) continue;
            var currCell = gBoard[i][j];
            if (currCell.isMine) count++
        }
    }
    return count;
}


function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = 'cell cell-' + i + '-' + j;
            var id = '" id="' + cell.id;
            strHTML += '<td class="' + className + id + '" onclick="cellClicked(this,' + i + ',' + j + ' )"> ';
            if (cell.minesAroundCount > 0 && cell.isShown) {
                strHTML += cell.minesAroundCount;
            }
            if (cell.isMine && cell.isShown) {
                strHTML += MINE;
            }
            strHTML += '</td>';
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


// log, elCell?
function cellClicked(elCell, i, j) {
    if (gIsGameOver) return;
    if (!gGame.isOn) {
        gGame.isOn = true;
        runTimer();
    }
    console.log(elCell);
    var cell = gBoard[i][j];
    console.log(cell);
    if (cell.minesAroundCount > 0) {
        cell.isShown = true;
        renderCell(cell, cell.minesAroundCount)
    } else if (cell.isMine) {
        cell.isShown = true;
        renderCell(cell, MINE);
        gameOver();
    }
}


function gameOver() {
    gIsGameOver = true;
    gGame.isOn = false;
    clearInterval(gIntervalrunTimer);
}


function renderCell(cell, value) {
    var elCell = document.querySelector('.cell-' + cell.i + '-' + cell.j);
    elCell.innerHTML = value;
}


function runTimer() {
    gIntervalrunTimer = setInterval(function () { gGame.secsPassed += 1; renderTime(gGame.secsPassed); }, 1000);
}

function renderTime(time) {
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = 'Time: ' + time;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}