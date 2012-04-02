
//check for game over conditions


//initalize game and board
function initializeGame(){

    function checkGameOver(){
        //no more possible moves
        //board is complete
        //all tiles are one color.



    }


    function gameMove(){

        var ccNum = 0;
        //console.log(availablePlays)
        if (availablePlays[this.id]){
            executeMove(this.id, gameboard, player);
            ccNum = 0;
            //switch players turn
            player *= -1;
        } else {
            ccNum++;
        }
        availablePlays = getAvailablePlays();

    }

    function getAvailablePlays(){  // this returns a list of available moves - no flips unless we can map it
    
        var locals = [-11, -10, -9, -1, 1, 9, 10, 11];     //represents adjacent board locations
    
        var moves = []; //storage for moves
    

        for (var i = 11; i <= 88; i++) {     //iterates through board
            if (gameboard[i] && gameboard[i].className == "") {   //empty //location is empty
                for (var j = 0; j <= 7; j++) {
                    var n = 1;
                    if ((gameboard[ (i + locals[j]) ]) && (gameboard[ (i + locals[j]) ].className == ('p' + (-1*player)))) { //position adjacent to location is opp color
                        while (gameboard[ (i + (n*locals[j])) ]) {   //next square in line is opp color
                            if (gameboard[ ( i + ( (n+1)*locals[j]) ) ] && gameboard[ ( i + ( (n+1)*locals[j]) ) ].className == 'p' + player) { //next next square in is my color - viable move
                                moves[i] = i; //store it
                                break;
                            }
                            n++;
                        }
                    }
                }
            }
        }
        return moves;
    }

    function getFlips(move) {   // accepts a move - returns flips for that move - useful for onMouseOver and onClick
 
        // move is the board location - an int
        var locals = [-11, -10, -9, -1, 1, 9, 10, 11];   //represents adjacent board locations
        var flips = [];   //stores board locations that will be flipped
        move = parseInt(move, 10);
        for (var j = 0; j <= 7; j++) {
            var n = 1;
            if (gameboard[(move + locals[j])] && gameboard[ ( move + locals[j] ) ].className == ('p' + (-1*player))) { //position adjacent to location is opp color (avoids hopping over a blank space)
                while (gameboard[ ( move + (n)*locals[j] ) ] && gameboard[ ( move + (n)*locals[j] ) ].className == ('p' + -1*player)) {
                    n++; //iterate down the line - stop when --color  
                }
                if ((gameboard[ ( move + (n)*locals[j] ) ] ) && (gameboard[ ( move + (n)*locals[j] ) ] ).className == ('p' + player)) { //my piece at end of line - 
                    for (var p = 1; p <= n; p++) { //starting at first not-my-piece until last not-my-piece
                        //store locations between my pieces
                        flips.push(move + p*locals[j]);
                    }
                }
            }   
        }
        return flips;
    }


    function setUpBoard(){
        var e;
        for (var j = 11; j < 89; j++) {
            if ( (j%10 != 9) && (j%10 != 0) ) { 
                gameboard[j] = document.getElementById( j.toString());
                gameboard[j].onclick = gameMove;
            }
        }

        for (var j = 89; j < 100; j++){
            gameboard[j] = undefined;
        }
        gameboard[44].className = "p1";
        gameboard[45].className = "p-1";
        gameboard[54].className = "p-1";
        gameboard[55].className = "p1";
    }

    function executeMove(id){
        if (!gameboard[id].className){
            gameboard[id].className = 'p' + player.toString();
            var flips = getFlips(id);
            for (var a in flips){
                gameboard[flips[a]].className = 'p' + player.toString();
            }
        }
    }


	var player1 = 1;
	var player2 = -1;
	var player = player1;
	var gameboard =  [];
	setUpBoard(gameboard);
    var availablePlays = getAvailablePlays(gameboard);

}




window.onload = initializeGame();
