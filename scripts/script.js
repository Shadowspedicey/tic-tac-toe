const grid = (function() {
	const gridEl = document.querySelector("#grid");
	const gridItems = gridEl.querySelectorAll(".grid-item")

	gridItems.forEach(e => e.addEventListener("click", e => {
		if (e.target.classList.contains("played"))
			return;
		const {x,y} = getCoordsFromNode(e.target);
		game.playAtField(x, y, "X");
		console.log(`winner: ${game.getWinner()}`);
		if (game.getWinner() == null)
			computer.playAtRandomField();
		e.stopPropagation();
	}));

	function renderAtField(x, y, move) {
		const field = document.querySelector(`[coords="${x},${y}"]`);
		if (field.classList.contains("played"))
			return;
		field.textContent = move;
		field.classList.add("played");
	}

	function win(winner) {
		gridEl.style["pointer-events"] = "none";
	}

	function getAvailableFields() { return gridEl.querySelectorAll(".grid-item:not(.played)");}

	return {getAvailableFields, renderAtField, win};
})();

const game = (function (){
	let winner = null;
	const gameboard = [[],[],[]]
	function playAtField(x,y,move) {
		if (gameboard[x][y] != null)
			return;
		gameboard[x][y] = move;
		grid.renderAtField(x,y, move)
		checkWin();
		if (winner === false)
			grid.win(winner);
	}

	function checkWin() {
		// Check rows and columns
		for (let i = 0; i < gameboard.length; i++) {
		  if (gameboard[i][0] !== 0 && gameboard[i][0] === gameboard[i][1] && gameboard[i][1] === gameboard[i][2]) {
			winner = gameboard[i][0]; // Row win
			return;
		  }
		  if (gameboard[0][i] !== 0 && gameboard[0][i] === gameboard[1][i] && gameboard[1][i] === gameboard[2][i]) {
			winner = gameboard[0][i]; // Column win
			return;
		  }
		}
	  
		// Check diagonals only if the gameboard is symmetrical
		if (gameboard[0][0] !== 0 && gameboard[0][0] === gameboard[1][1] && gameboard[1][1] === gameboard[2][2]) {
		  winner = gameboard[0][0]; // Diagonal win
		  return;
		}
	  
		winner = 0; // No winner
	}

	return {playAtField, getWinner: () => winner}
})();

const computer = (function() {
	function playAtRandomField() {
		const availableFields = grid.getAvailableFields();
		const randomField = availableFields[Math.floor(Math.random() * availableFields.length)];
		const {x,y} = getCoordsFromNode(randomField);
		game.playAtField(x,y, "O")
	}

	return {playAtRandomField}
})();

function getCoordsFromNode(node) {
	const coords = node.attributes["coords"].value.split(",");
	const x = coords[0], y = coords[1];
	return {x,y}
}