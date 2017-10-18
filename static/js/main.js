document.addEventListener("DOMContentLoaded", function(){

var deck;

// blackjack buttons - bet, rebet, chip, deal, hit, stand
var chip = document.getElementsByClassName("chipButton");    
var bet = document.getElementById("bet-button");
var rebet = document.getElementById("rebet-button");    
var deal = document.getElementById("deal-button");
var hit = document.getElementById("hit-button");
var stand = document.getElementById("stand-button");
var newGame = document.getElementById("new-button");

// ###########################
// ######### CLASSES #########
// ###########################

    // Create Person Class
    class Person {
        constructor (name){
            this.name = name;
            this.hand = [];
            this.points = 0;
            this.bet = 0;
            this.bank = 100;
            this.wins = 0;
        }

        // Calculates values of cards in hand
        calculateHand(){
            // Creates copy of hand array
            cards = this.hand.slice();
            // Sorts cards highest to lowerst value
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
            this.points = points;
            document.getElementById(`${this.name}-points`).innerHTML = points;
        }
    };

    // Create Card Class
    class Card {
        constructor (value, rank, suit){
            this.value = value;
            this.rank = rank;
            this.suit = suit;
        }

        getCardImageURL(){
            return `./static/img/cards/${this.rank}-of-${this.suit}.png`
        }
    };

    // Create Deck Class
    class Deck {
        constructor (){
            this.deckOfCards = [];
        }
        
        // Creates new deck of cards
        createNewDeck(){
            var suits = ['diamonds', 'clubs', 'hearts', 'spades'];
            var ranks = ['A', '2', '3', '4', '5', '6', 
                        '7', '8', '9', '10', 'J', 'Q', 'K']

            // Create deck of cards, 52 cards in a deck
            for (var i = 0; i < suits.length; i++){
                for(var j = 0; j < ranks.length; j++){
                    if (ranks[j] === "J" || ranks[j] === "Q" || ranks[j]=== "K"){
                        this.deckOfCards.push(new Card(10, ranks[j], suits[i]));            
                    }
                    else {
                        this.deckOfCards.push(new Card(j + 1, ranks[j], suits[i]));
                    };
                };
            };
        };

        // Shuffle deck of cards
        // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
        shuffle(){
            for (let i = this.deckOfCards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.deckOfCards[i], this.deckOfCards[j]] = [this.deckOfCards[j], this.deckOfCards[i]];
            };
        }

        dealCard(person){
            let image = document.createElement("img");          
            // Retrieve card from deckOfCards  
            let card = deck.deckOfCards.pop();
            // reshuffles deck if found empty
            if (deck.deckOfCards.length === 0){
                deck = deck.createNewDeck();
                shuffle();
            };
            // Add card to hand
            person.hand.push(card);
            image.className = "animated slideInLeft"
            // Hide Dealer's second card during initial deal
            if (person.name === 'Dealer' && person.hand.length === 2){
                image.id = "holeCard";
                image.src = `./static/img/decks/deck_4.png`;                
            }
            else {
                image.src = card.getCardImageURL();
                // Calculate points from cards in hand
                person.calculateHand();
            };
            // Display card on table
            document.getElementById(`${person.name}-hand`).appendChild(image);
        }
    };

    startNewGame();

// ###################################
// ########## BUTTON EVENTS ##########
// ###################################

    // Starts complete new game session
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
    });

    // Allows player to rebet, returns money to bank and set bet to zero
    rebet.addEventListener("click", function(){
        betAmount = parseInt(document.getElementById("bet-amount").innerHTML)
        bankAmount = parseInt(document.getElementById("bank-amount").innerHTML)
        document.getElementById("bet-amount").innerHTML = 0;
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
            deck.dealCard(player);
            deck.dealCard(dealer);
        };
        // Can only deal once per game, disables deal button 
        document.getElementById("deal-button").style.display = 'none';
        // Enable hit and stand button
        document.getElementById("hit-button").style.display = 'inline';
        document.getElementById("stand-button").style.display = 'inline';
        // gameResults();        
    });
    
    // Deals one card to the player when hit button is clicked
    hit.addEventListener("click", function(){
        deck.dealCard(person);
        gameResults();
    });

    // Start dealer's turn after stand button is clicked by player
    stand.addEventListener("click", function(){
        // Flip over deal's second card, hole card
        holeCard = document.getElementById("holeCard");
        holeCard.className = "animated flipInY";
        card = dealer.hand[1];
        holeCard.src = card.getCardImageURL(); 
        // Recalculate dealer's points
        dealer.calculatePoints();
        while (dealer.points < 17){
            deck.dealCard(dealer);
        };
        gameResults();
    });

// ###################################
// ###### GAME HELPER FUNCTIONS ######
// ###################################

    // Outcome between player and dealer
    function gameResults(currentPlayer){
        let message = "";
        let gameOver = false;

        // During player's turn
        if (currentPlayer === "Player"){
            if (player.points > 21){
                message = "You Bust!"
                gameOver = true;
            }
        }

        // During Dealer's turn
        else if (currentPlayer === "Dealer"){
            if (player.points === 21 && player.hand.length === 2 && dealer.points !== 21){
                message = "You Won! BLACKJACK!";
                player.bank = Math.round((player.bet * 1.5) + player.bet);
            }
            else if (dealer.points > 21) {
                message = "Dealer Bust!"
                player.wins += 1;
                player.bank = player.bet * 2; 
            }
            else if (player.points === dealer.points){
                message = "Draw!";
                player.bank += player.bet;                
            }
            else if (player.points > dealer.points){
                player.wins += 1;
                message = "You Won!";
                player.bank = player.bet * 2;                
            }
            else {
                message = "You Lost!";

            }
            gameOver = true;
        }

        document.getElementById("messages").innerHTML = message;
        if (gameOver){
            if (player.bank === 0){
                startNewGame();
            } else {
                playAgain();
            }
        }   
    };

    // Restarts with a new game in current player session
    function playAgain(){
        // Reset bet amount, player hand, player points, and new dealer
        player.hand = [];
        player.bet = 0;
        player.points = 0;
        dealer = new Person("Dealer");
        this.displayGameInfo();
        // Delay table being cleared
        setTimeout(function(){
            clearTable();
        }, 3000);          
    };

    // Displays game info and displays betting buttons
    function displayGameInfo(){
        // Game Stats
        document.getElementById("Dealer-points").innerHTML = dealer.points;                
        document.getElementById("Player-points").innerHTML = player.points;        
        document.getElementById("bet-amount").innerHTML = player.bet;
        document.getElementById("bank-amount").innerHTML = player.bank;
        document.getElementById("wins").innerHTML = player.wins;
        // Betting Buttons 
        document.getElementById("bettingButtons").style.display = "flex";                
        document.getElementById("deal-button").style.display = "none";        
        document.getElementById("hit-button").style.display = "none";
        document.getElementById("stand-button").style.display = "none";
        document.getElementById("new-button").style.display = "none"; 
    };

    // Clears table of cards from dealer and player
    function clearTable(){
        playerNode = document.getElementById("Player-hand");
        dealerNode = document.getElementById("Dealer-hand");
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
        
    // Start a complete new game session
    function startNewGame(){
        player = new Person("Player");
        dealer = new Person("Dealer");
        deck = new Deck();
        deck.createNewDeck();
        deck.shuffle();
        displayGameInfo();
    };

}) // End of DOM