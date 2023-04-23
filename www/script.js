const gallery = document.getElementById('gallery');
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const output = document.getElementById('output');

let answer = "";
let shouldGuess = false;
const numOutputs = 100;

guessButton.addEventListener('click', ev => {
  guess(guessInput.value);
});

guessInput.addEventListener('keydown', ev => {
  if(ev.key == 'Enter') {
    guess(guessInput.value);
  }
});

function displayInfo(str) {
  output.innerText = str;
}

function capitalizeWords(str) {
 return str.replace(/\b\w/g, x => x.toUpperCase())
}

function guess(str) {
  if(!shouldGuess) {
    displayInfo(``);
    getNext();
    return;
  }
  let matches = 0;
  // Take only the first 3 words that are separated by a space
  const guessWords = str.split(' ').filter((_,i) => i < 3);
  const alreadyMatched = {};
  const answers = answer.split(' ');
  for(const word of answers) {
    for(const guessWord of guessWords) {
      if(word == guessWord && !alreadyMatched[guessWord]) {
        matches++;
        alreadyMatched[guessWord] = true;
      }
    }
  }
  displayInfo(`Your guess was: ${capitalizeWords(str)}\nThe actual prompt was: ${capitalizeWords(answer)}\nYou got ${matches} correct!`);
  guessInput.value = '';
  shouldGuess = false;
}

const numImages = 4;
const imgs = [];
for(let i = 0; i < numImages; i++) {
  const img = document.createElement('img');
  imgs.push(img);
  gallery.appendChild(img);
}

function getNext() {
  const randIndex = Math.floor(Math.random() * numOutputs);
  for(let i = 0; i < numImages; i++) {
    imgs[i].src = `loading.gif`;
  }
  answer = "";
  fetch(`output/${randIndex}/info.txt`).then(response => response.text()).then(data => {
    answer = data;
    for(let i = 0; i < numImages; i++) {
      imgs[i].src = `output/${randIndex}/${i}.jpg`;
    }
    shouldGuess = true;
  });
}
getNext();
