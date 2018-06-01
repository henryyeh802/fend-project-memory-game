/*
 * Create a list that holds all of the card symbols
 */
const cards = [
	'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 
	'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 
	'fa-diamond', 'fa-bomb', 'fa-leaf', 'fa-bomb', 
	'fa-bolt', 'fa-bicycle', 'fa-paper-plane-o', 'fa-cube'];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
let openedCards;
let moveCount;
let timeStarted;

gameInit();

// Game initialization
function gameInit() {
	openedCards = [];
	moveCount = 0;
	timeStarted = false;
	setTimer(0);
	displayMoves(moveCount);
	resetStars();
	shuffle(cards);
	cardInit();
}

// Set cards to initial state
function cardInit() {
	const deck = document.querySelector(".deck");
	const cardAmount = 16;
	deck.innerHTML = "";
	for (let i = 0; i < cardAmount; i++) {
		let li = document.createElement('li');
		li.setAttribute("class", "card");
		deck.appendChild(li);
	}
	const cardsSel = document.querySelectorAll(".card");	
	cardsSel.forEach(function(card, index){
		let i = document.createElement('i');
		i.classList.add("fa", cards[index]);
		card.appendChild(i);
	});
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Timer Initialization
function setTimer(time) {
	const timer = document.querySelector(".timer");
	timer.innerHTML = "Time: " + time;
}

let intervId;

// Timer increment start
function timerStart() {
	let time = 0;
	intervId = setInterval(function() {
		time++;
		setTimer(time);
	}, 1000);
}

// Timer Stop
function timerStop() {
	clearInterval(intervId);
}

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

const congrats = document.querySelector(".congrats-msg");
const deck = document.querySelector(".deck");

// Set up the event listener for a card
deck.addEventListener('click', function(e){
	let currentCard = e.target;

	// make sure the click is on either <li> or <i>
	if (currentCard.classList.contains("deck") === false) {
		if (timeStarted === false) {
			timerStart();
			timeStarted = true;
		}		
		// set the currentCard to <li> if clicked on <i>
		if (currentCard.classList.contains("fa")) {
			currentCard = currentCard.parentElement;
		}

		// Do cards matching if the clicked card is hidden
		if (currentCard.classList.contains("open") === false){
			displayCardSymbol(currentCard);
			addCardToOpenedList(currentCard);
			calStars(calMove());
			matchCards(currentCard, openedCards);
		}

		// display a message with the final score if all cards have matched
		if (openedCards.length === 16) {
			congrats.classList.add("show-congrats");
			timerStop();
		}		
	}	
});

// play again after finished the game
const playAgain = document.querySelector(".play-again");

playAgain.addEventListener('click', function(){
	congrats.classList.remove("show-congrats");
	gameInit();
})

// Restart the game
const restartGame = document.querySelector(".restart");

restartGame.addEventListener('click', function(){
	timerStop();
	gameInit();
});

// display stars based on current moveCount
function calStars(moveCount) {
	if (moveCount > 20 && moveCount < 40) {
		// 2 stars
		const firstStar = document.querySelector('.stars li i');
		const starCongrats = document.querySelector(".star-congrats");
		firstStar.setAttribute("class", "fa fa-star-o");
		starCongrats.innerHTML = "2";
	} else if (moveCount >= 40) {
		// 1 star
		const secondStar = document.querySelector('.stars li:nth-child(2) i');
		const starCongrats = document.querySelector(".star-congrats");
		secondStar.setAttribute("class", "fa fa-star-o");
		starCongrats.innerHTML = "1";
	}
}

// Reset the Stars to 3
function resetStars() {
	const stars = document.querySelectorAll('.stars li i');
	const starCongrats = document.querySelector(".star-congrats");

	stars.forEach(function(star) {
		star.setAttribute("class", "fa fa-star");
	})
	starCongrats.innerHTML = "3";
}

// increment the move counter and display it on the page
function calMove() {
	moveCount++;
	displayMoves(moveCount);
	return moveCount;
}

// Display current Moves
function displayMoves(moveCount) {
	let moves = document.querySelectorAll(".moves");

	moves.forEach(function(move){
		move.innerHTML = moveCount + " Moves";
	})
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

	//if the list already has another card (not a already matched one), check to see if the two cards match
	if ((totalCardInList > 1) && (cardToCompare.classList.contains("match") === false)) {
		let iconOfCurrentCard = currentCard.childNodes[0].classList.value;
		let iconOfCardToCompare = cardToCompare.childNodes[0].classList.value;
		deckNotClickable();
		
		// cards match, play animate and lock the card in the open position
		if (iconOfCurrentCard === iconOfCardToCompare) {
			lockCard(currentCard);
			lockCard(cardToCompare)
			matchAnimate(currentCard, cardToCompare);
			setTimeout(function() {
				lockCard(currentCard);
				lockCard(cardToCompare);
				deckClickable();
			}, 500);
		} else {
			// cards do not match, play animation then remove the cards from the list and hide the card's symbol
			unmatchAnimate(currentCard, cardToCompare);
			setTimeout(function(){
				hideCard(currentCard);
				hideCard(cardToCompare);
				openedCards.pop();
				openedCards.pop();
				deckClickable();
			}, 500);
		}
	}
}

function deckNotClickable() {
	deck.classList.add("not-clickable");
}

function deckClickable() {
	deck.classList.remove("not-clickable");
}

// play animate if cards match
function matchAnimate(cardOne, cardTwo) {
	cardOne.classList.add("animated", "infinite", "jello");
	cardTwo.classList.add("animated", "infinite", "jello");
}

// play animate if cards not match
function unmatchAnimate(cardOne, cardTwo) {
	cardOne.classList.add("unmatch-animate", "animated", "infinite", "wobble");
	cardTwo.classList.add("unmatch-animate", "animated", "infinite", "wobble");
}

// lock the card in the open position
function lockCard(card) {
	card.setAttribute("class", "card open show match");
}

// hide the card if not a match
function hideCard(card) {
	card.setAttribute("class", "card");
}