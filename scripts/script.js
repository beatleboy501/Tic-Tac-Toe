var isExTurn;
var exTaken;
var ohTaken;
var isGameOver;

document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    newGame();
  }
};

function newGame() {
  isExTurn = true;
  isGameOver = false;
  exTaken = [];
  ohTaken = [];
  resetSquares(document.getElementsByClassName('square'));
}

function resetSquares(squares) {
  for (var z = 0; z < squares.length; z++) {
    var elem = squares[z];
    elem.innerHTML = "";
    elem.classList.remove('taken');
    elem.parentNode.classList.remove('winner');
    elem.addEventListener('click', handleSquareClick, false);
  }
}

function handleSquareClick(e) {
  var currentSquare = e.currentTarget;
  if(currentSquare.classList.contains('taken') || isGameOver) {
    return false;
  }
  handleSquareTaken(currentSquare);
  var player = getPlayerState();
  if(player.isWinner){
    handleWinner(player);
  }
  switchPlayer();
  return false;
}

function switchPlayer() {
  isExTurn = !isExTurn;
}

function handleSquareTaken(currentSquare) {
  if(isExTurn){
    currentSquare.innerHTML = "<div class=\"ex\"></div>";
    exTaken.push(currentSquare.id);
  } else {
    currentSquare.innerHTML = "<div class=\"oh\"></div>";
    ohTaken.push(currentSquare.id);
  }
  currentSquare.classList.add('taken');
}

function getPlayerState() {
  var squares = isExTurn ? exTaken : ohTaken;
  if(squares.length < 3){
    return {
      isWinner: false,
      squares: squares
    }
  } else {
    var player = evaluatePlayerSquares(squares);
    return {
      isWinner: player.isWinner,
      squares: player.squares
    }
  }
}

function evaluatePlayerSquares(squares) {
  squares.sort();
  var winningCombos = [
    ['1a', '1b', '1c'], // vertical column
    ['1a', '2a', '3a'], // horizontal row
    ['1c', '2b', '3a'], // diagonal
    ['1b', '2b', '3b'], // horizontal row
    ['1a', '2b', '3c'], // diagonal
    ['1c', '2c', '3c'], // horizontal row
    ['2a', '2b', '2c'], // vertical column
    ['3a', '3b', '3c']  // vertical column
  ];
  for (var j = 0; j < winningCombos.length; j++) {
    if (squares.hasSquare(winningCombos[j][0]) && squares.hasSquare(winningCombos[j][1]) && squares.hasSquare(winningCombos[j][2])) {
      return {
        isWinner: true,
        squares: winningCombos[j]
      }
    }
  }
  return {
    isWinner: false,
    squares: squares
  };
}

function handleWinner(player) {
  isGameOver = true;
  for (var i = 0; i < player.squares.length; i++) {
    document.getElementById(player.squares[i]).parentNode.classList.add('winner');
  }
  setTimeout(function() {
    alert('We have a winner!');
  },10)
}

Array.prototype.hasSquare = function(square) {
  var i = this.length;
  while (i--) {
    if (this[i] === square) {
      return true;
    }
  }
  return false;
};
