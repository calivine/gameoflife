let gameSquare = [];
let nextState = [];
let restartingGame = false;
let boardSize = $('input:checked').val();
let squareSize = 3;
let gameIsPlaying = false;
let gameId;
const alive = '#230'
const dead = 'lightgrey'
const timeDelay = 360;

const $pauseButton = $('button#pause');
const $startButton = $('button#start');
const $restartButton = $('button#restart');
const $randomButton = $('button#random');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function sumArray(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('Input must be an array');
    }

    return arr.reduce((sum, num) => sum + num, 0);
}

function resetSquares(num) {
    for (let i = 0; i < 64; i++) {
        $('#' + i.toString()).css({'backgroundColor': alive});
    }
}

function generateSquares(num) {
    const root = Math.sqrt(num);
    if (root % 1 !== 0) {

    }

    const container = $('<div/>').css({
        display: 'grid',
        gridTemplateColumns: `repeat(${root}, ${squareSize}px)`,
        gridTemplateRows: `repeat(${root}, ${squareSize}px)`,
        gap: '1px'
    }).addClass('board-container');

    let index = 0;
    let backgroundColor = dead;
    for (let r = 0; r < root; r++) {
        gameSquare[r] = [];
        nextState[r] = [];
        for (let c = 0; c < root; c++) {
            let n = getRandomInt(6);
            if (n === 1) {
                gameSquare[r][c] = 1;
                nextState[r][c] = gameSquare[r][c];
                backgroundColor = alive;
            }
            else {
                backgroundColor = dead;
                gameSquare[r][c] = 0;
                nextState[r][c] = gameSquare[r][c];
            }
            //backgroundColor = 'grey';
            const square = $('<div/>')
              .css({
                  backgroundColor,
                  width: `${squareSize}px`,
                  height: `${squareSize}px`
              })
              .attr('id', index.toString());

            container.append(square);
            index++;
        }
    }

    $('#board').append(container);
}

function getCoordinates(label) {

    let nPrime = label;

    // Find the row index
    let i = Math.floor(nPrime / 6);

    // Find the column index
    let j = nPrime % 6;

    return [i, j];
}

function createBlankBoard(num) {
    const root = Math.sqrt(num);
    if (root % 1 !== 0) {


    }

    const container = $('<div/>').css({
        display: 'grid',
        gridTemplateColumns: `repeat(${root}, ${squareSize}px)`,
        gridTemplateRows: `repeat(${root}, ${squareSize}px)`,
        gap: '1px'
    }).addClass('board-container');

    let index = 0;
    let backgroundColor = dead;
    for (let r = 0; r < root; r++) {
        gameSquare[r] = [];
        nextState[r] = [];
        for (let c = 0; c < root; c++) {
            const square = $('<div/>')
              .css({
                  backgroundColor,
                  width: `${squareSize}px`,
                  height: `${squareSize}px`
              })
              .attr('id', index.toString());
            gameSquare[r][c] = 0;
            nextState[r][c] = gameSquare[r][c];
            container.append(square);
            index++;
        }
    }

    $('#board').append(container);
}

function updateGame(root) {
    let i = 0;
    let neighbors = []
    for (let r = 0; r < root; r++) {

        for (let c = 0; c < root; c++) {
            if (r > 0) {
                neighbors.push(gameSquare[r - 1][c]) // northern neighbor
                if (c > 0 && c !== root - 1) {
                    neighbors.push(gameSquare[r - 1][c - 1]); // northwestern neighbor
                    neighbors.push(gameSquare[r - 1][c + 1]) // northeastern neighbor
                }

            }
            if (r < root -1) {
                neighbors.push(gameSquare[r + 1][c]) // southern neighbor
                if (c > 0 && c !== root - 1) {
                    neighbors.push(gameSquare[r + 1][c - 1]) // southwestern neighbor
                    neighbors.push(gameSquare[r + 1][c + 1]) // southeastern neighbor
                }
                else if (c > 0) {
                    neighbors.push(gameSquare[r + 1][c - 1]) // southwestern neighbor
                }
            }
            if (c > 0) {
                neighbors.push(gameSquare[r][c - 1]); // western neighbor
            }
            if (c < root - 1) {
                neighbors.push(gameSquare[r][c+1]); // eastern neighbor
            }
            //neighbors.push(gameSquare[r][c]);

            let sum = sumArray(neighbors);
            if (sum === 4) {
                nextState[r][c] = gameSquare[r][c];
            }
            else if (sum === 3) {
                nextState[r][c] = 1;
            }
            else {
                nextState[r][c] = 0;
            }
            i++;
            neighbors.length = 0;
        }
    }
}

