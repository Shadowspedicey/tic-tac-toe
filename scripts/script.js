const UI = (() =>
{
  const UpdateComputerScore = () =>
  {
    const computerScore = document.querySelector("#computer-score");
    computerScore.textContent = localStorage.getItem("ComputerScore");
  }
  UpdateComputerScore();

  const UpdatePlayerScore = () =>
  {
    const playerScore = document.querySelector("#player-score");
    playerScore.textContent = currentPlayer.score;

  }

  const ChangePlayerScoreText = () =>
  {
    const playerScoreText = document.querySelector("#player-score-text");
    playerScoreText.textContent = currentPlayer.name + "'s Score";

    UpdatePlayerScore();
  }

  const startNresetButton = document.querySelector("#start-reset-game");
  startNresetButton.addEventListener("click", () =>
  {
    if (startNresetButton.textContent === "Start Game")
    {
      (function StartGame()
      {
        const playerName = prompt("What's your name?");
        let player;

        JSON.parse(localStorage.getItem("Players")).forEach(_player =>
          {
            if (_player.name === playerName) player = _player;
          });
        if (player == null)
        {
          let tempPlayer = Player(playerName, "X");
          if (tempPlayer.name == null) return;
          player = tempPlayer;
          Game.PushPlayerToArray(player);
        }
    
        currentPlayer = player;
        currentPlayer.canPlay = true;
        ChangePlayerScoreText();

        DisplayController.AddEvents();
    
        startNresetButton.textContent = "Reset Game";    
      })()
    }
    else if (startNresetButton.textContent === "Reset Game")
    {
      (function ResetGame()
      {
        Gameboard.ClearBoard();
        Game.gameOver = false;
        currentPlayer.canPlay = true;
      })();
    }
  })

  return { UpdatePlayerScore, UpdateComputerScore }
})()

const Player = (name, symbol) =>
{
  let score = 0;

  let canPlay = false;

  return { name, score, symbol, canPlay };
}

const Computer = (() =>
{
  const domBoardElements = document.querySelectorAll(".square");
  let score = localStorage.getItem("ComputerScore") || 0;

  const PlaceSymbol = (element, index) =>
  {
    if (element.querySelector("div")) return Computer.Play();

    if (element.querySelector("span")) element.querySelector("span").remove();

    const Div = document.createElement("div");
    Div.id = "O";
    const Img = document.createElement("img");
    Img.src = "styles/images/" + Div.id + ".png";
    Div.appendChild(Img);
    element.appendChild(Div);

    Gameboard.linkElements(Div.id, index);

    Game.CheckIfWon();
  }

  const Play = () =>
  {
    if (Game.gameOver) return;

    let index = Math.floor(Math.random() * 9);

    PlaceSymbol(domBoardElements[index], index);
  }

  return { Play, score }
})();

const Gameboard = (() =>
{
  let _boardElements = [null, null, null, null, null, null, null, null, null];
  const _domBoardElements = [...document.querySelectorAll(".square")];

  const linkElements = (id, index) =>
  {
    _boardElements[index] = id;
  }

  const CheckWinner = () =>
  {
    if (Game.gameOver) return;

    let winner;

    ["X", "O"].forEach(symbol =>
      {
        if (_boardElements[0] == symbol && _boardElements[1] == symbol && _boardElements[2] == symbol) winner = symbol;
        else if (_boardElements[3] == symbol && _boardElements[4] == symbol && _boardElements[5] == symbol) winner = symbol;
        else if (_boardElements[6] == symbol && _boardElements[7] == symbol && _boardElements[8] == symbol) winner = symbol;
        else if (_boardElements[0] == symbol && _boardElements[3] == symbol && _boardElements[6] == symbol) winner = symbol;
        else if (_boardElements[1] == symbol && _boardElements[4] == symbol && _boardElements[7] == symbol) winner = symbol;
        else if (_boardElements[2] == symbol && _boardElements[5] == symbol && _boardElements[8] == symbol) winner = symbol;

        else if (_boardElements[0] == symbol && _boardElements[4] == symbol && _boardElements[8] == symbol) winner = symbol;
        else if (_boardElements[2] == symbol && _boardElements[4] == symbol && _boardElements[6] == symbol) winner = symbol;
      });

    return winner;
  }

  const logElements = () => console.log(_boardElements);

  const ClearBoard = () =>
  {
    for (let i = 0; i < _boardElements.length; i++) _boardElements[i] = null;

    _domBoardElements.forEach(domElement => 
      {
        if (domElement.querySelector("div")) domElement.querySelector("div").remove()
      });
  }

  return { linkElements, logElements, CheckWinner, ClearBoard };
})();

