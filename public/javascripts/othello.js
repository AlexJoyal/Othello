
//check for game over conditions


//initalize game and board
function initializeGame(){

function checkGameOver(){
    //no more possible moves
    //board is complete
    //all tiles are one color.



}


function gameMove(){

    var availablePlays = getAvailablePlays(gameboard);

    if (availablePlays[this.id]){
        executeMove(this.id, gameboard);
        
        //switch players turn
        if (player == player1){
            player = player2;
        } else {
            player = player1;
        }
    }

}

function getAvailablePlays(){
    return gameboard;
    // working on this
    
    //implement this!
}



function setUpBoard(){
    for (var j = 11; j < 88; j++) {
        if ( (j%10 != 9) && (j%10 != 0) ) { 
            gameboard[j] = document.getElementById( j.toString());
            gameboard[j].onclick = gameMove;
        }
    }

    for (var j = 89; j < 100; j++){
        gameboard[j] = undefined;
    }

    gameboard[44].className = player1;
    gameboard[55].className = player1;
    gameboard[45].className = player2;
    gameboard[54].className = player2;
}

	var player1 = "player1";
	var player2 = "player2"
	var player = player1;
	var gameboard =  [];
	setUpBoard(gameboard);

}

function executeMove(id, gameboard){

}


window.onload = initializeGame();
