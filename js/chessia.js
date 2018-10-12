var board,
    game = new Chess();
var lastMove;
/*The "AI" part starts here */

//----------------------------------------------------------------

var whitePawnTable = [
    [100, 100, 100, 100, 100, 100, 100, 100],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 27, 27, 10, 5, 5],
    [0, 0, 0, 25, 25, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -25, -25, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

var blackPawnTable = [
    [ 0,    0,   0,   0,   0,   0,   0,   0],
    [ 5,   10,  10, -25, -25,  10,  10,   5],
    [ 5,    5,  10,  27,  27,  10,   5,   5],
    [ 5,   -5, -10,   0,   0, -10,  -5,   5],
    [ 0,    0,   0,  25,  25,   0,   0,   0],
    [ 10,  10,  20,  30,  30,  20,  10,  10],
    [ 50,  50,  50,  50,  50,  50,  50,  50],
    [100, 100, 100, 100, 100, 100, 100, 100]
];

// a   b     c    d    e     f    g     h
var whiteBishopTable = [
    [0, 0, -30, 0, 0, -30, 0, 0], // 8

    [0, 0, 0, 30, 30, 0, 0, 0], // 7

    [0, 0, 30, 45, 45, 30, 0, 0], // 6

    [0, 30, 45, 60, 60, 45, 30, 0], // 5

    [0, 30, 45, 60, 60, 45, 30, 0], // 4

    [0, 0, 30, 45, 45, 30, 0, 0], // 3

    [0, 0, 0, 30, 30, 0, 0, 0], // 2

    [0, 0, 0, 0, 0, 0, 0, 0]
]; // 1

// a   b     c    d    e     f    g     h
var blackBishopTable = [
    [0, 0, 0, 0, 0, 0, 0, 0], // 8

    [0, 0, 0, 30, 30, 0, 0, 0], // 7

    [0, 0, 30, 45, 45, 30, 0, 0], // 6

    [0, 30, 45, 60, 60, 45, 30, 0], // 5

    [0, 30, 45, 60, 60, 45, 30, 0], // 4

    [0, 0, 30, 45, 45, 30, 0, 0], // 3

    [0, 0, 0, 30, 30, 0, 0, 0], // 2

    [0, 0, -30, 0, 0, -30, 0, 0]
]; // 1


var whiteKnightTable = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -20, -30, -30, -20, -40, -50]
];

var blackKnightTable = [
    [-50, -40, -20, -30, -30, -20, -40, -50],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
];

var calculateBoardScore = function (board, boardScore, move) {

    var boardScore = 0;
    let turn = game.turn() == "w"; // true : white // false : black

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let position = board[i][j];
            let positionScore = 0;
            if (position) {
                // console.log(position.type)
                switch (position.type) {
                case 'k': // king
                    positionScore = 1;
                    break;

                case 'q': // queen
                    positionScore = 1000;
                    break;

                case 'r': // rook
                    positionScore = 550;
                    break;

                case 'b': // bishop
                    positionScore = 325;
                    if (turn)
                        positionScore += whiteBishopTable[i][j];
                    else {
                        positionScore += blackBishopTable[i][j];
                    }
                    break;

                case 'n': // knight
                    positionScore = 325;
                    if (turn)
                        positionScore += whiteKnightTable[i][j];
                    else {
                        positionScore += blackKnightTable[i][j];
                    }
                    break;

                case 'p': // pawn
                    positionScore = 100;
                    if (turn)
                        positionScore += whitePawnTable[i][j];
                    else {
                        positionScore += blackPawnTable[i][j];
                    }
                    break;
                }

                if (position.color == "w") {
                    positionScore = positionScore * -1;
                }

                // console.log(positionScore)
                boardScore += positionScore;
            }
        }
    }
    return boardScore;
}

//----------------------------------------------------------------

var minimax = function (depth, game, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
        return calculateBoardScore(game.board());
    }

    var newGameMoves = game.moves();

    if (isMaximisingPlayer) {
        var bestScore = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.move(newGameMoves[i]);
            if(game.in_checkmate()) {
                game.undo();
                return 999999;
            } else {
                bestScore = Math.max(bestScore, minimax(depth - 1, game, !isMaximisingPlayer));
            }
            game.undo();
        }
        return bestScore;
    } else {
        var bestScore = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.move(newGameMoves[i]);
            if(game.in_checkmate()) {
                game.undo();
                return -999999;
            } else {
              bestScore = Math.min(bestScore, minimax(depth - 1, game, !isMaximisingPlayer));
            }
            game.undo();
        }
        return bestScore;
    }
};

