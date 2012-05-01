//initalize game and board
function initializeGame(){

    /*
    sets boards up for a new game
    binding board locations to table data elements from the DOM
    classNames are used to switch between pieces 'p1' for black, 'p-1' for white
    initially all pieces are blank except for the middle 4.
    using a 10x10 board makes identifying available moves and resulting flips easier, however makes
    for some tricky intialization and manipulation (not really)
    */
    function setUpBoard(){
        var e;
        for (var j = 11; j < 89; j++) {
            if ( (j%10 != 9) && (j%10 != 0) ) { //iterate only over valid board locations
                gameboard[j] = 0; //gameboard used for internal logic, strict -1s, 0s, 1s for white, empty, and black pieces
                board[j] = document.getElementById(j.toString()); //board used for display purposes and interacting with the user
                board[j].className = "";
                board[j].onclick = function() {
                    gameMove(this.id);
                }
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
            if ( (j%10 != 9) && (j%10 != 0) ) { //iterate only over valid board locations
                if (gameboard[j] == 0){
                    board[j].className = "";
                } else if (gameboard[j] == 1) {
                    board[j].className = "p1";
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
        var p1Plays = getAvailablePlays(gameboard, PLAYER1);
        var p2Plays = getAvailablePlays(gameboard, PLAYER2);

        if (allTilesFilled()){
            gameover = true;
            GameOver();
        } else if (p1Score == 0 || p2Score == 0){
            gameover = true;
            GameOver();
        } else  if (p1Plays.length == 0 && p2Plays.length == 0){
            gameover = true;
            GameOver();
        }
        
    }
    
    
    function GameOver(){
        //increment games played
        //increment winning PLAYERs victory total
        //store game board and history of moves
        if(p1Score > p2Score){
            p1Wins++;
            $('#notify').html("You Win!");
        } else if (p1Score < p2Score){
            p2Wins++;
            $('#notify').html("You Lost, better luck next time!")
        }
        displayP1Wins.html(p1Wins);
        displayP2Wins.html(p2Wins);
        console.log("Game Over");
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
    
    //function that is called when the user clicks a gameboard location
    function gameMove(id){

        //do nothing if gameover
        if (gameover || !YOURTURN){
            return;
        } 
        $("#notify").html("");
        YOURTURN = false; //no longer your turn

        if (contains(availablePlays, id)){
            GAMEHISTORY.push({'id':id, 'player':PLAYER1});
            uGB = gameboard.slice();
            executeMove(gameboard, id, PLAYER1);
            IagoPlays(PLAYER2);
        } else {
            YOURTURN = true;
            return;
        }        
    }

    //applies the specified move to the given gameboard assuming it is played by player 'p'
    //only works when given a valid move! is dependent upon the calling function filtering out invalid moves!
    function executeMove(gameboard, id, p){

        if (gameboard[id] == 0){
            gameboard[id]= p;
            var flips = getFlips(gameboard, id, p);
            for (var a in flips){ //flip all inbetween pieces
                gameboard[flips[a]] = p;
            }
        }
        //update the display with latest gameboard configuration
        getGameScore(gameboard);
        showBoard(gameboard);
    }

    function IagoPlays(p){
        LEVEL = $('input:radio[name=IagoLevel]:checked');
        LEVEL = parseInt(LEVEL.val(), 10);
      
        var nMoves = getAvailablePlays(gameboard, p);
        var bestMove = -1;
        var bestSum = -100;
        var cFLips;
        for (var m in nMoves) {
            var cSum = 0;
            cFlips = getFlips(gameboard, nMoves[m], p);
	    if (LEVEL == 1){
	        cSum = cFlips.length;
	    } else {
                cSum = cFlips.length - miniMax(nMoves[m], gameboard, p, 1, LEVEL);
	    }
            //add simple heuristic for corners
            if (nMoves[m] == 11 || nMoves[m] == 18 || nMoves[m] == 81 || nMoves[m] == 88){
                cSum += 10;
            }
            if (cSum > bestSum) {
                bestSum = cSum;
                bestMove = nMoves[m];
            }
        }

        if (bestMove === -1){
            $("#notify").html("Iago has no moves! Your turn");
            availablePlays = getAvailablePlays(gameboard, p*-1);
            checkGameOver(gameboard);
            YOURTURN = true;
            return;
        }
        GAMEHISTORY.push({'id':bestMove, 'player':p});
        setTimeout(function(){
            executeMove(gameboard, bestMove, p);
            availablePlays = getAvailablePlays(gameboard, p*-1);
            checkGameOver(gameboard);
    	    if(availablePlays.length == 0 && !gameover && p == PLAYER2){
    	        IagoPlays(p)	
    	    }
            YOURTURN = true;
        }, 1000);
    }


    function miniMax(cMove, cGB, cPlayer, cDepth, fDepth) {     
    // definitions:  
    // cMove = current Move, cGB = current gameboard, cPlayer = current PLAYER
    // cDepth = current depth, fDepth = final depth

    var cFlips = getFlips(cGB, cMove, cPlayer);
    if (cDepth == fDepth) {
        return cFlips.length;
    } else {
        cDepth++;
        var nGB = cGB.slice();
        nGB = virtualMove(nGB, cMove, cPlayer);
        var nMoves = getAvailablePlays(nGB, cPlayer*-1);
        if (nMoves == ""){
            return cFlips.length;
        }
        var bestSum;
        for (var m in nMoves) {
                var cSum = 0;
                cSum = cFlips.length - miniMax(nMoves[m], nGB, cPlayer*-1, cDepth, fDepth);
                
                //add simple heuristic for corners
                if (nMoves[m] == 11 || nMoves[m] == 18 || nMoves[m] == 81 || nMoves[m] == 88){
                    cSum += 10;
                }

                if (cSum > bestSum || !bestSum) {
                    bestSum = cSum;
                }
        }

        return bestSum;
        }
    }

    //virtual move used by minimax to simulate future gameboard configurations
    //could have used a modified executeMove, but this is easy enough
    function virtualMove(gb, id, p) {
        if (!gb[id]){
            gb[id]= p;
            var flips = getFlips(gb, id, p);
            for (var a in flips){
                gb[flips[a]] = p;
            }
        }
        return gb;
    }

    //iterates through the board counting each PLAYERs pieces
    //updates the display with the current score
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
        displayP1Score.html(p1Score);
        displayP2Score.html(p2Score);
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
                                if(!contains(moves, i)){
                                    moves.push(i); //store it
                                    // next line shows move options
                                    //gameboard[i].className = "pMove";
                                }
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

    //replays a game given a move, player, and the rest of the list of moves
    function replayMove(id, player, moves){
        counter++;
        console.log("replaying..." + counter + "moves length: " + moves.length)
        if (counter >= moves.length){
            executeMove(gameboard, id, player);
            console.log("finished replay")
            return;
        } else {
            executeMove(gameboard, id, player);
        }
        setTimeout(function() {replayMove(moves[counter].id, moves[counter].player, moves);}, 1000);
    }


    // Bind functions for the button features

    $("#NewGame").bind('click', function(){ 

        //initialize a new game
        gameboard = [];
        board = new Array();
        setUpBoard(); 
        GAMEHISTORY = [];
	    YOURTURN = true;
        gameover = false;
        gid = -1; // its a new game so we dont want to overwrite the previously loaded game.
        $("#notify").html(""); //erase any notifications
        availablePlays = getAvailablePlays(gameboard, PLAYER1);
    });

    $("#PreviousGame").bind('click', function(){
        counter = 0;
        gameboard = [];
        board = [];
        setUpBoard(gameboard);
        console.log("Gamehistory length: " + GAMEHISTORY.length);
        replayMove(GAMEHISTORY[0].id, GAMEHISTORY[0].player, GAMEHISTORY);
    });

    $('#SaveGame').bind('click', function(event) {
        //send an ajax request to the server to save the current game including gamehistory, gameboard, and score. 
        var req = $.ajax({
            type: 'POST',
            url : '/savegame',
            data: { 'gid': gid, //if we have loaded a game we want to overwrite the previously saved version.
                    'game' : JSON.stringify(GAMEHISTORY),
                    'gameboard': JSON.stringify(gameboard),
                    'p1score' : p1Score,
                    'p2score' : p2Score}

        });
        req.done(function (data) {
            console.log("game saved");
        });
    });

    $('#AskIago').bind('click', function(event){
        //if its our turn we can ask Iago for help, run minimax on our available plays and play the best one
        //use whatever depth is being used for iago.
        if (YOURTURN){
            uGB = gameboard.slice(); // make a copy of gameboard so we can undo this move
            IagoPlays(PLAYER1); //call minimax for player1
            YOURTURN = false; //no longer player1s turn
            setTimeout(function(){IagoPlays(PLAYER2)}, 1000); //let iago play after 1s
        }
    });

    $('#Undo').bind('click', function(event){
        while(GAMEHISTORY.pop().player !== 1){}; //pop all moves by iago off the gamehistory, including player1s last move

        gameboard = uGB.slice(); //set gameboard to our copy from before player 1s last move.
        showBoard(gameboard); //display the new gameboard
        $("#notify").html(""); //clear notification display in case something had been displayed
        
        //repopulate player1s available moves and make it their turn
        availablePlays = getAvailablePlays(gameboard, PLAYER1); 
        YOURTURN = true;
        gameover = false; //in case the move that was undone led to a gameover
    });
    
    //initialize various DOM hooks and necessary 'globals'
    var displayP1Score = $("#player1Score");
    var displayP2Score = $("#player2Score");
    var displayP1Wins = $("#player1Wins");
    var displayP2Wins = $('#player2Wins');

    var YOURTURN = true;
    var LEVEL;
    var counter = 0;
	var PLAYER1 = 1;
	var PLAYER2 = -1;
    var p1Score = 0;
    var p2Score = 0;
    var p1Wins = 0;
    var p2Wins = 0;

    displayP1Score.html(p1Score);
    displayP2Score.html(p2Score);
    displayP1Wins.html(p1Wins);
    displayP2Wins.html(p2Wins);

    var gid = -1;
    var gameover = false;
    var GAMEHISTORY;
    var gameboard =  []; //gameboard used for computation purposes
    var board = []; //board containing dom element hooks for updating the gameboard
    uGB = []; //undo gameboard, used for the undo/go back feature
    setUpBoard();

    //check if we are loading a game
    var loadgame = $('#loadgame').val(); 
    var loadgb = $('#gb').val(); 
    
    //yes its ugly but it works
    if (loadgame && loadgb){
        GAMEHISTORY = JSON.parse(loadgame); //parse the loaded gamehistory
        gameboard = JSON.parse(loadgb); //parse the loaded gameboard
        gid = parseInt($('#gid').val(), 10); //retrieve the gid for the loaded game so we can overwrite it later if need be
        
        //show the loaded board
        showBoard(gameboard);
    } else {
	   GAMEHISTORY = []; //set gamehistory to empty if we arent loading a game
    }

    //get player1s available moves and we are ready to roll
    var availablePlays = getAvailablePlays(gameboard, PLAYER1);

}


$(function(){
    //on window load initialize the game
    initializeGame();
});
