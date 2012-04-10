
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
                gameboard[j] = 0;
                board[j] = document.getElementById(j.toString());
                board[j].className = "";
                board[j].onclick = function() {
                    //console.log(parseInt(this.id));
                    gameMove(this.id);
                }
                
                //TODO implement onmouseover - shows results of click
				//gameboard[j].onmouseover = showMove();
            }
        }

  	  		
        gameboard[44] = 1;
        gameboard[45] = -1;
        gameboard[54] = -1;
        gameboard[55] = 1;
        showBoard(gameboard);
    }
    
    function showBoard(gameboard){
        for (var j = 11; j < 89; j++) {
            if ( (j%10 != 9) && (j%10 != 0) ) { 
                if (gameboard[j] == 0){
                    board[j].className = "";
                } else if (gameboard[j] == 1) {
                    board[j].className = "p1";
                    //console.log(j);
                } else if (gameboard[j] == -1){
                    board[j].className = "p-1";
                }
            }
        } 
    }

    function checkGameOver(gameboard){

        //end state test - true when board is full
        function allTilesFilled() {
            for (var i = 11; i <= 88; i++) {
                if ( (i%10 != 9) && (i%10 != 0) ) { 
                    if (gameboard[i] == 0){
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
    
    function contains(array, value){
        for (var a in array){
            if (array[a] == value){
                return true;
            }
        }
        return false;
    }
    
    function gameMove(id){
        availablePlays = getAvailablePlays(gameboard, player);
        //console.log("player: " + player + " id: " + id);
        if (contains(availablePlays, id) && !gameover){
            GAMEHISTORY.push({'id':id, 'player':player});
            executeMove(id, player);
            showBoard(gameboard);
            //console.log(player);
			//Iago plays - 
            //this is functioning level 1 implementation - we may want to randomize when multiple best moves
			IagoPlays();
        } else if (availablePlays.length == 0){
            player *= -1;
            IagoPlays();
        }
        checkGameOver(gameboard);
        showBoard(gameboard);
        //L2 - choose best move for two plays later assuming opponent is infallible
        // attempt 1 - just add + - and generate a number
        /*need to find max of min of max
        var L0Moves = [];
        var L0Ma = [];
        var L1Moves = [];
        var L1Ma = [];
        var pGB = [];
        L0Ma = getAvailablePlays(gameboard);

        console.log("L0Ma.length is " + L0Ma.length);
        var bestMove = 0; // best move on board
        var moveSum = -100;
        var bestSum = -100 // sum is why it's the best move
        var plus = 0;
        var minus = 0;
        //iterate through available moves
        for (var i = 0; i < L0Ma.length; i++){
            //create gameboard copy for possible gameboard
            pGB = gameboard.slice();
            //flips at L0 are positive
            plus = getFlips(pGB,L0Ma[i]).length;
            console.log("plus = " + plus);
            //call virtual move on possible gameboard - returns modified pGB
            pGB = virtualMove(pGB, L0Ma[i], player);
            // need to test pGB
            for (var i = 11; i <= 88; i++) {
            console.log("occ " + pGB[i].className);
            }
            //get available moves for L1
            L1Moves = getAvailablePlays(pGB);
            //switch players
            for (var i = 11; i <= 88; i++) {
                if (L1Moves[i] == i) {
                L1Ma.push(i);
                //console.log("if i true i = " + i);
                }
            }   
            console.log("L1Ma.length is " + L1Ma.length);
            player *= -1;
            //iterate through available L1 moves
            for (var j = 0; j < L1Ma.length; j++){
                //flips at L1 are negative
                console.log("L1Ma[j] = " + L1Ma[j]);
                minus = getFlips(pGB,L1Ma[j]);
                console.log("minus = " + minus);
                moveSum = (plus - minus);
                //console.log("plus - minus = " + moveSum);
                if (moveSum > bestSum) {
                    bestSum = moveSum;
                    bestMove = L0Moves[i];
                }
            }
        }
        console.log("bestMove is " + bestMove);
        executeMove(bestMove);
        */
        //endL2 
    }

    // the if statement in here doesn't seem to be doing anything -- 
    // it verifies that the id of the move is a valid board location
    function executeMove(id, p){
        console.log("executing move for player: " + p + " move id: " + id);
        if (!gameboard[id]){
            gameboard[id]= p;
            var flips = getFlips(gameboard, id, p);
            console.log(flips)
            for (var a in flips){
                gameboard[flips[a]] = p;
                //console.log(player);
            }
        }
        player *= -1;
        getGameScore(gameboard);
        showBoard(gameboard);
    }

    function IagoPlays(){
        var bestMove = getMax(gameboard);
        //console.log(bestMove);
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
                if (gameboard[i] == 1){
                    p1Score++;
                }
                if (gameboard[i] == -1){
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
            if (gb[i] == 0) {   //location is empty
                for (var j = 0; j <= 7; j++) {
                    var n = 1;
                    if (gb[ (i + locals[j]) ] == (-1*player)) { //position adjacent to location is opp color
                        //console.log("second if");
                        while (gb[ (i + (n*locals[j])) ] == (-1*player)) {   //next square in line is opp color
                            //console.log("first while");
                            if (gb[ ( i + ( (n+1)*locals[j]) ) ] == player) { //next next square in is my color - viable move
                                moves.push(i); //store it
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
        //console.log("availablePlays: " + moves);    
        return moves;
    }


    // this has been modified to accept either the actual gameboard or the virtual gameboard
    function getFlips(gb, move, player) {   // accepts a move - returns flips for that move - useful for onMouseOver and onClick
 
        // move is the board location - an int
        var locals = [-11, -10, -9, -1, 1, 9, 10, 11];   //represents adjacent board locations
        var flips = [];   //stores board locations that will be flipped
        move = parseInt(move, 10);
        console.log("getting flips for player: " + player + " move: " + move);
        for (var j = 0; j <= 7; j++) {
            var n = 1;
            if (gb[ ( move + locals[j] ) ] == (-1*player)) { //position adjacent to location is opp color (avoids hopping over a blank space)
                console.log("first if");
                while (gb[ ( move + (n)*locals[j] ) ] == (-1*player)) {
                    n++; //iterate down the line - stop when --color  
                }
                if ((gb[ ( move + (n)*locals[j] ) ] ) == player) { //my piece at end of line - 
                    console.log("second if")
                    for (var p = 1; p < n; p++) { //starting at first not-my-piece until last not-my-piece
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
        //console.log(nMoves);
        for (var n in nMoves) {
            nFlips = getFlips(gb,nMoves[n], player);
            //console.log("move " + n + " has flips: " + nFlips);
            if (nFlips.length > maxFlips) {
                maxMove = nMoves[n];
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
    var board = [];
	setUpBoard(gameboard);
    var availablePlays = getAvailablePlays(gameboard, player);;
    var GAMEHISTORY = [];

}


window.onload = initializeGame();
