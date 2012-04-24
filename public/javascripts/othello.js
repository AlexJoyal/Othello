
//check for game over conditions


//initalize game and board
function initializeGame(){

    //sets boards up for a new game
    function setUpBoard(){
        var e;
        for (var j = 11; j < 89; j++) {
            if ( (j%10 != 9) && (j%10 != 0) ) { 
                gameboard[j] = 0;
                board[j] = document.getElementById(j.toString());
                board[j].className = "";
                board[j].onclick = function() {
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
    
    //takes the gameboard, and updates board to display changes to the user
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

    //returns true if game is over, false otherwise
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

        getGameScore(gameboard);

        if (allTilesFilled()){
            gameover = true;
            GameOver();
        } else if (p1Score == 0 || p2Score == 0){
            gameover = true;
            GameOver();
        }
        
    }
    
    
    function GameOver(){
        //increment games played
        //increment winning PLAYERs victory total
        //store game board and history of moves
        
        console.log("Game Over");
        //gamesPlayed++;

    }
    
    //function to determine if array holds a particular value (used to check if a move is in availablePlays)
    function contains(array, value){
        for (var a in array){
            if (array[a] == value){
                return true;
            }
        }
        return false;
    }
    
    function gameMove(id){
        //do nothing if gameover
        if (gameover){
            return;
        }
        //console.log("play: " + id + " : " + availablePlays);
        
        if (contains(availablePlays, id)){
            GAMEHISTORY.push({'id':id, 'player':PLAYER});
            executeMove(gameboard, id, PLAYER);
            showBoard(gameboard);
            IagoPlays(PLAYER);
        } else if (availablePlays.length == 0){
            PLAYER *= -1;
            IagoPlays(PLAYER);
        }
        //console.log("gameboard: " + gameboard)
        //availablePlays = getAvailablePlays(gameboard, PLAYER);
        //console.log(availablePlays)
        checkGameOver(gameboard);
        showBoard(gameboard);
        //PLAYER *= -1;
        
    }


    // it verifies that the id of the move is a valid board location
    function executeMove(gameboard, id, p){

        if (gameboard[id] == 0){
            gameboard[id]= p;
            var flips = getFlips(gameboard, id, p);
            for (var a in flips){
                gameboard[flips[a]] = p;
                //console.log(PLAYER);
            }
        }
        PLAYER *= -1;
        getGameScore(gameboard);
        showBoard(gameboard);
    }

    function IagoPlays(p){
        LEVEL = $('input:radio[name=IagoLevel]:checked');
        LEVEL = parseInt(LEVEL.val(), 10);
      
        var nMoves = getAvailablePlays(gameboard, p);
        //console.log(nMoves)
        var bestMove = 0;
        var bestSum = -100;
        for (var m in nMoves) {
            cSum = miniMax(nMoves[m], gameboard, p, 1, LEVEL);
            //console.log("cSum: " + cSum + " bestSum: " + bestSum)
            if (cSum > bestSum) {
                bestMove = nMoves[m];
                //console.log("BestMove: " + bestMove)
            }
        }
        


        /*var bestMove = getMax(gameboard);
        //console.log(bestMove);
        
        //L2 - choose best move for two plays later assuming opponent is infallible
        // attempt 1 - just add + - and generate a number
        //need to find max of min of max
        var L0Moves = [];
        var L0Ma = [];
        var L1Moves = [];
        var L1Ma = [];
        var pGB = [];
        L0Ma = getAvailablePlays(gameboard, PLAYER);
        //console.log(PLAYER);
        //console.log("L0Ma.length is " + L0Ma.length);
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
            plus = getFlips(pGB,L0Ma[i], PLAYER).length;
            //console.log("plus = " + plus);
            //call virtual move on possible gameboard - returns modified pGB
            executeMove(pGB, L0Ma[i], PLAYER);
            PLAYER *= -1;
            // need to test pGB
            //for (var i = 11; i <= 88; i++) {
            //    console.log("occ " + pGB[i]);
            //}
            
            //switch PLAYERs

            //get available moves for L1
            L1Ma = getAvailablePlays(pGB, PLAYER*-1);
            //iterate through available L1 moves
            for (var j = 0; j < L1Ma.length; j++){
                //flips at L1 are negative
                //console.log("L1Ma[j] = " + L1Ma[j]);
                minus = getFlips(pGB,L1Ma[j], PLAYER*-1).length;
                //console.log("minus = " + minus);
                moveSum = (plus - minus);
                //console.log("plus - minus = " + moveSum);
                if (moveSum > bestSum) {
                    bestSum = moveSum;
                    bestMove = L0Ma[i];
                }
            }
        }
        //console.log("bestMove is " + bestMove + " " + PLAYER);
        //executeMove(gameboard,bestMove, PLAYER);

        //endL2
        */
        if (bestMove === 0){
            console.log("Iago has no moves! Your turn")
            PLAYER *= -1;
            availablePlays = getAvailablePlays(gameboard, PLAYER);
            return;
        }
        GAMEHISTORY.push({'id':bestMove, 'player':PLAYER});
        setTimeout(function(){
            executeMove(gameboard, bestMove, PLAYER);
            availablePlays = getAvailablePlays(gameboard, PLAYER);
        }, 1000);
    }

    //iterates through the board counting each PLAYERs pieces
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
        p1Wins.html(p1Score);
        p2Wins.html(p2Score);
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
        for (var j = 0; j <= 7; j++) {
            var n = 1;
            if (gb[ ( move + locals[j] ) ] == (-1*player)) { //position adjacent to location is opp color (avoids hopping over a blank space)
                while (gb[ ( move + (n)*locals[j] ) ] == (-1*player)) {
                    n++; //iterate down the line - stop when --color  
                }
                if ((gb[ ( move + (n)*locals[j] ) ] ) == player) { //my piece at end of line - 
                    for (var p = 1; p < n; p++) { //starting at first not-my-piece until last not-my-piece
                        //store locations between my pieces
                        flips.push(move + p*locals[j]);
                    }
                }
            }   
        }
        return flips;
    }

    //broken
    function replayMove(id, player, moves){
        counter++;
        if (counter >= moves.length){
            executeMove(gameboard, id, PLAYER);
            return;
        } else {
            executeMove(gameboard, id, PLAYER);
        }
        //console.log(counter);
        setTimeout(function() {replayMove(moves[counter].id, moves[counter].player, moves);}, 1000);
    }

    
    

   

    function virtualMove(gb, id, p) {
        if (!gb[id]){
            gb[id]= p;
            var flips = getFlips(gb, id, p);
            for (var a in flips){
                gb[flips[a]] = p;
                //console.log(PLAYER);
            }
        }
        return gb;
    }
    
    
    function miniMax(cMove, cGB, cPlayer, cDepth, fDepth) {     
    // definitions:  
    // cMove = current Move, cGB = current gameboard, cPlayer = current PLAYER
    // cDepth = current depth, fDepth = final depth
    // at level 1 - passes in the actual gameboard
    // passes move - board not updated
    //var cFlips = [];
    //console.log(cMove);

    var cFlips = getFlips(cGB, cMove, cPlayer);
    
    if (cDepth == fDepth) {
        console.log("fDepth: " + fDepth)
        return cFlips.length;
    } else {
        cDepth++;
        var nGB = cGB.slice();
        nGB = virtualMove(nGB, cMove, cPlayer);
        var nMoves = getAvailablePlays(nGB, cPlayer);
        var nPlayer = cPlayer * -1;
        var bestSum = 0;
        for (var m in nMoves) {
            cSum = cFlips.length - miniMax(m, nGB, nPlayer, cDepth, fDepth);
            if (cSum > bestSum) {
                bestSum = cSum;
            }
        }
        console.log(cDepth)
        return bestSum;
        }
    }


    $("#NewGame").bind('click', function(){
        gameboard = [];
        board = new Array();
        setUpBoard(); 
        PLAYER = PLAYER1;
        GAMEHISTORY = [];
        gameover = false;
        availablePlays = getAvailablePlays(gameboard, PLAYER);
    });

    $("#PreviousGame").bind('click', function(){
        counter = 0;
        gameboard = [];
        board = [];
        setUpBoard(gameboard);
        replayMove(GAMEHISTORY[0].id, GAMEHISTORY[0].player, GAMEHISTORY);
    });

    $('#SaveGame').bind('click', function(event) {
        //implement me
        var req = $.ajax({
            type: 'POST',
            url : '/savegame',
            data: { 'uid': uid, 'game' : JSON.stringify(GAMEHISTORY)}
        });
        req.done(function (data) {
            console.log("game saved");
        });
    });

    var p1Wins = $("#player1wins");
    var p2Wins = $("#player2wins");
    var LEVEL;
    var counter = 0;
	var PLAYER1 = 1;
	var PLAYER2 = -1;
    var p1Score = 0;
    var p2Score = 0;

	p1Wins.html(p1Score);
    p2Wins.html(p2Score);

    var uid = 0;
    var gameover = false;
    var PLAYER = PLAYER1;
    var GAMEHISTORY;
    var gameboard =  [];
    var board = [];
    setUpBoard();

    var loadgame = $('#loadgame').val();
    if (loadgame){
        GAMEHISTORY = JSON.parse(loadgame);
        counter = 0;
        replayMove(GAMEHISTORY[0].id, GAMEHISTORY[0].player, GAMEHISTORY)
    } else {
	   GAMEHISTORY = [];
    }

    var availablePlays = getAvailablePlays(gameboard, PLAYER);

}


$(function(){
    initializeGame();
});
