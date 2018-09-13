var board,
    game = new Chess();
var lastMove;
/*The "AI" part starts here */

var DEPTH = 2;

//----------------------------------------------------------------

var calculateBoardScore = function(board) {
    var boardScore = 0;

    for (let i = 0; i < board.length; i++){
        let row = board[i];
        // console.log("i: " + i)

        for (let j = 0; j < row.length; j++) {
            // console.log("   j: " + j)
            let position = row[j];
            let positionScore = 0;
            if(position) {
                // console.log(position.type)
                switch(position.type) {
                    case 'k': // king
                    positionScore = 900;
                    break;

                    case 'q': // queen
                    positionScore = 90;
                    break;

                    case 'r': // rook
                    positionScore = 50;
                    break;

                    case 'b': // bishop
                    positionScore = 30;
                    break;

                    case 'n': // knight
                    positionScore = 30;
                    break;

                    case 'p': // pawn
                    positionScore = 10;
                    break;
                }

                if(position.color == "w")
                    positionScore = positionScore * -1;
                // console.log(positionScore)
                boardScore += positionScore;
            }
        }
    }

    return boardScore;
}

//----------------------------------------------------------------

var minimax = function (depth, game, isMaximisingPlayer) {
    if (depth === 0) {
        return calculateBoardScore(game.board());
    }
    var moves = game.moves();
    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < moves.length; i++) {
            game.move(moves[i]);
            if(game.in_checkmate()) {
                game.undo();
                return 999999;
            } else {
                bestMove = Math.max(bestMove, minimax(depth - 1, game, !isMaximisingPlayer));
            }
            game.undo();
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < moves.length; i++) {
            game.move(moves[i]);
            if(game.in_checkmate()) {
                game.undo();
                return -999999;
            } else {
                bestMove = Math.min(bestMove, minimax(depth - 1, game, !isMaximisingPlayer));
            }
            game.undo();
        }
        return bestMove;
    }
};

//----------------------------------------------------------------

/* board visualization and games state handling starts here*/

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var makeBestMove = function () {
    console.log("makeBestMove")
    var bestMove = getBestMove(game)
    console.log("mbm : " + bestMove)
    // console.log(game.ascii());
    game.move(bestMove);
    // console.log(game.ascii());
    board.position(game.fen());
    renderMoveHistory(game.history());
    if (game.game_over()) {
        alert('Game over');
    }
};

var getBestMove = function (game) {
    // console.log("getBestMove")
    if (game.game_over()) {
        alert('Game over');
    }
    let moves = game.moves();
    var bestScore = -90000;
    var bestMove;
    for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        moveScore = minimax(DEPTH, game, true);;
        if (moveScore > bestScore) {
            bestMove = move;
            bestScore = moveScore;
        }
    }
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
    // console.log("onDrop")
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });
    // console.log(move.san)
    removeGreySquares();
    if (move === null) {
        console.log("spanback")
        return 'snapback';
    } else {
        console.log("create lastMove")
        // console.log(game.ascii())
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