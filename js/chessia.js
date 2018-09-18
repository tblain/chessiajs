var board,
    game = new Chess();
var lastMove;
/*The "AI" part starts here */

//----------------------------------------------------------------

var calculateBoardScore = function(board, boardScore, move) {
    
    if(!boardScore) {
        var boardScore = 0;

        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++) {
                let position = board[i][j];
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
            if(boardScore > 10){
                console.log("depth 0 => board score for : ")
                console.log(move)
                console.log("   boardScore : " + boardScore)
                game.move(move);
                console.log(game.ascii());
                if(!move)
                    game.undo();
            }
        return boardScore;
    } else {
        // console.log("board score")
        // var oldBoardScore = boardScore;
    
        if(move.flags == "c") {
            let positionScore = 9;
            if(game.turn() == "w")
                positionScore = positionScore * -1;
            boardScore += positionScore;         
        }
            // console.log("checkCheck" + checkCheck)

            // console.log(change)
        // console.log(move);
        let positionScore = 0;
        removedPiece = move.captured;
        // console.log("   removedPiece : " + removedPiece)
        if(removedPiece) {
            switch(removedPiece) {
                case "k": // king
                positionScore = 900;
                break;

                case "q": // queen
                positionScore = 90;
                break;

                case "r": // rook
                positionScore = 50;
                console.log("a rook can be killed!!")
                break;

                case "b": // bishop
                positionScore = 30;
                break;

                case "n": // knight
                positionScore = 30;
                break;

                case "n": // pawn
                positionScore = 10;
                break;
            }

            if(game.turn() == 'w'){
                // console.log(game.turn())
                positionScore = positionScore * -1;
            }

            boardScore += positionScore;

            if(boardScore > 10){
                console.log("board score for : ")
                console.log(move)
                console.log("   boardScore : " + boardScore)
                game.move(move);
                console.log(game.ascii());
                if(!move)
                    game.undo();
            }

            // if(boardScore != 0){
            //     console.log("board score for : ")
            //     console.log()
            //     console.log("   boardScore : " + boardScore)
            // }
            // console.log("boardScore " + boardScore + " | position score : " + positionScore + " | " + move)
        }
        // if(boardScore - oldBoardScore > 0) {
        //     console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        //     console.log("       move : " + move + " | score difference : " + (boardScore - oldBoardScore))
        //     console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        // }
        return boardScore;
    }
}

//----------------------------------------------------------------

var minimax = function (depth, game, isMaximisingPlayer, boardScore) {
    // console.log("======================")
    // console.log("depth " + depth)
    positionCount++;
    if (depth === 0) {
        return boardScore;
    }
    var moves = game.moves({ verbose: true });
    // console.log(moves)
    // console.log(moves)
    if (isMaximisingPlayer) {
        var bestScore = -9999;
        for (var i = 0; i < moves.length; i++) {
            game.move(moves[i]);
            // console.log(moves[i])
            if(game.in_checkmate()) {
                bestScore = 999999;
            } else {
                bs = calculateBoardScore(game.board(), boardScore, moves[i]);
                bestScore = Math.max(bestScore, minimax(depth - 1, game, !isMaximisingPlayer, bs));
            }
            game.undo();
        }
        return bestScore;
    } else {
        var bestScore = 9999;
        for (var i = 0; i < moves.length; i++) {
            game.move(moves[i]);
            if(game.in_checkmate()) {
                bestScore = -999999;
            } else {
                bs = calculateBoardScore(game.board(), boardScore, moves[i]);
                bestScore = Math.min(bestScore, minimax(depth - 1, game, !isMaximisingPlayer, bs));
            }
            game.undo();
        }
        return bestScore;
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
    // console.log("makeBestMove")
    console.log("------------------------------")
    var bestMove = getBestMove(game)
    // console.log("mbm : " + bestMove)
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
    positionCount = 0;
    var depth = parseInt($('#search-depth').find(':selected').text());
    var d = new Date().getTime();

    let moves = game.moves();
    var bestScore = -90000;
    var bestMove;
    
    var boardScore = calculateBoardScore(game.board(), null, moves[i])
    
    for (var i = 0; i < moves.length; i++) {
        var move = moves[i];

        bs = calculateBoardScore(game.board(), boardScore, moves[i]);
        moveScore = minimax(depth-1, game, true, bs);
        if (moveScore >= bestScore) {
            bestMove = move;
            bestScore = moveScore;
            // console.log("--------------------")
            
            console.log("   NEW bestScore " + bestScore + " | bestMove " + bestMove)
            game.move(move)
            // console.log(game.ascii())
            game.undo()
        }
    }

    console.log("           bestScore " + bestScore + " | bestMove " + bestMove)



    var d2 = new Date().getTime();
    var moveTime = (d2 - d);
    var positionsPerS = ( positionCount * 1000 / moveTime );

    $('#position-count').text(positionCount);
    $('#time').text(moveTime/1000 + 's');
    $('#positions-per-s').text(positionsPerS);
    $('#evalScore').text(bestScore);


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
    if (move === null)
        return 'snapback';

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

var buttonUndo = function() {
    game.undo();
    game.undo();
    board.position(game.fen());
    renderMoveHistory(game.history());
    console.log("dunsdfosfdslkfndsmlfl")
}