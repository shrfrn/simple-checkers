'use strict'

var gBoard = []
var gGame = {
    isWhiteTurn: true,
    selectedCell: null,
    possibleMoves: []
}

function onLoad() {
    createBoard()
    renderBoard(gBoard)
    addClickListeners()
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

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var classList = `cell cell-${i}-${j} `
            classList += (i + j) % 2 ? 'white' : 'black'

            if (gGame.selectedCell?.i === i && gGame.selectedCell?.j === j) {
                classList += ' selected'
            }

            if (gGame.possibleMoves.some(move => move.i === i && move.j === j)) {
                classList += ' possible-move'
            }

            if (board[i][j] === 'white') var pieceHtml = `<div class="piece white"></div>`
            else if (board[i][j] === 'black') var pieceHtml = `<div class="piece black"></div>`
            else pieceHtml = ''

            strHtml += `<div class="${classList}" data-i="${i}" data-j="${j}">${pieceHtml}</div>`
        }
    }

    elBoard.innerHTML = strHtml
}

function addClickListeners() {
    const elBoard = document.querySelector('.board')
    elBoard.addEventListener('click', onCellClick)
}

function onCellClick(event) {
    const cell = event.target.closest('.cell')
    if (!cell) return

    const i = +cell.dataset.i
    const j = +cell.dataset.j
    
    if (gGame.possibleMoves.some(move => move.i === i && move.j === j)) {
        makeMove(i, j)
        return
    }

    const piece = gBoard[i][j]
    if (!piece) {
        clearSelection()
        return
    }

    const isWhitePiece = piece === 'white'
    if (isWhitePiece !== gGame.isWhiteTurn) {
        clearSelection()
        return
    }

    gGame.selectedCell = { i, j }
    gGame.possibleMoves = getPossibleMoves(i, j)
    renderBoard(gBoard)
}

function clearSelection() {
    gGame.selectedCell = null
    gGame.possibleMoves = []
    renderBoard(gBoard)
}

function getPossibleMoves(i, j) {
    const moves = []
    const piece = gBoard[i][j]
    const direction = piece === 'white' ? 1 : -1

    // Regular moves
    const regularMoves = [
        { i: i + direction, j: j - 1 },
        { i: i + direction, j: j + 1 }
    ]

    for (const move of regularMoves) {
        if (isValidPosition(move.i, move.j) && !gBoard[move.i][move.j]) {
            moves.push(move)
        }
    }

    // Jump moves
    const jumpMoves = [
        { i: i + direction * 2, j: j - 2, over: { i: i + direction, j: j - 1 } },
        { i: i + direction * 2, j: j + 2, over: { i: i + direction, j: j + 1 } }
    ]

    for (const move of jumpMoves) {
        if (isValidPosition(move.i, move.j) && !gBoard[move.i][move.j]) {
            const overPiece = gBoard[move.over.i][move.over.j]
            if (overPiece && isOpponentPiece(piece, overPiece)) {
                moves.push(move)
            }
        }
    }

    return moves
}

function isValidPosition(i, j) {
    return i >= 0 && i < 8 && j >= 0 && j < 8
}

function isOpponentPiece(piece1, piece2) {
    return piece1 !== piece2
}

function makeMove(toI, toJ) {
    const { i: fromI, j: fromJ } = gGame.selectedCell
    const move = gGame.possibleMoves.find(m => m.i === toI && m.j === toJ)

    // Move the piece
    gBoard[toI][toJ] = gBoard[fromI][fromJ]
    gBoard[fromI][fromJ] = ''

    // Handle jumps (captures)
    if (Math.abs(toI - fromI) === 2) {
        const overI = (fromI + toI) / 2
        const overJ = (fromJ + toJ) / 2
        gBoard[overI][overJ] = ''
    }

    clearSelection()
    gGame.isWhiteTurn = !gGame.isWhiteTurn

    // Computer's turn
    if (!gGame.isWhiteTurn) {
        setTimeout(makeComputerMove, 500)
    }
}

function makeComputerMove() {
    // Find all possible moves for black pieces
    const allMoves = []
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (gBoard[i][j] === 'black') {
                const moves = getPossibleMoves(i, j)
                moves.forEach(move => {
                    allMoves.push({
                        from: { i, j },
                        to: move
                    })
                })
            }
        }
    }

    if (allMoves.length === 0) {
        alert('Game Over - White Wins!')
        return
    }

    // Randomly select a move
    const move = allMoves[Math.floor(Math.random() * allMoves.length)]
    
    gGame.selectedCell = move.from
    gGame.possibleMoves = [move.to]
    renderBoard(gBoard)

    setTimeout(() => {
        makeMove(move.to.i, move.to.j)
    }, 500)
}