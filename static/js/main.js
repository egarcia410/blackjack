suits = ['diamonds', 'clubs', 'hearts', 'spades'];
ranks = ['A', '2', '3', '4', '5', '6', 
            '7', '8', '9', '10', 'J', 'Q', 'K']
deckOfCards = [];

function card(value, rank, suit){
    this.value = value;
    this.rank = rank;
    this.suit = suit;
}
// Create deck of cards, 52 cards in a deck
for (suit in suits){
    for (rank in ranks){
        if (ranks[rank]=== "A"){
            deckOfCards.push(new card([1, 11], ranks[rank], suits[suit]));
        }
        else if (ranks[rank] === "J" || ranks[rank] === "Q" || ranks[rank]=== "K"){
            deckOfCards.push(new card(10, ranks[rank], suits[suit]));            
        }
        else {
            deckOfCards.push(new card(parseInt(rank, 10) + 1, ranks[rank], suits[suit]));
        }
    }
}
console.log(deckOfCards);

// blackjack buttons - deal, hit, stand
var deal = document.getElementById("deal-button");
var hit = document.getElementById("hit-button");

// Deals two cards to each player and dealer when deal button is clicked
deal.addEventListener("click", function(){
    for (var i = 0; i < 2; i++){
        var image = document.createElement("img");
        image.src = "./static/img/cards/Set_B/small/card_b_ck.png";
        document.getElementById("player-hand").appendChild(image); 
    };
    for (var i = 0; i < 2; i++){
        var image = document.createElement("img");
        image.src = "./static/img/cards/Set_B/small/card_b_ck.png";
        document.getElementById("dealer-hand").appendChild(image); 
    };
    // Can only deal once per game, disables deal button 
    document.getElementById("deal-button").disabled = true;
});

// Deals one card to the player when hit button is clicked
hit.addEventListener("click", function(){
    console.log(deckOfCards);
    var image = document.createElement("img");    
    image.src = "./static/img/cards/Set_B/small/card_b_ck.png";
    document.getElementById("player-hand").appendChild(image);   
});

