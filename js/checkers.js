'use strict'

var gBoard = []

function onLoad() {
    createBoard()
    renderBoard(gBoard)
    console.table(gBoard)
}

function createBoard() {
    for (var i = 0; i < 8; i++){
        gBoard[i] = []

        for (var j = 0; j < 8; j++){
            gBoard[i][j] = ''
            if ((i + j) % 2 === 0) continue

            if (i < 3) gBoard[i][j] = 'white'
            else if (i > 4) gBoard[i][j] = 'black'
        }
    }
}

function renderBoard(board) {
    const elBoard = document.querySelector('.board')
    var strHtml = ``

    for (var i = 0; i < board.length; i++){
        for (var j = 0; j < board[i].length; j++){
            var classList = `cell cell-${i}-${j} `
            classList += (i + j) % 2 ? 'white' : 'black' 

            if (board[i][j] === 'white') var pieceHtml = `<div class="piece white"></div>`
            else if (board[i][j] === 'black') var pieceHtml = `<div class="piece black"></div>`
            else pieceHtml = ''

            strHtml += `<div class="${classList}">${pieceHtml}</div>`
        }
    }

    elBoard.innerHTML = strHtml
}