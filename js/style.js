document.addEventListener('DOMContentLoaded', (event) => {
  testTyping();
  throwATextForTyping();
  clickTransition();
  ifDocumentExist();
  showOldScores();
});

// Adding scores to localStorage
const addScoreToStorage = (cS, timer, aCT, cC, iC, cpm, wpm, date) => {
  const score = {
    cS: cS,
    timer: timer,
    aCT: aCT,
    cC: cC,
    iC: iC,
    cpm: cpm,
    wpm: wpm,
    date: date
  };
  let result = JSON.parse(localStorage.getItem('result'));
  if (!result) {
    result = [];
  };
  result.push(score);
  localStorage.setItem('result', JSON.stringify(result));
}

// Scores from localStorage
const showOldScores = () => {
  const result = JSON.parse(localStorage.getItem('result'));
  result.forEach(score => {
    const x = `
    <div class="transition2">
      <div class="singleScore">
        <div>${score.cS}</div>
        <div><p>Test time:</p><p>${score.timer}</p></div>
        <div><p>All chars:</p><p>${score.aCT}</p></div>
        <div><p>Correct chars:</p><p>${score.cC}</p></div>
        <div><p>Incorrect chars:</p><p>${score.iC}</p></div>
        <div><p>CPM:</p><p>${score.cpm}</p></div>
        <div><p>WPM:</p><p>${score.wpm}</p></div>
        <div>Date: <span>${score.date}<span></div>
      </div>
    </div>`;
    scoresMenu.innerHTML = x + scoresMenu.innerHTML;
  });
}

let countAll = 0;
let countCorrect = 0;
let countIncorrect = 0;

const ifDocumentExist = () => {
  const documents = document.querySelectorAll('#levelNavigation > li > ul > li > p');
  Array.from(documents).forEach((doc) => {
    if (!doc.hasChildNodes()) {
      doc.parentElement.dataset.exist = 'true';
    }
  })
}

const clickTransition = () => {
  const scoresMenu = document.getElementById('scoresMenu');
  scoresMenu.addEventListener('click', (o) => {
    const current = o.currentTarget.querySelector('.transition');
    if (current) {
      current.className = 'transition2';
    }
  });
}
// ADD TO THE FUNCTION - CHANGE STYLE WITH TOP
const movingBlockDocuments = (whatDifferance) => {
  const arrBlocks = ContainChars.querySelectorAll('div');
  arrBlocks.forEach((user) => {
    const getStyleTop = parseInt(user.style.top);
    const newStypeTop = getStyleTop + whatDifferance + 'px';
    user.style.top = newStypeTop;
  });
}

const removerChars = (compare, subtract) => {
  if (compare.charAt(0) === '\u0020') {
    subtract.innerText = subtract.innerText.trim();
  } else {
    subtract.innerText = subtract.innerText.substring(1);
  }
}

const backspaceAction = (result, currentKey, created) => {
  const lastBadChar = result.lastElementChild.innerText;
  if (currentKey.innerText === '') {

  } else {
    created.innerText = currentKey.innerText + created.innerText;
  }
  currentKey.innerText = lastBadChar;
  result.removeChild(result.lastElementChild);
}

const typing = (correctnessOfKey, result, currentKey, created) => {
  const addCorrecting = document.createElement('span');
  const createdText = created.innerText;
  addCorrecting.setAttribute('class', correctnessOfKey);
  addCorrecting.innerText = currentKey.innerText;
  result.appendChild(addCorrecting);
  currentKey.innerText = createdText.charAt(0);
  removerChars(createdText, created);
}
const TimerFunction = (action) => {
  const timer = document.getElementById('testTime').children[1];
  let minutes = 0;
  let seconds = 0;
  let counter = 0;
  if (action === 'init') {
    let startTime;
    timer.innerText = '00:00';
  }
  if (action === 'stop') {
    if (typeof startTime !== 'undefined') {
      clearInterval(startTime);
    }
  }

  if (action === 'start') {
    startTime = setInterval(() => {
      counter++;
      minutes = parseInt(counter / 60);
      seconds = parseInt(counter % 60);
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      timer.innerText = minutes + ':' + seconds;
    }, 1000);
  }
};

/************** ContainChars remove?????? ********/
const countCharactersLive = (charsOfDocument) => {
  const correctCharacters = document.getElementById('correctCharactersLive').children[1];
  const incorrectCharacters = document.getElementById('incorrectCharactersLive').children[1];
  if (charsOfDocument == 'correct') {
    countCorrect++;
    let countCorrectLive = countCorrect;
    correctCharacters.innerText = countCorrectLive;
  } else if (charsOfDocument == 'incorrect') {
    countIncorrect++;
    let countIncorrectLive = countIncorrect;
    incorrectCharacters.innerText = countIncorrectLive;
  } else if (charsOfDocument === 'enter') {
    correctCharacters.innerText = countCorrect;
    incorrectCharacters.innerText = countIncorrect;
  } else if (charsOfDocument.lastElementChild.getAttribute('class') == 'wellKey') {
    countCorrect--;
    correctCharacters.innerText = countCorrect;
  } else if (charsOfDocument.lastElementChild.getAttribute('class') == 'badKey') {
    countIncorrect--;
    incorrectCharacters.innerText = countIncorrect;
  }
}

