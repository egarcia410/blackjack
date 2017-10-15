document.addEventListener("DOMContentLoaded", function(){
    
    // Variables - dealerHand, playerHand, deckOfCards
    var deckOfCards, dealerHand, playerHand;

    createNewGame();

    // Creates new blackjack game
    function createNewGame(){
        deckOfCards = [];
        dealerHand = [];
        playerHand = [];
        deck = createNewDeck();
        shuffle(deck);
    };
    
    // Create New Deck of Cards
    function createNewDeck(){
        // Each card has an associated value, rank, and suit
        function card(value, rank, suit){
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
                    deckOfCards.push(new card(10, ranks[rank], suits[suit]));            
                }
                else {
                    deckOfCards.push(new card(parseInt(rank, 10) + 1, ranks[rank], suits[suit]));
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
    
    // blackjack buttons - deal, hit, stand
    var deal = document.getElementById("deal-button");
    var hit = document.getElementById("hit-button");
    var stand = document.getElementById("stand-button");
    
    // Deals two cards to each player and dealer when deal button is clicked
    function deal(){
        for (var i = 0; i < 2; i++){
            // Adds  2 cards to player hand
            dealCard(playerHand, "player-hand")
        };
        for (var i = 0; i < 2; i++){
            // Adds 2 cards to dealer hand
            dealCard(dealerHand, "dealer-hand")
        };
        // Total player and dealer points
        playerPoints = calculatePoints(playerHand);        
        dealerPoints = calculatePoints(dealerHand);
        // Display total points for player and dealer
        document.getElementById("player-points").innerHTML = playerPoints;
        document.getElementById("dealer-points").innerHTML = dealerPoints;
        // Can only deal once per game, disables deal button 
        document.getElementById("deal-button").disabled = true;
        // Enable hit and stand button
        document.getElementById("hit-button").disabled = false;
        document.getElementById("stand-button").disabled = false;
    };
    
    // Deals one card to the player when hit button is clicked
    hit.addEventListener("click", function(){
        console.log(playerHand, 'HIT BUTTON');
        // Adds card to player hand, and displays card on players table
        dealCard(playerHand, "player-hand")
        // Total player card values
        playerPoints = calculatePoints(playerHand);
        // Check if player went bust
        if (playerPoints > 21){
            isBust("You", "Dealer");
        }
    });

    // Adds card to either player or dealer hand
    function dealCard(hand, element){
        let image = document.createElement("img");          
        // Retrieve card from deckOfCards  
        let card = deckOfCards.pop();
        // Add card to hand
        hand.push(card);
        // Display card on table
        image.src = `./static/img/cards/Set_B/small/${card.rank}-of-${card.suit}.png`;
        document.getElementById(element).appendChild(image); 
    };
            
    // Handles point total for both player and dealer
    function calculatePoints(cards){
        // Create new array of cards in hand
        cards = cards.splice(0);
        // Sort cards value from highest to lowest
        cards.sort(function(a, b){
            return b.value - a.value;
        });
        // Calcute sum of cards in hand
        return cards.reduce(function(sum, card){
            if (card.rank === "A" && sum < 11){
                return sum + 11;
            };
            return sum + card.value;
        }, 0);
    };
    
    // If bust, display game over message, the winner, and
    // allow for new game to be played
    function isBust(player, opponent){
        document.getElementById("messages").innerHTML = `${player} Went Bust!
                                                         ${opponent} Won!
                                                         Deal Again?`;
        // Enable deal button
        document.getElementById("deal-button").disabled = false;
        // Disable hit and stand button
        document.getElementById("hit-button").disabled = true;
        document.getElementById("stand-button").disabled = true;
    };

}); //End of DOM

