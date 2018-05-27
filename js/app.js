/*
 * Create a list that holds all of your cards
 */
const cards = [
	'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 
	'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 
	'fa-diamond', 'fa-bomb', 'fa-leaf', 'fa-bomb', 
	'fa-bolt', 'fa-bicycle', 'fa-paper-plane-o', 'fa-cube'];

let openedCards = [];
let moveCount = 0;
const congrats = document.querySelector(".congrats-msg");
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
gameInit();

function gameInit() {
	moveCount = 0;
	shuffle(cards);
	cardInit();
}

function cardInit() {
	let cardsSel = document.querySelectorAll(".card");	
	
	cardsSel.forEach(function(card, index){
		card.setAttribute("class", "card");
		card.innerHTML = "";
		let i = document.createElement('i');
		i.classList.add("fa", cards[index]);
		card.appendChild(i);
	});
	openedCards = [];
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Restart the game
const restartGame = document.querySelector(".restart");

restartGame.addEventListener('click', function(){
	gameInit();
});


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// const totalCardInList = openedCards.length;
const deck = document.querySelector(".deck");

// Set up the event listener for a card
deck.addEventListener('click', function(e){
	let currentCard = e.target;

	// make sure the click is on either <li> or <i>
	if (currentCard.classList.contains("deck") === false) {
		// set the currentCard to <li> if clicked on <i>
		if (currentCard.classList.contains("fa")) {
			currentCard = currentCard.parentElement;
		}
		// console.log(currentCard);
		// console.log(currentCard.classList);

		// Check if the clicked card is hidden
		if (currentCard.classList.contains("open") === false){
			displayCardSymbol(currentCard);
			addCardToOpenedList(currentCard);
			calMove();
			matchCards(currentCard, openedCards);		
		}

		// display a message with the final score if all cards have matched
		if (openedCards.length === 16) {
			congrats.classList.remove("hide");
		}		
	}	
});

function calMove() {
	moveCount++;
	console.log("moveCount: " + moveCount);
}

// Add card to the *list* of "open" cards
function addCardToOpenedList(el) {
	openedCards.push(el);
}

// Dsiplay the card's symbol
function displayCardSymbol(currentCard){
	currentCard.classList.add("open", "show");
}

// Cards matching logic
function matchCards(currentCard, openedCards) {
	let totalCardInList = openedCards.length;
	let cardToCompare = openedCards[totalCardInList-2];

	// console.log(cardToCompare.classList.contains("match"));
	//if the list already has another card (not a already matched one), check to see if the two cards match
	if ((totalCardInList > 1) && (cardToCompare.classList.contains("match") === false)) {
		let iconOfCurrentCard = currentCard.childNodes[0].classList.value;
		let iconOfCardToCompare = cardToCompare.childNodes[0].classList.value;
		
		if (iconOfCurrentCard === iconOfCardToCompare) {
			// cards match, lock the card in the open position
			// console.log("matched!");
			lockCard(currentCard);
			lockCard(openedCards[totalCardInList-2])
		} else {
			// cards do not match, remove the cards from the list and hide the card's symbol
			// console.log("not match");
			setTimeout(function(){
				hideCard(currentCard);
				hideCard(cardToCompare);
				openedCards.pop();
				openedCards.pop();
			}, 500);
		}	
	}
	console.log("totalCardInList: " + totalCardInList);
}

// lock the card in the open position
function lockCard(card) {
	card.classList.add("match");
}

// hide the card if not a match
function hideCard(card) {
	card.classList.remove("open", "show");
	// openedCards.pop();
}

const playAgain = document.querySelector(".play-again");

playAgain.addEventListener('click', function(){
	congrats.classList.add("hide");
	gameInit();
})