Date.prototype.timing = function () {
  const setZero = (i) => {
    return (i < 10) ? '0' + i : i;
  }
  return setZero(this.getDate()) + '.' + setZero(this.getMonth() + 1) + '.' + this.getFullYear() + ' ' +
    setZero(this.getHours()) + ':' + setZero(this.getMinutes());
}

const theEndOfTyping = () => {
  const currentlySelected = document.querySelector('#selectedDocument span').innerText;
  const timer = document.getElementById('testTime').children[1].innerText;
  const allCharacters = document.getElementById('allCharactersLive').children[1];
  const allCharactersText = allCharacters.innerText;
  const correctCharacters = document.getElementById('correctCharactersLive').children[1].innerText;
  const incorrectCharacters = document.getElementById('incorrectCharactersLive').children[1].innerText;
  const allWords = allCharacters.dataset.words;
  const scoresMenu = document.getElementById('scoresMenu');

  const allSeconds = parseInt(timer.slice(0, 2)) * 60 + parseInt(timer.slice(3));
  const wpm = Math.round(allWords / (allSeconds / 60));
  const cpm = Math.round(allCharacters.innerText / (allSeconds / 60));
  const date = new Date();
  const setDate = date.timing();

  const x = `
  <div class="transition">
    <div class="singleScore">
      <div>${currentlySelected}</div>
      <div><p>Test time:</p><p>${timer}</p></div>
      <div><p>All chars:</p><p>${allCharactersText}</p></div>
      <div><p>Correct chars:</p><p>${correctCharacters}</p></div>
      <div><p>Incorrect chars:</p><p>${incorrectCharacters}</p></div>
      <div><p>CPM:</p><p>${cpm}</p></div>
      <div><p>WPM:</p><p>${wpm}</p></div>
      <div>Date: <span>${setDate}<span></div>
    </div>
  </div>`;

  scoresMenu.innerHTML = x + scoresMenu.innerHTML;
  addScoreToStorage(currentlySelected, timer, allCharactersText, correctCharacters, incorrectCharacters, cpm, wpm, setDate);
}


const testTyping = () => {
  const ContainChars = document.querySelector('#ContainChars');
  const inputText = document.getElementById('input-text');

  inputText.addEventListener('keypress', (e) => {

    let firstBlock = ContainChars.querySelector('.firstBlock');
    let result = firstBlock.querySelector('.result');
    let currentKey = firstBlock.querySelector('.currentKey');
    let created = firstBlock.querySelector('.created');
    let createdText = created.innerText;

    if (inputText.hasAttribute('readonly')) { // if ready to typing? BLOCKADE
      if ((e.key === 'Enter') && (result.innerText === '')) {
        inputText.removeAttribute('readonly');
        inputText.value = '';
        currentKey.innerText = createdText.charAt(0);
        removerChars(createdText, created);
        TimerFunction('start');
      } else if (result.innerText === '') {

        inputText.value = 'Press Enter';
      } else {
        console.log('Something wrong? Contact the administrator')
      }
    } else { // if ready to typing? INPUT IS OPEN
      const iE = document.querySelector('span[name=iconEnter]');
      (iE) ? iE.parentElement.removeChild(iE) : '';
      // result & currentKey are EMPTY           
      if ((result.innerText === '') && (currentKey.innerText === '')) {
        (e.key === 'Backspace') ? backspaceAction(result, currentKey, created) : '';
      } else {
        if ((e.key === currentKey.innerText.charAt(0))) {
          if (!((createdText === '') && (currentKey.innerText === ''))) {
            typing('wellKey', result, currentKey, created);
            countCharactersLive('correct');
          }
        } else {
          if (e.key === 'Backspace') {
            if (result.hasChildNodes()) {
              const lastBadChar = result.lastElementChild.innerText;
              if (currentKey.innerText !== '') {
                created.innerText = currentKey.innerText + created.innerText;
              }
              currentKey.innerText = lastBadChar;
              countCharactersLive(result);
              result.removeChild(result.lastElementChild);
            } else {
              if (firstBlock.previousElementSibling) {
                created.innerText = currentKey.innerText + created.innerText;
                currentKey.innerText = '';
                let PreviousBlock = firstBlock.previousElementSibling;
                PreviousBlock.setAttribute('class', 'firstBlock');
                firstBlock.setAttribute('class', 'otherBlock');
                firstBlock = ContainChars.querySelector('.firstBlock');
                result = firstBlock.querySelector('.result');
                currentKey = firstBlock.querySelector('.currentKey');
                created = firstBlock.querySelector('.created');
                movingBlockDocuments(30);

                inputText.value = result.innerText + 'X';
              }
            }
          } else {
            if ((createdText === '') && (currentKey.innerText === '')) {
              if ((e.key === 'Enter') || (e.key === '\u0020')) {
                if (firstBlock.nextElementSibling) {
                  firstBlock.setAttribute('class', 'otherBlock');
                  firstBlock.nextElementSibling.setAttribute('class', 'firstBlock');
                  firstBlock = ContainChars.querySelector('.firstBlock');
                  result = firstBlock.querySelector('.result');
                  currentKey = firstBlock.querySelector('.currentKey');
                  created = firstBlock.querySelector('.created');
                  createdText = created.innerText;
                  currentKey.innerText = createdText.charAt(0);
                  removerChars(createdText, created);
                  movingBlockDocuments(-30);
                  inputText.value = '';
                } else { /***** THE END OF TYPING *****/
                  TimerFunction('stop');
                  inputText.value = '';
                  inputText.setAttribute('readonly', '');
                  theEndOfTyping();
                }

              } else {
                const iconEnter = document.createElement('span');
                iconEnter.setAttribute('name', 'iconEnter');
                iconEnter.setAttribute('style', 'line-height: 1;');
                iconEnter.innerText = '\u23CE';
                firstBlock.appendChild(iconEnter);
              }
            } else {
              typing('badKey', result, currentKey, created);
              countCharactersLive('incorrect');
            }
          }
        }
      }
    }
  });
}

