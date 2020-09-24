'use strict';

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = 'cell cell-' + i + '-' + j;
            strHTML += '<td class="' + className + '" onclick="cellClicked(this,' + i + ',' + j + ' )" oncontextmenu="cellMarked(this,' + i + ',' + j + ')"> ';
            if (!cell.isMine && cell.isShown && !cell.isMarked) {
                strHTML += cell.minesAroundCount;
            }
            if (cell.isMine && cell.isShown && !cell.isMarked) {
                strHTML += MINE;
            }
            if (cell.isMarked) {
                strHTML += FLAG;
            }
            strHTML += '</td>';
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function renderCell(cell, value) {
    var elCell = document.querySelector('.cell-' + cell.i + '-' + cell.j);
    elCell.innerHTML = value;
}

function hintClicked(elBtn) {
    elBtn.innerText = HINTCLICKED;
    gHint = {
        isClicked: true,
        elBtn: elBtn
    };
}

function renderHint() {
    var elBtn = document.querySelector('.hint1');
    renderElement('.hint1', HINT);
    elBtn.style.display = 'inline';
    elBtn = document.querySelector('.hint2');
    renderElement('.hint2', HINT);
    elBtn.style.display = 'inline';
    elBtn = document.querySelector('.hint3');
    renderElement('.hint3', HINT);
    elBtn.style.display = 'inline';
}

function runTimer() {
    gIntervalrunTimer = setInterval(function () { gGame.secsPassed += 1; renderElement('.timer', gGame.secsPassed); }, 1000);
}

function renderElement(selector, value) {
    var el = document.querySelector(selector);
    el.innerText = value;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}