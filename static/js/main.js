document.addEventListener("DOMContentLoaded", function(){
    
    // Variable - deckOfCards, dealer, and player
    var deckOfCards, dealer, player;

    // blackjack buttons - deal, hit, stand
    var deal = document.getElementById("deal-button");
    var hit = document.getElementById("hit-button");
    var stand = document.getElementById("stand-button");
    
// ###################################
// ######### INITIALIZE GAME #########
// ###################################

    createNewGame();
    
    // Creates new blackjack game
    function createNewGame(){
        deckOfCards = [];
        dealer = new Player("Dealer", "dealer-hand", "dealer-points");
        player = new Player("You", "player-hand", "player-points" );
        deck = createNewDeck();
        shuffle(deck);
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
        // Enable hit and stand button
        document.getElementById("hit-button").style.display = 'inline';
        document.getElementById("stand-button").style.display = 'inline';
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
        // Add card to hand
        player.hand.push(card);
        // Display card on table
        image.src = `./static/img/cards/Set_B/small/${card.rank}-of-${card.suit}.png`;
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
        // If player busts
        let gameOver = false;
        if (activePlayer.points > 21){
            document.getElementById("messages").innerHTML = `${activePlayer.name} Bust!
                                                                ${opponent.name} Won!
                                                                Deal Again?`;
            gameOver = true;
        }
        // If activePlayer is the Dealer
        else if (activePlayer.name === "Dealer"){
            if (activePlayer.points === opponent.points){
                document.getElementById("messages").innerHTML = `Draw! Deal Again?`;                   
            }
            else if (activePlayer.points > opponent.points){
                document.getElementById("messages").innerHTML = `${activePlayer.name} Won! Deal Again?`;                
            }
            else if (activePlayer.points < opponent.points){
                document.getElementById("messages").innerHTML = `${opponent.name} Won! Deal Again?`;
            };
            gameOver = true;
        }

        if (gameOver){
            // Enable deal button
            document.getElementById("deal-button").style.display = "inline";
            // Disable hit and stand button
            document.getElementById("hit-button").style.display = "none";
            document.getElementById("stand-button").style.display = "none";
            createNewGame();
        }
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

