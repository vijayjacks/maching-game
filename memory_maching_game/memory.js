const startBtn = document.querySelector('.game-start-btn');
startBtn.addEventListener('click', function(){
  // 1. hide the btn
  this.classList.add('hide-start-btn');
  // 2. start the game
  game();
});

$(document).ready(function() {

    /*
     * Create a list that holds all of your cards
     */
    var cards = $('.card').get();
    
    /*
     * Display the cards on the page
     *   - shuffle the list of cards using the provided "shuffle" method below
     *   - loop through each card and create its HTML
     *   - add each card's HTML to the page
     */
    
     shuffle(cards);
    
     const deck = document.querySelector(".deck");
     for (const card of cards) {
       deck.appendChild(card);
     };
    
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
    
     var openCardList = [];
    
     for (const card of cards) {
       card.addEventListener("click", function() {
         clockRunning = true;
         if (openCardList.length < 2) {
           listOpenCards(card);
           show(card);
         };
    
         if (openCardList.length == 2) {
           lockAllCards();
           checkMatch();
           setTimeout( function() {
           unlockAllCards()},750);
         }
    
       });
     };
    
    function show(card) {
       $(card).addClass('open');
       $(card).addClass('show');
       $(card).addClass('lock');
     }
    
    var moves = 0;
    var counter = $('.moves').get()[0];
    
    function increaseCounter() {
      moves++;
      counter.innerHTML = moves;
    }
    
     function listOpenCards(card) {
       openCardList.push(card);
     }
    
    function hide(card) {
      $(card).removeClass('open');
      $(card).removeClass('show');
      $(card).removeClass('lock');
    }
    
    var matched = 0;
    
    function lockAllCards() {
      for (card of cards) {
        $(card).addClass('lock');
      };
    }
    
    function unlockAllCards() {
      for (card of cards) {
        $(card).removeClass('lock');
      };
    }
    
     function checkMatch() {
       increaseCounter();
       hideStar();
       if (openCardList[0].innerHTML == openCardList[1].innerHTML) {
         matched++;
         $(openCardList[0]).addClass('match');
         $(openCardList[1]).addClass('match');
         openCardList = [];
       } else {
         $(openCardList[0]).addClass('unmatch');
         $(openCardList[1]).addClass('unmatch');
         setTimeout( function() {
           for (card of openCardList) {
             $(card).removeClass('unmatch');
             hide(card);
           };
           openCardList = [];
         },1100);
       };
       if (matched == 8) {
         success();
       };
     }
    
     //restart function that restarts the counter, shuffles the cards, and resets the board
     function restart() {
       moves = 0;
       counter.innerHTML = 0;
       matched = 0;
       cards.forEach(function(card) {
         hide(card);
         $(card).removeClass('match');
       });
       shuffle(cards);
       openCardList = [];
       for (const card of cards) {
         deck.appendChild(card);
       };
       clockRunning = false;
       elapsedTime = 0;
       clearInterval(clockInterval);
       clock();
       for (star of stars) {
         star.style.visibility = "visible";
       };
       removedStar=2;
     }
    
    //adds an event listener to the restart div
    $('.fa-repeat').get()[0].addEventListener("click", function(){
      restart();
    });
    
     //setting the functionality of the clock, the clock is tied to the evenlistener on the cards above
     var clockRunning = false;
     var elapsedTime = 0;
     var clockDisplay = $('.clock').get()[0];
     var clockInterval;
    
     //start the clock once the page loads-- prevents weird interval interference
     clock();
    
     function clock() {
         clockInterval = setInterval (function() {
           if (clockRunning) {
             elapsedTime++;
           };
           var minutes = String(Math.floor(elapsedTime / 60));
           var seconds = String(elapsedTime % 60).padStart(2,'0');
           clockDisplay.innerHTML = minutes + ':' + seconds;
         }, 1000);
     }
    
     //adding the functionality of the scoring system based on the number of stars displayed
     var stars = $('.fa-star').get();
     var removedStar = 2;
    
     function hideStar() {
       if (moves == 16 || moves == 24) {
         stars[removedStar].style.visibility = "collapse";
         removedStar--;
       };
     }
    
     //congratulations modal that reveals the time, star rating, and number of moves utilized to win the Game
     var modal = document.getElementById("winner");
    
     function success() {
       clockRunning = false;
       clearInterval(clockInterval);
       finalTime = clockDisplay.innerHTML;
    
       //revealing the congratulations modal upon winning
       modal.classList.add("show");
    
       //defining star rating variable
       var starRating = document.querySelector(".stars").innerHTML;
    
       //display the number of moves, the star rating, and time on the Congratulations modal
       document.getElementById("star-rating").innerHTML = starRating;
       document.getElementById("final-move").innerHTML = moves;
       document.getElementById("total-time").innerHTML = finalTime;
     }
    
    
     $(".play-again").get()[0].addEventListener("click", function() {
       modal.classList.remove("show");
       restart();
     });
    
    });
    