document.addEventListener("DOMContentLoaded", function(){
    
    // Variable - deckOfCards, dealer, and player
    var deckOfCards, dealer, player;

    // blackjack buttons - bet, rebet, chip, deal, hit, stand
    var bet = document.getElementById("bet-button");
    var rebet = document.getElementById("rebet-button");    
    var chip = document.getElementsByClassName("chipButton");    
    var deal = document.getElementById("deal-button");
    var newGame = document.getElementById("new-button");
    var hit = document.getElementById("hit-button");
    var stand = document.getElementById("stand-button");
    
// ###################################
// ######### INITIALIZE GAME #########
// ###################################

    createNewGame();
    
    // Creates whole new blackjack game with new player
    function createNewGame(){
        deckOfCards = [];
        dealer = new Player("Dealer", "dealer-hand", "dealer-points");
        player = new Player("You", "player-hand", "player-points" );
        deck = createNewDeck();
        shuffle(deck);
        displayGameInfo();     
    };
    
    // Starts a new game without creating a new player
    function playAgain(){
        document.getElementById("hit-button").style.display = "none";
        document.getElementById("stand-button").style.display = "none";
        dealer = new Player("Dealer", "dealer-hand", "dealer-points");
        // Reset bet amount, player hand, and points
        player.bet = 0;
        player.hand = [];
        player.points = 0;
        setTimeout(function(){
            // clears table from previous game played
            displayGameInfo();
            clearTable();
        }, 3000);
    };
    
    // Displays game information about dealer and player
    function displayGameInfo(){
        // Display game info
        document.getElementById("dealer-points").innerHTML = dealer.points;                
        document.getElementById("player-points").innerHTML = player.points;        
        document.getElementById("bet-amount").innerHTML = player.bet;
        document.getElementById("bank-amount").innerHTML = player.bank;
        document.getElementById("wins").innerHTML = player.wins;
        // Hide buttons
        document.getElementById("bettingButtons").style.display = "flex";                
        document.getElementById("deal-button").style.display = "none";        
        document.getElementById("hit-button").style.display = "none";
        document.getElementById("stand-button").style.display = "none";
        document.getElementById("new-button").style.display = "none";   
    }

    // Create a player base model for dealer and player
    function Player(name, elementHand, elementPoints){
        this.name = name;
        this.elementHand = elementHand;
        this.elementPoints = elementPoints;
        this.hand = [];
        this.points = 0;
        this.bank = 100;
        this.bet = 0;
        this.wins = 0
    };
    
    // Create New Deck of Cards
    function createNewDeck(){
        // Each card has an associated value, rank, and suit
        function Card(value, rank, suit){
            this.value = value;
            this.rank = rank;
            this.suit = suit;
        };
        
        // Suit and Rank types
        var suits = ['diamonds', 'clubs', 'hearts', 'spades'];
        var ranks = ['A', '2', '3', '4', '5', '6', 
                    '7', '8', '9', '10', 'J', 'Q', 'K']
    
        // Create deck of cards, 52 cards in a deck
        for (suit in suits){
            for (rank in ranks){
                if (ranks[rank] === "J" || ranks[rank] === "Q" || ranks[rank]=== "K"){
                    deckOfCards.push(new Card(10, ranks[rank], suits[suit]));            
                }
                else {
                    deckOfCards.push(new Card(parseInt(rank, 10) + 1, ranks[rank], suits[suit]));
                };
            };
        };
        return deckOfCards;
    };
    
    // Shuffle deckOfCards
    // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        };
    };
    
// ###################################
// ########## BUTTON EVENTS ##########
// ###################################

    // Resets player and dealer stats, starts whole new game
    // Add this feature when player reaches 0 bank amount
    newGame.addEventListener("click", function(){
        clearTable();        
        createNewGame();
    });

    // Set bet of player
    bet.addEventListener("click", function(){
        betAmount = parseInt(document.getElementById("bet-amount").innerHTML);
        bankAmount = parseInt(document.getElementById("bank-amount").innerHTML);
        player.bet = betAmount;
        player.bank = bankAmount;
        document.getElementById("bettingButtons").style.display = "none";
        document.getElementById("deal-button").style.display = "inline";        
        document.getElementById("hit-button").style.display = "none";
        document.getElementById("stand-button").style.display = "none";      
    });

    // Allows player to rebet, returns money to bank and set bet to zero
    rebet.addEventListener("click", function(){
        betAmount = parseInt(document.getElementById("bet-amount").innerHTML)
        document.getElementById("bet-amount").innerHTML = 0;
        player.bet = 0;
        bankAmount = parseInt(document.getElementById("bank-amount").innerHTML)
        document.getElementById("bank-amount").innerHTML = bankAmount + betAmount;
        player.bank = bankAmount + betAmount
    });
    
    // Receive value of chip when clicked on, update bank amount and betting amount
    // https://stackoverflow.com/questions/19655189/javascript-click-event-listener-on-class
    Array.from(chip).forEach(function(element){
        element.addEventListener("click", function(){
            chipValue = parseInt(element.value);
            betAmount = parseInt(document.getElementById("bet-amount").innerHTML);
            if (player.bank - chipValue >= 0){
                player.bank -= chipValue;
                document.getElementById("bank-amount").innerHTML = player.bank;
                document.getElementById("bet-amount").innerHTML = betAmount + chipValue;
            }
        });
    })

    // Deals two cards to each player and dealer when deal button is clicked
    deal.addEventListener("click", function(){
        for (var i = 0; i < 2; i++){
            // Adds  2 cards to player and dealer hand
            dealCard(player);
            dealCard(dealer);
        };
        // Can only deal once per game, disables deal button 
        document.getElementById("deal-button").style.display = 'none';
        // Enable hit and stand button
        document.getElementById("hit-button").style.display = 'inline';
        document.getElementById("stand-button").style.display = 'inline';
        gameStatus(player, dealer);        
    });
    
    // Deals one card to the player when hit button is clicked
    hit.addEventListener("click", function(){
        // Adds card to player hand, and displays card on players table
        dealCard(player)
        // Check if player went bust, exceeded 21 points
        gameStatus(player, dealer);
    });

    // Start dealer's turn after stand button is clicked by player
    stand.addEventListener("click", function(){
        // Flip over deal's second card, hole card
        holeCard = document.getElementById("holeCard");
        holeCard.className = "animated flipInY";
        card = dealer.hand[1];
        holeCard.src = `./static/img/cards/${card.rank}-of-${card.suit}.png`; 
        // Recalculate dealer's points
        calculatePoints(dealer);
        while (dealer.points < 17){
            dealCard(dealer);
        };
        gameStatus(dealer, player);
    });

// ###################################
// ###### GAME HELPER FUNCTIONS ######
// ###################################

    // Adds card to either player or dealer hand
    function dealCard(player){
        let image = document.createElement("img");          
        // Retrieve card from deckOfCards  
        let card = deckOfCards.pop();
        // reshuffles deck if found empty
        if (deckOfCards.length === 0){
            deck = createNewDeck();
            shuffle(deck);
        };
        // Add card to hand
        player.hand.push(card);
        image.className = "animated slideInLeft"
        // Hide Dealer's second card during initial deal
        if (player.name === 'Dealer' && player.hand.length === 2){
            image.id = "holeCard";
            image.src = `./static/img/decks/deck_4.png`;                
        }
        else {
            image.src = `./static/img/cards/${card.rank}-of-${card.suit}.png`;
            // Calcualte points from cards in hand
            calculatePoints(player);
        };
        // Display card on table
        document.getElementById(player.elementHand).appendChild(image);
    };
            
    // Handles point total for both player and dealer
    function calculatePoints(player){
        // Create new array of cards in hand
        cards = player.hand.slice(0);
        // Sort cards value from highest to lowest
        cards.sort(function(a, b){
            return b.value - a.value;
        });
        // Calcute sum of cards in hand
        points = cards.reduce(function(sum, card){
            if (card.rank === "A" && sum < 11){
                return sum + 11;
            };
            return sum + card.value;
        }, 0);
        player.points = points;
        document.getElementById(player.elementPoints).innerHTML = points;
    };
    
    // If Game Over, display game over message, the winner, and
    // allow for new game to be played
    function gameStatus(activePlayer, opponent){
        let gameOver = false;
        let message = "";
        let gameWon = "";

        if (activePlayer.points > 21){
            message = `${activePlayer.name} Bust! ${opponent.name} Won!`;
            gameOver = true;
            if (activePlayer.name === "Dealer"){
                player.wins += 1;
                gameWon = "won";
            }                                                               
        };

        if (!gameOver){
            // If activePlayer is You
            if (activePlayer.name === "You"){
                if (opponent.points >= 17 && activePlayer.points > opponent.points){
                    message = `${activePlayer.name} Won!`;                
                    gameOver = true;
                    player.wins += 1;
                    gameWon = "won";
                };
            }
            // If activePlayer is the Dealer
            else if (activePlayer.name === "Dealer"){
                if (opponent.points === 21 && opponent.hand.length === 2 && activePlayer.points !== 21){
                    message = `${opponent.name} Won! BLACKJACK!`
                    gameWon = "blackjack";
                }
                else if (activePlayer.points === opponent.points){
                    message = `Push!`;
                    gameWon = "draw";
                }
                else if (activePlayer.points > opponent.points){
                    message = `${activePlayer.name} Won!`; 
                }
                else if (activePlayer.points < opponent.points){
                    message = `${opponent.name} Won!`;
                    player.wins += 1;
                    gameWon = "won";
                };
                gameOver = true;
            };
        };
        document.getElementById("wins").innerHTML = player.wins;            
        // Display message on table
        document.getElementById("messages").innerHTML = message;
        if (gameOver){
            // Set player winnings
            if (gameWon === "won"){
                betWinnings = player.bet * 2;
                player.bank += betWinnings; 
            }
            else if (gameWon === "blackjack"){
                betWinnings = (player.bet * 1.5) + player.bet;
                player.bank += betWinnings; 
            }
            else if (gameWon === "draw"){
                betWinnings = player.bet;
                player.bank += betWinnings;
            }
            // If player is broke after losing last hand
            if (player.bank === 0){
                // Hide buttons
                document.getElementById("new-button").style.display = "flex";   
                document.getElementById("bettingButtons").style.display = "none";                
                document.getElementById("deal-button").style.display = "none";        
                document.getElementById("hit-button").style.display = "none";
                document.getElementById("stand-button").style.display = "none";
            }
            else {
                playAgain();
            }
        };
    };

    // Clears table of cards from dealer and player
    function clearTable(){
        playerNode = document.getElementById("player-hand");
        dealerNode = document.getElementById("dealer-hand");
        if (playerNode.hasChildNodes()){
            while (playerNode.firstChild){
                playerNode.removeChild(playerNode.firstChild);
            };
            while (dealerNode.firstChild){
                dealerNode.removeChild(dealerNode.firstChild);
            };
        };
        document.getElementById("messages").innerHTML = "";        
    };

}); //End of DOM

