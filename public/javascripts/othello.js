
//check for game over conditions
function checkGameOver(){
	//no more possible moves
	//board is complete
	//all tiles are one color.



}

function setUpBoard(){
      for (var j = 0; j < 8; j++){
      	for(var i = 0; i < 8; i++){
	        board[j] = document.getElementById( j.toString() + i.toString() );
	        board[j].onclick = function (){
		        if (this.className === "" && !gameOver){
		            this.className = curPlayer.name;
		            curPlayer.plays.add(this.id);
		               
		            checkGameOver();

		            //switch players turn
		            if (curPlayer == player1){
		               curPlayer = player2;
		            } else {
		                curPlayer = player1;
		            }
		        }
         	}
         }
      }
   }

//initalize game and board
function initializeGame(){
	var gameboard =  [];

}

//main game loop
function playGame(){

}

window.onload = initializeGame();