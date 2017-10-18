document.addEventListener("DOMContentloaded", function(){

// ###########################
// ######### CLASSES #########
// ###########################

    // Create Person Class
    class Person {
        constructor (name){
            this.name = name;
            this.hand = [];
            this.points = 0;
            this.bets = 0;
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
        }

        // Shuffle deck of cards
        // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
        shuffle(){
            a = this.deckOfCards;
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            };
        }

        dealCard(person){
            let image = document.createElement("img");          
            // Retrieve card from deckOfCards  
            let card = deckOfCards.pop();
            // reshuffles deck if found empty
            if (deckOfCards.length === 0){
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

        if (gameOver){
            document.getElementById("messages").innerHTML = message;
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
        document.getElementById("dealer-points").innerHTML = dealer.points;                
        document.getElementById("player-points").innerHTML = player.points;        
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