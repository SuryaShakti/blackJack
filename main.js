let blackJackGame = {
    'you': { 'scorespan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scorespan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'card': [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12'
    ],

    'cardsMap': {
        '0': 10,
        '1': [1, 11],
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
        '11': 10,
        '12': 10
    },
    'wins': 0,
    'draws': 0,
    'losses': 0,
    'isStand': false,
    'turnsOver': false,


};

var YOU = blackJackGame['you'];
var DEALER = blackJackGame['dealer'];
const hitSound = new Audio('sounds/hit.mp3');
const winSound = new Audio('sounds/win.mp3');
const lossSound = new Audio('sounds/loss.mp3');

document.querySelector('#hit-button').addEventListener('click', hitButton);



function hitButton() {
    if (blackJackGame['isStand'] === false) {
        let card = randCard();
        console.log(card);
        showCard(card, YOU);
        currentScore(card, YOU);
        showScore(YOU);
    } else {
        alert("you can't hit after you click stand!!!!");
    }
}

function randCard() {
    let randIndex = Math.floor(Math.random() * 13);
    return blackJackGame['card'][randIndex];

}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        var cardImage = document.createElement('img');
        // cardImage.src = `images/${card}.png `;
        cardImage.src = "images/" + card + ".png";
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }

}

document.querySelector('#deal-button').addEventListener('click', dealButton);

function dealButton() {
    if (blackJackGame['turnsOver'] === true) {
        let show = "Lets paly";
        let yourimages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerimages = document.querySelector('#dealer-box').querySelectorAll('img');

        for (let i = 0; i < yourimages.length; i++) {
            yourimages[i].remove();
        }

        for (let i = 0; i < dealerimages.length; i++) {
            dealerimages[i].remove();
        }


        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').style.color = 'white';
        document.querySelector('#blackjack-result').textContent = "Let's Play ";
        document.querySelector('#blackjack-result').style.color = 'white';

        blackJackGame['isStand'] = false;
    } else { alert('Not all the turns are over yet'); }
}

function currentScore(card, activePlayer) {
    //checking a = 1 or 11
    console.log('A', blackJackGame['cardsMap'][card][1]);
    if (card === '1') {
        if (activePlayer['score'] + blackJackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += 11;
        } else {
            activePlayer['score'] += 1;
        }
    } else {

        activePlayer['score'] += blackJackGame['cardsMap'][card];
        console.log(activePlayer['score']);
    }
}

function showScore(activePlayer) {

    if (activePlayer['score'] > 21) {
        //  document.getElementById("your-blackjack-result").innerHTML = "BUST!";
        document.querySelector(activePlayer['scorespan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scorespan']).style.color = 'red';

    } else {
        //document.getElementById("your-blackjack-result").innerHTML = activePlayer['score'];


        document.querySelector(activePlayer['scorespan']).textContent = activePlayer['score'];
    }
}


document.querySelector('#stand-button').addEventListener('click', dealerLogic);


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function dealerLogic() {
    blackJackGame['isStand'] = true;

    while (DEALER['score'] < 16 && blackJackGame['isStand'] === true) {
        let card = randCard();
        showCard(card, DEALER);
        currentScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }

    blackJackGame['turnsOver'] = true;

    let winner = gamewinner();
    showResult(winner);

}



//deciding the winner of the game
function gamewinner() {
    let winner;
    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            blackJackGame['wins']++;
            winner = YOU;
        } else if (YOU['score'] < DEALER['score']) {
            blackJackGame['losses']++;
            winner = DEALER;
        } else if (YOU['score'] === DEALER['score']) {
            blackJackGame['draws']++;
        }
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackJackGame['losses']++;
        winner = DEALER;
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackJackGame['draws']++;
    }

    console.log('winner is', winner);
    return winner;
}

function showResult(winner) {
    let message, messageColor;
    if (winner === YOU) {
        document.querySelector('#wins-number').textContent = blackJackGame['wins'];
        message = 'YOU WON';
        messageColor = 'green';
        winSound.play();
    } else if (winner === DEALER) {
        document.querySelector('#loses-number').textContent = blackJackGame['losses'];
        message = 'YOU LOST';
        messageColor = 'red';
        lossSound.play();
    } else {
        document.querySelector('#draws-number').textContent = blackJackGame['draws'];
        message = 'YOU DREW';
        messageColor = 'yellow';
    }

    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;
}