
//check for game over conditions


//initalize game and board
function initializeGame(){

    // this returns the number of tiles p1 has as a function of p-1
    function getStatus(gb) {   
    	var mm = 0;
    	for (var i = 11; i <= 88; i++) {   
    		if (gb[i]) {
    			if (gb[i].className == 'p1') {
    		 		mm++;
    		 	}
    		 	else {
    		 		mm--;
    		 	}
    		 }	
		}
		return mm;    
    }

    function setUpBoard(){
        var e;
        for (var j = 11; j < 89; j++) {
            if ( (j%10 != 9) && (j%10 != 0) ) { 
                gameboard[j] = document.getElementById(j.toString());
                
                gameboard[j].className = "";
                gameboard[j].onclick = gameMove;
                
                //TODO implement onmouseover - shows results of click
				//gameboard[j].onmouseover = showMove();
            }
        }

  	  		
        gameboard[44].className = "p1";
        gameboard[45].className = "p-1";
        gameboard[54].className = "p-1";
        gameboard[55].className = "p1";
    }
    
    
    function checkGameOver(gameboard){

        //end state test - true when board is full
        function allTilesFilled() {
            for (var i = 11; i <= 88; i++) {
                if ( (i%10 != 9) && (i%10 != 0) ) { 
                    if (gameboard[i].className == ""){
                        return false;
                    }
                }
            }
            return true;
        }

        if (allTilesFilled()){
            gameover = true;
            GameOver();
        } else if (getAvailablePlays(gameboard, player1) == "" && getAvailablePlays(gameboard, player2) == ""){
            gameover = true;
            GameOver();
        }
        
    }
    
    
    function GameOver(){
        //increment games played
        //increment winning players victory total
        //store game board and history of moves
        //
        console.log("Game Over");
        //gamesPlayed++;

    }

    //need to keep track of the board without updating it    
    function virtualMove(gb,id) {
		
    	return gb;
    }
    
    
    function gameMove(){
        availablePlays = getAvailablePlays(gameboard, player);
        if (availablePlays.length === 0 && !gameover){
                player *= -1;
                IagoPlays();
        } else if (availablePlays[this.id] && !gameover){
            GAMEHISTORY.push({'id':this.id, 'player':player});
            executeMove(this.id, player);
            //console.log(player);
			//Iago plays - 
            //this is functioning level 1 implementation - we may want to randomize when multiple best moves
			IagoPlays();
        }
        
        checkGameOver(gameboard);

        //L2 - choose best move for two plays later assuming opponent is infallible
		// attempt 1 - just add + - and generate a number
		//need to find max of min of max
		/*
        	var L1Moves = [];
			L1Moves = getAvailablePlays(gameboard);
			console.log("L1Moves.length is " + L1Moves.length);
			var plus = 0;
			var minus = 0;
			for (var i = 0; i < L1Moves.length; i++){
				plus = getFlips(gameboard,L1Moves[i]);
				console.log("plus");
			}
        */
        //end L2
    }

    // the if statement in here doesn't seem to be doing anything -- 
    // it verifies that the id of the move is a valid board location
    function executeMove(id, p){

        if (!gameboard[id].className){
            gameboard[id].className = 'p' + p.toString();
            var flips = getFlips(gameboard, id, p);
            for (var a in flips){
                gameboard[flips[a]].className = 'p' + p.toString();
                //console.log(player);
            }
        }
        player *= -1;
        getGameScore(gameboard);
    }

    function IagoPlays(){
        var bestMove = minimax.getMax(gameboard);
        if (bestMove === 0){
            console.log("Iago has no moves! Your turn")
            player *= -1;
            return;
        }
        GAMEHISTORY.push({'id':bestMove, 'player':player});
        setTimeout(function(){executeMove(bestMove, player);}, 1000);
    }

    function getGameScore(gameboard){
        p1Score = 0;
        p2Score = 0;
        for (var i = 11; i <= 88; i++) {
            if ( (i%10 != 9) && (i%10 != 0) ) { 
                if (gameboard[i].className == "p1"){
                    p1Score++;
                }
                if (gameboard[i].className == "p-1"){
                    p2Score++;
                }
            }
        }
        p1Wins.innerHTML = p1Score;
        p2Wins.innerHTML = p2Score;
    }

    function getAvailablePlays(gb, player){  // this returns a list of available moves - no flips unless we can map it
    
        var locals = [-11, -10, -9, -1, 1, 9, 10, 11];     //represents adjacent board locations
        var moves = []; //storage for moves

        for (var i = 11; i <= 88; i++) {     //iterates through board
            if (gb[i] && gb[i].className == "") {   //location is empty
                for (var j = 0; j <= 7; j++) {
                    var n = 1;
                    if ((gb[ (i + locals[j]) ]) && (gb[ (i + locals[j]) ].className == ('p' + (-1*player)))) { //position adjacent to location is opp color
                        while (gb[ (i + (n*locals[j])) ]) {   //next square in line is opp color
                            if (gb[ ( i + ( (n+1)*locals[j]) ) ] && gb[ ( i + ( (n+1)*locals[j]) ) ].className == 'p' + player) { //next next square in is my color - viable move
                                moves[i] = i; //store it
                                // next line shows move options
                                //gameboard[i].className = "pMove";
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


    // this has been modified to accept either the actual gameboard or the virtual gameboard
    function getFlips(gb, move) {   // accepts a move - returns flips for that move - useful for onMouseOver and onClick
 
        // move is the board location - an int
        var locals = [-11, -10, -9, -1, 1, 9, 10, 11];   //represents adjacent board locations
        var flips = [];   //stores board locations that will be flipped
        move = parseInt(move, 10);
        for (var j = 0; j <= 7; j++) {
            var n = 1;
            if (gb[(move + locals[j])] && gb[ ( move + locals[j] ) ].className == ('p' + (-1*player))) { //position adjacent to location is opp color (avoids hopping over a blank space)
                while (gb[ ( move + (n)*locals[j] ) ] && gb[ ( move + (n)*locals[j] ) ].className == ('p' + -1*player)) {
                    n++; //iterate down the line - stop when --color  
                }
                if ((gb[ ( move + (n)*locals[j] ) ] ) && (gb[ ( move + (n)*locals[j] ) ] ).className == ('p' + player)) { //my piece at end of line - 
                    for (var p = 1; p <= n; p++) { //starting at first not-my-piece until last not-my-piece
                        //store locations between my pieces
                        flips.push(move + p*locals[j]);
                    }
                }
            }   
        }
        return flips;
    }

    function replayMove(id, player, moves){
        counter++;
        if (counter >= moves.length){
            executeMove(id, player);
            return;
        } else {
            executeMove(id, player);
        }
        //console.log(counter);
        setTimeout(function() {replayMove(moves[counter].id, moves[counter].player, moves);}, 1000);
    }

    //this accepts the gameboard and returns the new move when the +player makes the best decision 
    //implicit assumption that the move flips pieces - generating a positive result - else the 
    //  move would be invalid
    function getMax(gb){  
        var nMoves = [];
        var nFlips = 0;
        var maxFlips = 0;
        var maxMove = 0;
        
        nMoves = getAvailablePlays(gb, player);
        for (var n in nMoves) {
            nFlips = getFlips(gb,n);
            //console.log(nFlips);
            if (nFlips.length > maxFlips) {
                maxMove = n;
                maxFlips = nFlips.length;
            }
        }
        return maxMove;
    }
    
    
    //this accepts the gameboard and returns the new move when the -player makes the best decision 
    //implicit assumption that the move flips pieces - generating a negative result - else the 
    //  move would be invalid
    function getMin(gb){  //this accepts the gameboard and returns the new move when the -player makes the best decision 
        var nMoves = [];
        var nFlips = 0;
        var maxFlips = 0;
        var minMove = 0;
        
        nMoves = getAvailablePlays(gb, player);
        for (var n in nMoves) {
            nFlips = getFlips(n);
            if (nFlips.length < maxFlips) {
                minMove = n;
                maxFlips = nFlips.length;
            }
        }
        return minMove;
    }
    

   

    //this is for Iago as the max player 
    //run the root move from the calling function - this will allow comparison of best results for 
    //  each root move - this means we'll need to virtually update the gb after the first move, 
    //  and after any move called for here
    //update all move functions to accept actual or virtual gameboard
    function miniMax(gb,depth,player) {
        var nextMoves = [];
        nextMove = getAvailablePlays(gb, player); //need to add player (gb,player)
        var bestMove = 0;
        var newGB = [];
    //assessment of max or min - may need to change this for a-b pruning    
    //this simply extends the game tree down to the level for assessment 
    //we only need to return the move to be made
        if (depth > 1) {
            if (depth%2==0) { //get min
                for (var n in nextMoves) {
                    if (getMin(gb) < bestMove) {
                        bestMove = getMin(gb);
                    }
                }
            }
            else { //get max
                for (var n in nextMoves) {
                    if (getMin(gb) > bestMove) {
                        bestMove = getMax(gb);
                    }
                }
            }
                
            newGB = virtualMove(gb,bestMove);
            depth--;                    //next level
            player *= -1;               //switch players
            miniMax(newGB,depth,player); //call minimax on next level
        }
        //at depth - need to getMax value for each possible move
        //although we track the 
        else {  
            return getMax(gb);
        }
    }


    var newGame = document.getElementById("NewGame");
    newGame.onclick = function(){
        gameboard = [];
        setUpBoard(gameboard);
        player = player1;
        GAMEHISTORY = [];
    }

    var playPrev = document.getElementById("PreviousGame");
    playPrev.onclick = function(){
        counter = 0;
        gameboard = [];
        setUpBoard(gameboard);
        replayMove(GAMEHISTORY[0].id, GAMEHISTORY[0].player, GAMEHISTORY);
    }
    var p1Wins = document.getElementById("player1wins");
    var p2Wins = document.getElementById("player2wins");

    var counter = 0;
	var player1 = 1;
	var player2 = -1;
    var p1Score = 0;
    var p2Score = 0;

	p1Wins.innerHTML = p1Score;
    p2Wins.innerHTML = p2Score;

    var gameover = false;
    var player = player1;
	var gameboard =  [];
	setUpBoard(gameboard);
    var availablePlays = getAvailablePlays(gameboard, player);;
    var GAMEHISTORY = [];

}


window.onload = initializeGame();
