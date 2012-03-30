
//check for game over conditions
function checkGameOver(){
	//no more possible moves
	//board is complete
	//all tiles are one color.



}

function gameMove(){

	availablePlays = gameBoard; //getAvailablePlays();

	if (availablePlays.contains(this.className)){
		this.className = player.name;
		
	}
}
function setUpBoard(){
    for (var j = 11; j < 18; j++){
        gameboard[j] = document.getElementById( j.toString());
        gameboard[j].onclick = gameMove;
    }
    for (var j = 21; j < 28; j++){
        gameboard[j] = document.getElementById( j.toString());
        gameboard[j].onclick = gameMove;
    }
    for (var j = 31; j < 38; j++){
        gameboard[j] = document.getElementById( j.toString());
        gameboard[j].onclick = gameMove;
    }
    for (var j = 41; j < 48; j++){
        gameboard[j] = document.getElementById( j.toString());
        gameboard[j].onclick = gameMove;
    }
    for (var j = 51; j < 58; j++){
        gameboard[j] = document.getElementById( j.toString());
        gameboard[j].onclick = gameMove;
    }
    for (var j = 61; j < 68; j++){
        gameboard[j] = document.getElementById( j.toString());
        gameboard[j].onclick = gameMove;
    }
    for (var j = 71; j < 78; j++){
        gameboard[j] = document.getElementById( j.toString());
        gameboard[j].onclick = gameMove;
    }
    for (var j = 81; j < 88; j++){
        gameboard[j] = document.getElementById( j.toString());
        gameboard[j].onclick = gameMove;
    }
    for (var j = 89; j < 100; j++){
    	gameboard[j] = undefined;
    }
}

//initalize game and board
function initializeGame(){
	var gameboard =  [];
	setUpBoard();

}

window.onload = initializeGame();