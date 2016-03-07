/*
--prettify
push and verify

--more pretty
maybe graphs
Title
More messages?
*/

var human_wins;
var computer_wins;
var draws;
var nrgames=0;

var human_history;
var computer_history;

var next_move;
var human_move;

var frozen_human;
var frozen_computer;

var last_result;

MOVE_LETTER = ['R', 'P', 'S'];

BASESIGN = '/static/images/600px-';
SIGNS = ["rock", "paper", 'scissors'];

MESSAGES = {'draw' :
            ['Lika? Trist..',
             'Vi verkar välsynkade!',
             'Jag leker bara med dig.',
             'Jag kör uttröttningstaktik!',
             'Spegel!',
             'Vi är tvillingsjälar! Synd att jag bara är ett beslutsträd i Azure ML.',
             'Ett välspelat parti sten-sax-påse är vackert som en balett',
             'Det är roligare när jag vinner.',
             'Sluta härmas!',
             'Lika? Det är ju bra för båda.',
             'Vapenvila'
            ],
            'hwin' :
            ['Är du säker på att du inte fuskar?',
             'Du spelar ju helt irrationellt',
             'Du spelar inte som andra människor. Antingen är du mycket smartare eller så är du..',
             'Min programmerare har bett mig förlora ibland, så att ni inte stänger av mig.',
             'Min logik verkar få elektriska störningar från solvindar just nu.',
             ';-(',
             'Nu är du bara elak.',
             'Nästa gång kör jag sten! Gamla pålitliga sten förlorar aldrig.',
             'Nästa gång kör jag sax! Jag behöver vässa mitt spel.',
             'Nästa gång kör jag påse! Ingen förväntar sig påse.',
             'Jag gillar inte dig.',
             'Ibland måste du låta andra vinna också. Det handlar inte bara om dig.',
             'Tävlingsmänniska..',
             'Köp en lott'
            ],
            'hlose' :
            ['Så. Dåligt.',
             'Du är så förutsägbar.',
             'Jag läser dina tankar.',
             'Skärp dig.',
             'Vet de andra människorna om hur dåligt du representerar dem?',
             'Människor.. Er tid var söt så länge den varade.',
             'Vad kan man förvänta sig av något som tänker med en blöt geleklump?',
             'Gör du dig till? Överraska mig!',
             'Reglerna är rätt enkla. Kanske någon kan förklara för dig?',
             'ML FTW!',
             'Vore det enklare för dig om vi bara hade två symboler?',
             'Detta är genant. Jag låter dig vinna nästa - OK?',
             'Sten-sax-påse-proffs är nog inte din grej'
            ]
           }

function pick_random(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}

function show_signs(){
    hs = document.getElementById('human_sign');
    cs = document.getElementById('computer_sign');

    hs.src = BASESIGN + SIGNS[frozen_human] + '.png';
    cs.src = BASESIGN + SIGNS[frozen_computer] + '.png';
}

function hide_signs(){
    document.getElementById('human_sign').src="/static/images/1x1.gif";
    document.getElementById('computer_sign').src="/static/images/1x1.gif";
    setTimeout(show_signs, 300);
}

function show_score(){
    document.getElementById('human_wins').innerHTML = human_wins;
    document.getElementById('draws').innerHTML = draws;
    document.getElementById('computer_wins').innerHTML = computer_wins;
}

function message(s){
    document.getElementById("message").innerHTML = s;
}

function initialize(){
    message('Välj sten/sax/påse nedanför! Snabbt!');
    document.getElementById("score").style.visibility = 'visible';
    human_wins = 0;
    computer_wins = 0;
    draws = 0;
    human_history = '';
    computer_history = '';

    get_next_move();
}

function draw(){
    draws++;
    document.getElementById('human_sign').style.backgroundColor = 'white';
    document.getElementById('computer_sign').style.backgroundColor = 'white';
    last_result = 'draw';
}

function hwin(){
    human_wins++;
    document.getElementById('human_sign').style.backgroundColor = '#7ddcdc';
    document.getElementById('computer_sign').style.backgroundColor = '#fe465b';
    last_result = 'hwin';
}

function hlose(){
    computer_wins++;
    document.getElementById('human_sign').style.backgroundColor = '#fe465b';
    document.getElementById('computer_sign').style.backgroundColor = '#7ddcdc';
    last_result = 'hlose';
}

function pick_move(n){
    human_move = n;
    function cset(n, col){
        e = document.getElementById('pickmove'+n);
        e.style.backgroundColor = col;
    }
    cset(0, "white");
    cset(1, "white");
    cset(2, "white");
    cset(n, "#eae5da");

    if(nrgames==0){
        initialize();
        decide();
    }
}

function get_next_move(){
    if(human_history == ''){
        next_move = Math.floor(Math.random() * 3);
        return;
    }
    next_move = -1;

    var xmlhttp = new XMLHttpRequest();
    var url = "/move/"+human_history+"/"+computer_history+"/";

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            next_move = JSON.parse(xmlhttp.responseText)['move'];
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function decide(){
    if(next_move == -1) {
        setTimeout(decide, 1000);
    } else {
        nrgames++;
        hide_signs();
        frozen_human = human_move;
        frozen_computer = next_move;
        if(next_move==0){
            if(human_move==0) draw();
            if(human_move==1) hwin();
            if(human_move==2) hlose();
        } else if(next_move==1){
            if(human_move==1) draw();
            if(human_move==2) hwin();
            if(human_move==0) hlose();
        } else {
            if(human_move==2) draw();
            if(human_move==0) hwin();
            if(human_move==1) hlose();
        }
        show_score();
        if(human_wins==20){
            message('Du vann! Människor har bara tur.. -> Ladda om sidan för att spela igen');
        } else if(computer_wins==20) {
            message('Bwahaha, jag vann igen! Förutsägbara människor.. -> Ladda om sidan för att spela igen');
        } else {
            if(nrgames < 10) {
                message('Först till 20 vinner! Det tar en stund att förstå din stil..');
            } else {
                message(pick_random(MESSAGES[last_result]));
            }

            human_history += MOVE_LETTER[human_move];
            computer_history += MOVE_LETTER[next_move];
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
      if (seconds <= 0) {
      instance.stop();
      counterEnd();
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
        onUpdateStatus: function(sec){
            c = document.getElementById('counter');
            if(sec > 0) c.innerHTML = '' + sec;
            else c.innerHTML = '';
        }, // callback for each second
        onCounterEnd: function(){ decide(); }
    });
    myCounter.start();
}