const throwATextForTyping = () => {
  const documentsCollection = document.querySelector('#levelNavigation');
  const ContainChars = document.querySelector('#ContainChars');
  const inputText = document.getElementById('input-text');

  const repeatAdding = (n1) => {
    const newBlockToTyping = document.createElement('div');
    if (ContainChars.hasChildNodes()) {
      newBlockToTyping.setAttribute('class', 'otherBlock');
      newBlockToTyping.setAttribute('style', 'top: 30px');
    } else {
      newBlockToTyping.setAttribute('class', 'firstBlock');
      newBlockToTyping.setAttribute('style', 'top: 30px');
    }
    ContainChars.appendChild(newBlockToTyping);

    const newBlockToTypingResult = document.createElement('p');
    newBlockToTypingResult.setAttribute('class', 'result');
    ContainChars.lastElementChild.appendChild(newBlockToTypingResult);

    const newBlockToTypingCurrentKey = document.createElement('p');
    newBlockToTypingCurrentKey.setAttribute('class', 'currentKey');
    ContainChars.lastElementChild.appendChild(newBlockToTypingCurrentKey);

    const newBlockToTypingCreated = document.createElement('p');
    newBlockToTypingCreated.setAttribute('class', 'created');
    newBlockToTypingCreated.innerText = n1;
    ContainChars.lastElementChild.appendChild(newBlockToTypingCreated);
  }

  documentsCollection.addEventListener('click', (event) => {

    if ((event.target.tagName === 'LI') && (event.target.parentElement.parentElement.parentElement.hasAttribute('id', 'levelNavigation'))) {
      TimerFunction('stop');
      TimerFunction('init');
      let getDocumentToType = {};
      getDocumentToType.innerText = event.target.firstElementChild.innerText;
      const countRoundsLoops = Math.floor(getDocumentToType.innerText.length / 60);

      const allCharacters = document.getElementById('allCharactersLive').children[1];
      allCharacters.innerText = event.target.firstElementChild.innerText.length - countRoundsLoops;

      /***** Adding number all words *****/
      const countWords = event.target.firstElementChild.innerText.split(' ').length;
      allCharacters.dataset.words = countWords;

      /***** Adding the currently selected document *****/
      const currentlySelected = document.querySelector('#selectedDocument');
      const nameDocument = event.target.firstChild.nodeValue;
      currentlySelected.firstElementChild.innerText = nameDocument;

      if (!inputText.hasAttribute('readonly')) {
        inputText.setAttribute('readonly', '');
      }
      countCorrect = 0;
      countIncorrect = 0;
      countCharactersLive('enter');
      inputText.value = '';
      ContainChars.innerText = '';

      for (j = countRoundsLoops; j > 0; j--) {
        for (i = 60; i > 0; i--) {
          if (getDocumentToType.innerText.charAt(i) === '\u0020') {

            const n1 = getDocumentToType.innerText.slice(0, ++i);
            repeatAdding(n1);

            getDocumentToType.innerText = getDocumentToType.innerText.substring(i);

            if (j === 1) {
              const getDocumentToTypeText = getDocumentToType.innerText
              repeatAdding(getDocumentToTypeText);
            }
            break;
          }
        }
      }
    }
  });
}
