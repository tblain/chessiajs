var board,
    game = new Chess();

/*The "AI" part starts here */

var calculateBoardScore = function(board) {
    var boardScore = 0;
    
    for (let i = 0; i < board.count; i++){
        let position = board[i];
        let positionScore = 0;

        switch(position.type) {
            case 'k':
            positionScore = 900;
            break;

            case 'q':
            positionScore = 90;
            break;

            case '50':
            positionScore = 50;
            break;

            case 'b':
            positionScore = 30;
            break;

            case 'n':
            positionScore = 30;
            break;

            case 'p':
            positionScore = 10;
            break;
        }

        if(position.color == "w")
            positionScore = positionScore * -1;

        boardScore += positionScore;
    }

    return boardScore;
}

var calculateBestMove = function(game) {

    var newGameMoves = game.moves();
    var board = game.board();
    var bestScore = -90000;
    var bestMove;

    for (var i = newGameMoves.length - 1; i >= 0; i--) {
        var move = newGameMoves[i];
        game.move(move);
        moveScore = calculateBoardScore(board);
        if (moveScore > bestScore) {
            bestMove = move;
            bestScore = moveScore;
        }
        game.undo();
    }

    return bestMove;

};

/* board visualization and games state handling starts here*/

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var makeBestMove = function () {
    console.log("makeBestMove")
    var bestMove = getBestMove(game);
    game.move(bestMove);
    board.position(game.fen());
    renderMoveHistory(game.history());
    if (game.game_over()) {
        alert('Game over');
    }
};

var getBestMove = function (game) {
    console.log("getBestMove")
    if (game.game_over()) {
        alert('Game over');
    }
    var bestMove = calculateBestMove(game);
    return bestMove;
};

var renderMoveHistory = function (moves) {
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight);

};

var onDrop = function (source, target) {
    console.log("onDrop")
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }

    renderMoveHistory(game.history());
    window.setTimeout(makeBestMove, 250);
};

var onSnapEnd = function () {
    board.position(game.fen());
};

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};

board = ChessBoard('board', cfg);