/*
flip sign
add images for pick
highlight pick
highlight winner
highlight draw

--prettify
columns
transparent countdown over signs
Larger current score + maybe colors
Help text
Title
*/

var human_wins;
var computer_wins;
var draws;
var nrgames=0;

var human_history;
var computer_history;

var next_move;
var human_move;

MOVE_LETTER = ['R', 'P', 'S']

BASESIGN = '/static/images/600px-'
SIGNS = ["rock", "paper", 'scissors']

function show_signs(human, computer){
    document.getElementById('human_sign').src = BASESIGN + SIGNS[human] + '.png'
    document.getElementById('computer_sign').src = BASESIGN + SIGNS[computer] + '.png'
}

function show_score(){
    document.getElementById('human_wins').innerHTML = human_wins
    document.getElementById('draws').innerHTML = draws
    document.getElementById('computer_wins').innerHTML = computer_wins
}

function initialize(){
    document.getElementById("message").innerHTML = 'First to 20 wins!'
    human_wins = 0
    computer_wins = 0
    draws = 0;
    human_history = ''
    computer_history = ''
    
    get_next_move()
}

function draw(){
    draws++;
}

function hwin(){
    human_wins++;
}

function hlose(){
    computer_wins++;
}

function pick_move(n){
    human_move = n;
    function cset(n, col){
        e = document.getElementById('pickmove'+n);
        e.style.color = col;
    }
    cset(0, "black")
    cset(1, "black")
    cset(2, "black")
    cset(n, "red")

    if(nrgames==0){
        initialize();
        decide();
    }
}

function get_next_move(){
    if(human_history == ''){
        next_move = Math.floor(Math.random() * 3);
        return
    }
    next_move = -1;

    var xmlhttp = new XMLHttpRequest();
    var url = "http://advectas-rps.azurewebsites.net/move/"+human_history+"/"+computer_history+"/";
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            next_move = JSON.parse(xmlhttp.responseText);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function decide(){
    if(next_move == -1) {
        setInterval(decide, 1000)
    } else {
        nrgames++;
        show_signs(human_move, next_move)
        if(next_move==0){
            if(human_move==0) draw()
            if(human_move==1) hwin()
            if(human_move==2) hlose()
        } else if(next_move==1){
            if(human_move==1) draw()
            if(human_move==2) hwin()
            if(human_move==0) hlose()
        } else {
            if(human_move==2) draw()
            if(human_move==0) hwin()
            if(human_move==1) hlose()
        }
        show_score();
        if(human_wins==20){
            document.getElementById("message").innerHTML = 'You won! Lucky humans.. -> Reload page to play again.'
        } else if(computer_wins==20) {
            document.getElementById("message").innerHTML = 'I win again! Predictable humans.. -> Reload page to play again.'
        } else {
            human_history += MOVE_LETTER[human_move]
            computer_history += MOVE_LETTER[next_move]
            get_next_move();
            start_countdown();
        }
    }
}


function Countdown(options) {
  var timer,
  instance = this,
  seconds = options.seconds || 10,
  updateStatus = options.onUpdateStatus || function () {},
  counterEnd = options.onCounterEnd || function () {};

  function decrementCounter() {
    updateStatus(seconds);
    if (seconds === 0) {
      counterEnd();
      instance.stop();
    }
    seconds--;
  }

  this.start = function () {
    clearInterval(timer);
    timer = 0;
    seconds = options.seconds;
    timer = setInterval(decrementCounter, 1000);
  };

  this.stop = function () {
    clearInterval(timer);
  };
}


function start_countdown(){
    var myCounter = new Countdown({  
        seconds:5,  // number of seconds to count down
        onUpdateStatus: function(sec){document.getElementById('counter').innerHTML=''+sec}, // callback for each second
        onCounterEnd: function(){ decide() }
    });
    myCounter.start();
}