var alphaBeta = function (depth, game, isMaximisingPlayer, a, b) {
    positionCount++;
    if (depth === 0) {
        let score = calculateBoardScore(game.board());
        return [score, score];
    }

    var newGameMoves = game.moves();

    if (isMaximisingPlayer) { // l'ia joue

        for (var i = 0; i < newGameMoves.length; i++) {
            game.move(newGameMoves[i]);
            if (game.in_checkmate()) {
                game.undo();
                break;
                // return [999999, b];
            } else {

                let res = alphaBeta(depth - 1, game, !isMaximisingPlayer, a, b);

                a = Math.max(a, res[1]);

                if (a >= b) {
                    // console.log("   pruning");
                    game.undo();
                    return [a, b];
                }

                game.undo();
            }
        }
        return [a, b];

    } else { // le joueur joue

        for (var i = 0; i < newGameMoves.length; i++) {
            game.move(newGameMoves[i]);
            if (game.in_checkmate()) {
                game.undo();
                break;
                // return [a, -999999];
            } else {
                let res = alphaBeta(depth - 1, game, !isMaximisingPlayer, a, b);
                b = Math.min(b, res[0]);

                if (a >= b) {
                    // console.log("   pruning");
                    game.undo();
                    return [a, b];
                }
            }
            game.undo();
        }
        return [a, b];
    }
};

//----------------------------------------------------------------

var swapElementsIn2Arrays = function(array1, array2, f, t) { // swap elem from the "f" pos to the "t" pos in the 2 arrays simultatenously
    // array1
    var tmp1 = array1[f];
    array1[f] = array1[t];
    array1[t] = tmp1;

    // array2
    var tmp2 = array2[f];
    array2[f] = array2[t];
    array2[t] = tmp2;
}

var killerMoves = function(game) {
    let moves = game.moves();
    let movesEval = [];

    for (var i = 0; i < moves.length; i++) {
        move = moves[i];
        game.move(move);
        movesEval[i] = minimax(1, game, true);
        game.undo();
    }
    var len = moves.length;
    for (var i = len-1; i>=0; i--){
      for(var j = 1; j<=i; j++){
        if(movesEval[j-1]<movesEval[j]){
            swapElementsIn2Arrays(moves, movesEval, j-1, j);
         }
      }
    }

    return moves;
}

//----------------------------------------------------------------

/* board visualization and games state handling starts here*/

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var makeBestMove = function () {
    // console.log("makeBestMove")
    console.log("------------------------------")
    console.log("------------------------------")
    console.log("------------------------------")
    console.log("------------------------------")
    var bestMove = getBestMove(game)
    // console.log("mbm : " + bestMove)
    // console.log(game.ascii());
    game.move(bestMove);
    // console.log(game.ascii());
    board.position(game.fen());
    var evalScore = calculateBoardScore(game.board());
    $('#evalScore').text(evalScore);
    renderMoveHistory(game.history());
    if (game.game_over()) {
        alert('Game over');
    }
};

var getBestMove = function (game) {
    if (true) {
        if (game.game_over()) {
            alert('Game over');
        }
        positionCount = 0;
        var depth = parseInt($('#search-depth').find(':selected').text());
        var d = new Date().getTime();
    }

    let moves = killerMoves(game);
    console.log(moves)
    var bestMove;
    var a = -99999
    var b =  99999;

    for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        console.log("   minmax pour " + move)

        game.move(move);

        res = alphaBeta(depth - 1, game, false, a, b);
        moveScore = res[1];
        console.log("move score : " + moveScore);

        if (moveScore > a) {
            bestMove = move;
            a = moveScore;

            console.log("   NEW bestScore " + a + " | bestMove " + bestMove)
        }
        game.undo()

        var d2 = new Date().getTime();
        var moveTime = (d2 - d);
        var positionsPerS = (positionCount * 1000 / moveTime);
        $('#position-count').text(positionCount);
        $('#time').text(moveTime / 1000 + 's');
        $('#positions-per-s').text(positionsPerS);
    }

    console.log("           bestScore " + a + " | bestMove " + bestMove)

    // var d2 = new Date().getTime();
    // var moveTime = (d2 - d);
    // var positionsPerS = (positionCount * 1000 / moveTime);
    // $('#position-count').text(positionCount);
    // $('#time').text(moveTime / 1000 + 's');
    // $('#positions-per-s').text(positionsPerS);

    return bestMove;
};

var renderMoveHistory = function (moves) {
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + (moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
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
    if (move === null)
        return 'snapback';

    renderMoveHistory(game.history());
    var evalScore = calculateBoardScore(game.board(), null, null);
    $('#evalScore').text(evalScore);
    window.setTimeout(makeBestMove, 250);
};

var onSnapEnd = function () {
    board.position(game.fen());
};

var onMouseoverSquare = function (square, piece) {
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

var onMouseoutSquare = function (square, piece) {
    removeGreySquares();
};

var removeGreySquares = function () {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function (square) {
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

var buttonUndo = function () {
    game.undo();
    game.undo();
    board.position(game.fen());
    renderMoveHistory(game.history());
    // console.log("dunsdfosfdslkfndsmlfl")
}