const DisplayController = (() =>
{
  const domBoardElements = document.querySelectorAll(".square");

  //Creates a symbol div and appends it as a child of square div and assigns the array
  const AddSymbol = (element, index) =>
  {
    if (Game.gameOver || !currentPlayer.canPlay) return;

    if (element.querySelector("div")) return;
    element.querySelector("span").remove()
    const Div = document.createElement("div");
    Div.id = currentPlayer.symbol;
    const Img = document.createElement("img");
    Img.src = "styles/images/" + Div.id + ".png";
    Div.appendChild(Img);
    element.appendChild(Div);

    Gameboard.linkElements(Div.id, index);

    Game.CheckIfWon();

    currentPlayer.canPlay = false;
    window.setTimeout(() => { Computer.Play(), currentPlayer.canPlay = true }, Math.floor(Math.random() * 500) + 500);
    Gameboard.logElements();
  }

  //Adds all event listeners to DOM squares
  const AddEvents = () =>
  {
    domBoardElements.forEach((domElement, index) =>
    {
      domElement.addEventListener("click", () => AddSymbol(domElement, index));

      domElement.addEventListener("mouseover", () => 
      {
        if (Game.gameOver || !currentPlayer.canPlay) return;

        if (domElement.querySelector("div") || domElement.querySelector("span")) return;
        const Span = document.createElement("span");
        const Img = document.createElement("img");
        Img.src = "styles/images/" + currentPlayer.symbol + ".png";
        Img.style.opacity = "50%"
        Span.appendChild(Img);
        domElement.appendChild(Span); 
      });

      domElement.addEventListener("mouseleave", () => 
      {
        if (Game.gameOver || !currentPlayer.canPlay) return;

        if (domElement.querySelector("div") || !domElement.querySelector("span")) return;
        domElement.querySelector("span").remove(); 
      });

    });
  }

  return { AddSymbol, AddEvents }
})();

const Game = (() =>
{
  let players = (JSON.parse(localStorage.getItem("Players"))) || [];
  localStorage.setItem("Players", JSON.stringify(players));
  console.log(players);

  let gameOver = false;

  const ChangePlayer = () =>
  {
    if (currentPlayer === Mohamed) currentPlayer = Ahmed;
    else currentPlayer = Mohamed;
  }

  const CheckIfWon = () =>
  {
    let won = Gameboard.CheckWinner();
    if (won != null) 
    {
      Game.gameOver = true;
      if (won === "X")
      {
        window.setTimeout(() => alert(currentPlayer.name + " has Won!"), 250);
        currentPlayer.score++;
        UI.UpdatePlayerScore();
        SaveChangesToLocalStorage();
      }
      else if (won === "O")
      {
        window.setTimeout(() => alert("Computer has Won!"), 250);
        Computer.score++;
        localStorage.setItem("ComputerScore", Computer.score);
        UI.UpdateComputerScore();
      }
    }
  }

  const SaveChangesToLocalStorage = () => localStorage.setItem("Players", JSON.stringify(players));

  const PushPlayerToArray = (_player) =>
  {
    players.push(_player);
    SaveChangesToLocalStorage();
    console.log(JSON.parse(localStorage.getItem("Players")))
  }

  return { ChangePlayer, CheckIfWon, gameOver, PushPlayerToArray }
})();