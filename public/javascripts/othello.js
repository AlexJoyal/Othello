
//check for game over conditions
function checkGameOver(){
	//no more possible moves
	//board is complete
	//all tiles are one color.



}

function GameMove(){
	availablePlays = getAvailablePlays();

	if (//availablePlays.contains(this.className)){
		this.className = player.name;
		game.plays.add({player: this.id);
		               
		

		//switch players turn
		if (player == player1){
		    player = player2;
		} else {
		    player = player1;
		}
	}
}
function setUpBoard(){
      for (var j = 0; j < 10; j++){
      	for(var i = 0; i < 10; i++){
	        gameboard[j] = document.getElementById( j.toString() + i.toString() );
	        gameboard[j].onclick = GameMove;
         }
      }
   }

//initalize game and board
function initializeGame(){
	var gameboard =  [];

}

window.onload = initializeGame();