// The Player factory function that manage the player side
const Player = (marker) => {
  this.marker = marker; // *set the player marker for each different player

  const getMarker = () => {
    // *Get the player marker for the given player
    return marker;
  };

  return { getMarker }; // ? declaring for the global use;
};

// Making the usage of display functions easier
const displayControll = (() => {
  const infoTextElement = document.getElementById("infoText"); //* get the infoText element from document
  const boxElement = document.querySelectorAll(".box"); //* get the box elements from document
  const resetBtn = document.getElementById("reset-btn"); //* get the reset button from document

  // adding the box elements to the event handlers for click
  boxElement.forEach((box) => {
    box.addEventListener("click", (event) => {
      if (event.target.innerText !== "" || gameControll.getIsOver()) {
        // *checking if the box element not blank
        return; //* not calling the playRound for the filled box
      }
      gameControll.playRound(event.target.dataset.index); // *givening the box index by data attribute
      updateBoard(); // updating the display
    });
  });

  resetBtn.addEventListener("click", (event) => {
    gameBoard.reset();
    gameControll.reset();
    updateBoard();
    displayControll.infoMessage("Player X turn");
  });

  const updateBoard = () => {
    for (let i = 0; i < boxElement.length; i++) {
      boxElement[i].innerText = gameBoard.getBox(i);
    }
  };

  const infoMessage = (text) => {
    infoTextElement.innerText = text;
  };

  const winLossTie = (text, isDraw = false) => {
    if (isDraw) {
      infoTextElement.innerText = text;
    } else {
      infoTextElement.innerText = "Player " + text + " won!";
    }
  };

  return { updateBoard, infoMessage, winLossTie };
})();

const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const setBox = (index, marker) => {
    if (index > board.length) {
      return;
    }
    board[index] = marker;
  };

  const getBox = (index) => {
    if (index > board.length) {
      return;
    }
    return board[index];
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { setBox, getBox, reset };
})();

const gameControll = (() => {
  const playerX = Player("X"); // seting the player x marker to X
  const playerO = Player("O"); // seting the player o marker to O
  let round = 1;
  let isOver = false;

  const playRound = (boxIndex) => {
    gameBoard.setBox(boxIndex, getPlayerMarker());

    if (checkWinner()) {
      displayControll.winLossTie(getPlayerMarker());
      isOver = true;
      return;
    }

    if (round === 9) {
      displayControll.winLossTie("Draw!", true);
      isOver = true;
      return;
    }

    round++;
    displayControll.infoMessage(`Player ${getPlayerMarker()} turn`);
  };

  const getPlayerMarker = () => {
    return round % 2 === 1 ? playerX.getMarker() : playerO.getMarker();
  };

  const checkWinner = () => {
    // This code reference by https://github.com/michalosman/tic-tac-toe/
    const winConditions = [
      // rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // diagonal
      [0, 4, 8],
      [2, 4, 6],
    ];

    let tempArray = [];

    for (let i = 0; i < winConditions.length; i++) {
      for (let j = 0; j < 3; j++) {
        tempArray.push(gameBoard.getBox(winConditions[i][j]));
      }
      if (
        tempArray.every((box) => box === getPlayerMarker())
      ) {
        return true;
      }
      tempArray = [];
    }
    return false;
  };

  const getIsOver = () => {
    return isOver;
  };

  const reset = () => {
    round = 1;
    isOver = false;
  };
  return { playRound, reset, getIsOver };
})();
