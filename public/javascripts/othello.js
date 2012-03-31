
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
        console.log(availablePlays)
        if (availablePlays[this.id]){
            executeMove(this.id, gameboard, player);
            
            //switch players turn
            player *= -1;
        }

    }

    function getAvailablePlays(){  // this returns a list of available moves - no flips unless we can map it
    
        var locals = new Array(-11, -10, -9, -1, 1, 9, 10, 11);     //represents adjacent board locations
    
        var moves = []; //storage for moves
    

        for (var i = 11; i <= 88; i++) {     //iterates through board
            if (gameboard[i] == 0) {   //empty //location is empty
                for (var j = 0; j <= 7; j++) {
                    var n = 2;
                    if (gameboard[ ( i + locals[j] ) ] == -1*player) { //position adjacent to location is opp color
                        while (gameboard[ ( i + (n*locals[j]) ) ] == -1*player) {   //next square in line is opp color
                            if (gameboard[ ( i + ( (n+1)*locals[j]) ) ] == player) { //next next square in is my color - viable move
                                moves[i] = i; //store it
                            } else {
                                n++;
                            }
                        }
                    }
                }
            }
        }
        return moves;
    }

    function getFlips(move) {   // accepts a move - returns flips for that move - useful for onMouseOver and onClick
 
        // move is the board location - an int
        var locals = new Array(-11, -10, -9, -1, 1, 9, 10, 11);   //represents adjacent board locations
        var flips = [];   //stores board locations that will be flipped

        for (var j = 0; j <= 7; j++) {
            var n = 1;
            if (gameboard[ ( move + locals[j] ) ].className == -1*player) { //position adjacent to location is opp color (avoids hopping over a blank space)
                while (gameboard[ ( move + n*locals[j] ) ] == -1*player) {
                    n++; //iterate down the line - stop when --color
                }
                if ((gameboard[ ( move + (n+1)*locals[j] ) ] ) == player) { //my piece at end of line - 
                    for (var p = 1; p <= n; p++) { //starting at first not-my-piece until last not-my-piece
                        flips.push(move + p*locals[j]); //store locations between my pieces
                    }
                }
            }   
        }
        return flips;
    }


    function setUpBoard(){
        var e;
        for (var j = 11; j < 88; j++) {
            if ( (j%10 != 9) && (j%10 != 0) ) { 
                gameboard[j] = document.getElementById( j.toString());
                gameboard[j].onclick = gameMove;
            }
        }

        for (var j = 89; j < 100; j++){
            gameboard[j] = undefined;
        }

        executeMove(44, gameboard, player1);
        executeMove(45, gameboard, player2);
        executeMove(54, gameboard, player2);
        executeMove(55, gameboard, player1);
    }

	var player1 = 1;
	var player2 = -1;
	var player = player1;
	var gameboard =  [];
	setUpBoard(gameboard);

}

function executeMove(id, gameboard, player){
    if (!gameboard[id].className){
        gameboard[id].className = 'p' + player.toString();
    }
}


window.onload = initializeGame();