function updateDisplay(root) {
    let i = 0;
    for (let r = 0; r < root; r++) {
        for (let c = 0; c < root; c++) {
            gameSquare[r][c] = nextState[r][c];
            const backgroundColor = (nextState[r][c] === 0) ? dead : alive;
            $('#' + i.toString()).css({backgroundColor});
            i++;
        }
    }
}


function playGame(timestamp) {
    const root = Math.sqrt(boardSize);
    setTimeout(function () {
        if (gameIsPlaying) {
            updateGame(root);
            updateDisplay(root);
            requestAnimationFrame(playGame);
        }
        else {
            requestAnimationFrame(playGame);
        }
    }, timeDelay)

}

function restartGame(root) {
    let index = 0;
    for (let r = 0; r < root; r++) {
        for (let c = 0; c < root; c++) {
            backgroundColor = dead;
            gameSquare[r][c] = 0;
            nextState[r][c] = gameSquare[r][c];
            $('#' + index.toString()).css({backgroundColor});
            index++;
        }
    }
}

function setSquareSize(boardSize) {
    switch (boardSize) {
        case "36":
            return 64;
        case "576":
            return 20;
        case "1024":
            return 16;
        case "3136":
            return 8;
        case "4096":
            return 5;
        case "16384":
            return 3;
    }
}

function clearBoard() {
    $('.board-container').empty().remove();
}

$startButton.on('click', function() {

    gameIsPlaying = true;

    $(this).hide();
    $restartButton.show();
    $pauseButton.show();
    requestAnimationFrame(playGame);
});

$pauseButton.on('click', function() {
    if ($(this).text() === 'Pause') {
        gameIsPlaying = false;
        $(this).text('Unpause').removeClass('btn-warning').addClass('btn-primary');

    }
    else if ($(this).text() === 'Unpause') {
        gameIsPlaying = true;
        $(this).text('Pause').removeClass('btn-primary').addClass('btn-warning');
    }

});

$randomButton.on('click', function () {
    clearBoard();
    generateSquares(boardSize);
});

$restartButton.on('click', function() {
    gameIsPlaying = false;
    restartingGame = true;
    const root = Math.sqrt(boardSize);
    $(this).hide();
    $startButton.show();
    $pauseButton.text('Pause').removeClass('btn-primary').addClass('btn-warning');
    $pauseButton.hide();
    restartGame(root);
});



$('input:radio').on('change', function () {
    boardSize = $(this).val();
    gameIsPlaying = false;
    restartingGame = true;
    const root = Math.sqrt(boardSize);
    clearBoard();
    squareSize = setSquareSize(boardSize);
    createBlankBoard(boardSize);
    $('.board-container > div').on('click', function () {
        // console.log($(this).css('background-color'));
        // console.log($(this).attr('id'));
        let [row, col] = getCoordinates($(this).attr('id'));
        gameSquare[row][col] = gameSquare[row][col] === 1 ? 0 : 1;
        nextState[row][col] = gameSquare[row][col];
        if ($(this).css('background-color') === 'rgb(211, 211, 211)') {
            $(this).css({'background-color': '#000'});
        }
        else {
            $(this).css({'background-color': dead});
        }
        // console.log(gameSquare[row][col]);
    });
});

$(function() {
    createBlankBoard(boardSize);

    $('.board-container > div').on('click', function () {
        // console.log($(this).css('background-color'));
        // console.log($(this));
        if ($(this).css('background-color') === 'rgb(211, 211, 211)' || $(this).css('background-color') === dead) {
            $(this).css({'background-color': '#000'});
        }
        else {
            $(this).css({'background-color': dead});
        }
    });

});