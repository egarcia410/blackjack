document.addEventListener("DOMContentLoaded", function(){
    
    // Variable - deckOfCards, dealer, and player
    var deckOfCards, dealer, player;

    // blackjack buttons - bet, rebet, chip, deal, hit, stand
    var bet = document.getElementById("bet-button");
    var rebet = document.getElementById("rebet-button");    
    var chip = document.getElementsByClassName("chip");    
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
        document.getElementById("dealer-points").innerHTML = dealer.points;                
        document.getElementById("player-points").innerHTML = player.points;        
        document.getElementById("bet-amount").innerHTML = player.bet;
        document.getElementById("bank-amount").innerHTML = player.bank;
        document.getElementById("wins").innerHTML = player.wins;
        // Create Betting Feature
        // document.getElementById("deal-button").style.display = "none";        
        document.getElementById("deal-button").style.display = "inline";        
        document.getElementById("new-button").style.display = "none";        
        document.getElementById("hit-button").style.display = "none";
        document.getElementById("stand-button").style.display = "none";
    };

    // Starts a new game without creating a new player
    function playAgain(){
        dealer = new Player("Dealer", "dealer-hand", "dealer-points");
        player.hand = [];
        document.getElementById("deal-button").style.display = "inline";        
        // document.getElementById("new-button").style.display = "inline";        
        document.getElementById("hit-button").style.display = "none";
        document.getElementById("stand-button").style.display = "none";
    };

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
        createNewGame();
        clearTable();        
    });
    
    // Receive value of chip when clicked on, update bank amount and betting amount
    // https://stackoverflow.com/questions/19655189/javascript-click-event-listener-on-class
    Array.from(chip).forEach(function(element){
        element.addEventListener("click", function(){
            chipValue = parseInt(element.value);
            currentBet = parseInt(document.getElementById("bet-amount").innerHTML);
            if (player.bank - chipValue >= 0){
                player.bank -= chipValue;
                document.getElementById("bank-amount").innerHTML = player.bank;
                document.getElementById("bet-amount").innerHTML = currentBet + chipValue;
            }
        });
    })

    // Deals two cards to each player and dealer when deal button is clicked
    deal.addEventListener("click", function(){
        // clears table from previous game played
        clearTable();
        for (var i = 0; i < 2; i++){
            // Adds  2 cards to player and dealer hand
            dealCard(player);
            dealCard(dealer);
        };
        // Can only deal once per game, disables deal button 
        document.getElementById("deal-button").style.display = 'none';
        // document.getElementById("new-button").style.display = 'none';
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
        // Display card on table
        image.className = "animated slideInLeft"
        image.src = `./static/img/cards/${card.rank}-of-${card.suit}.png`;
        document.getElementById(player.elementHand).appendChild(image);
        // Calcualte points from cards in hand
        calculatePoints(player);
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

        if (activePlayer.points > 21){
            message = `${activePlayer.name} Bust! ${opponent.name} Won! Deal Again?`;
            gameOver = true;
            if (activePlayer.name === "Dealer"){
                player.wins += 1; 
            }                                                               
        };

        if (!gameOver){
            // If activePlayer is You
            if (activePlayer.name === "You"){
                if (opponent.points >= 17 && activePlayer.points > opponent.points){
                    message = `${activePlayer.name} Won! Deal Again?`;                
                    gameOver = true;
                    player.wins += 1;
                };
            }
            // If activePlayer is the Dealer
            else if (activePlayer.name === "Dealer"){
                if (activePlayer.points === opponent.points){
                    message = `Draw! Deal Again?`;                   
                }
                else if (activePlayer.points > opponent.points){
                    message = `${activePlayer.name} Won! Deal Again?`;                
                }
                else if (activePlayer.points < opponent.points){
                    message = `${opponent.name} Won! Deal Again?`;
                    player.wins += 1;
                };
                gameOver = true;
            };
        };
        document.getElementById("wins").innerHTML = player.wins;            
        // Display message on table
        document.getElementById("messages").innerHTML = message;
        if (gameOver){
            playAgain();
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

