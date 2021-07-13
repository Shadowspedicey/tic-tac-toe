const UI = (() =>
{
  const startNresetButton = document.querySelector("#start-reset-game");
  startNresetButton.addEventListener("click", () =>
  {
    currentPlayer.canPlay = true;

    startNresetButton.textContent = "Reset Game";
    //Do logic
  })
})()

const Player = (name, symbol) =>
{
  let score = localStorage.getItem("PlayerScore") || 0;

  let canPlay = false;

  const logName = () => console.log(name);
  
  return { logName, symbol, canPlay };
}

const Player1 = Player("s", "X");
let currentPlayer = Player1;

const Computer = (() =>
{
  const domBoardElements = document.querySelectorAll(".square");

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

  return { Play }
})();

const Gameboard = (() =>
{
  let _boardElements = [null, null, null, null, null, null, null, null, null];
  const domBoardElements = [...document.querySelectorAll(".square")];

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

  return { linkElements, logElements, CheckWinner};
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

    //Game.ChangePlayer();

    Game.CheckIfWon();

    currentPlayer.canPlay = false;
    window.setTimeout(() => { Computer.Play(), currentPlayer.canPlay = true }, Math.floor(Math.random() * 500) + 500);
    Gameboard.logElements();
  }

  //Checks for a click and adds symbol if true
  domBoardElements.forEach((domElement, index) =>
    {
      domElement.addEventListener("click", () => AddSymbol(domElement, index));
    });

  (function ()
  {
    domBoardElements.forEach((domElement, index) =>
    {
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
  })()

  return { AddSymbol }
})();

const Game = (() =>
{
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
      window.setTimeout(() => alert(won + " has won"), 100);
    }
  }

  return { ChangePlayer, CheckIfWon, gameOver }
})();