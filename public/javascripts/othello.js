
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
        console.log("checking game over...")
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
    
    function gameMove(id){

        //do nothing if gameover
        if (gameover || !YOURTURN){
            return;
        } 
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
	
        //console.log("User played")
        
        //checkGameOver(gameboard);
    }


    // it verifies that the id of the move is a valid board location
    function executeMove(gameboard, id, p){

        if (gameboard[id] == 0){
            //GAMEHISTORY.push({'id': id, player: p})
            gameboard[id]= p;
            var flips = getFlips(gameboard, id, p);
            for (var a in flips){
                gameboard[flips[a]] = p;
                //console.log(PLAYER);
            }
        }
        //PLAYER *= -1;
        getGameScore(gameboard);
        showBoard(gameboard);
    }

    function IagoPlays(p){
        LEVEL = $('input:radio[name=IagoLevel]:checked');
        LEVEL = parseInt(LEVEL.val(), 10);
      
        var nMoves = getAvailablePlays(gameboard, p);
        //console.log(nMoves)
        var bestMove = -1;
        var bestSum = -100;
        for (var m in nMoves) {
            cSum = miniMax(nMoves[m], gameboard, p, 1, LEVEL);
            //console.log("cSum: " + cSum + " bestSum: " + bestSum)
            if (cSum > bestSum) {
                bestSum = cSum;
                bestMove = nMoves[m];
                //console.log("BestMove: " + bestMove)
            }
        }

        if (bestMove === -1){
            console.log("Iago has no moves! Your turn")
            //PLAYER *= -1;
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
    // at level 1 - passes in the actual gameboard
    // passes move - board not updated
    //var cFlips = [];
    //console.log(cMove);

    var cFlips = getFlips(cGB, cMove, cPlayer);

    if (cDepth == fDepth) {
        return cFlips.length;
    } else {
        //console.log("going deeper..." + cDepth)
        cDepth++;
        var nGB = cGB.slice();
        nGB = virtualMove(nGB, cMove, cPlayer);
        var nMoves = getAvailablePlays(nGB, cPlayer);
        var nPlayer = cPlayer * -1;
        var bestSum = 0;
        for (var m in nMoves) {
            //cFlips = getFlips(cGB, m, cPlayer);
            cSum = cFlips.length - miniMax(m, nGB, nPlayer, cDepth, fDepth);
            if (cSum > bestSum) {
                bestSum = cSum;
            }
        }
        return bestSum;
        }
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

    //replays a game given a move, player, and the rest of the list of moves
    function replayMove(id, player, moves){
        counter++;
        console.log("replaying..." + counter + "moves length: " + moves.length)
        if (counter >= moves.length){
            executeMove(gameboard, id, player);
            console.log("finished")
            return;
        } else {
            executeMove(gameboard, id, player);
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


    $("#NewGame").bind('click', function(){
        gameboard = [];
        board = new Array();
        setUpBoard(); 
        PLAYER = PLAYER1;
	    YOURTURN = true;
        GAMEHISTORY = [];
        gameover = false;
        gid = -1;
        $("#notify").html("");
        availablePlays = getAvailablePlays(gameboard, PLAYER);
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
        //implement me
        var req = $.ajax({
            type: 'POST',
            url : '/savegame',
            data: { 'gid': gid, 
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
        if (YOURTURN){
            IagoPlays(PLAYER1);
            uGB = gameboard.slice();
            YOURTURN = false;
            setTimeout(function(){IagoPlays(PLAYER2)}, 1000);
        }
    });

    $('#Undo').bind('click', function(event){
        while(GAMEHISTORY.pop().player !== 1){}; 
        //console.log(GAMEHISTORY)
        //console.log(uGB)
        gameboard = uGB.slice();
        showBoard(gameboard);
        $("#notify").html("");
        availablePlays = getAvailablePlays(gameboard, PLAYER1);
        YOURTURN = true;
        gameover = false;
    });

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
    var PLAYER = PLAYER1;
    var GAMEHISTORY;
    var gameboard =  [];
    var board = [];
    uGB = [];
    setUpBoard();

    var loadgame = $('#loadgame').val();
    var loadgb = $('#gb').val();
    if (loadgame){
        GAMEHISTORY = JSON.parse(loadgame);
        gameboard = JSON.parse(loadgb);
        //console.log(gameboard);
        gid = parseInt($('#gid').val(), 10);
        showBoard(gameboard);
        availablePlays = getAvailablePlays(gameboard, PLAYER1);
        //console.log("GAMEHISTORY length: " + GAMEHISTORY.length )
        //counter = 0;
        //replayMove(GAMEHISTORY[0].id, GAMEHISTORY[0].player, GAMEHISTORY)
    } else {
	   GAMEHISTORY = [];
    }

    var availablePlays = getAvailablePlays(gameboard, PLAYER);

}


$(function(){
    initializeGame();
});
