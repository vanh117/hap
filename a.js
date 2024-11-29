const LETTER_POOL = getEl("letter-pool");
const TEMP_LETTER_POOL = getEl("temp-letter-pool");
const LETTER_OVERLAY = getEl("letter-overlay");
const CHAT_MESSAGE_COLUMN_WRAPPER = getEl("chat-message-column-wrapper");
const CHAT_MESSAGE_COLUMN = getEl("chat-message-column");
const MESSAGE_INPUT = getEl("message-input");
const MESSAGE_INPUT_FIELD = getEl("message-input-field");
const CHAT_BOT_MOOD = getEl("chat-bot-mood");
const CHAT_BOT_MOOD_VALUE = getEl("chat-bot-mood-value");

const STATE = {
  isUserSendingMessage: false,
  isChatBotSendingMessage: false,
  letterPool: {
    transitionPeriod: 30000,
    intervals: []
  },
  moods: ["friendly", "suspicious", "boastful"],
  currentMood: "",
  chatbotMessageIndex: 0,
  nLetterSets: 4
};

function getRandMood() {
  const rand = getRand(1, 3);
  return STATE.moods[rand - 1];
}

function setChatbotMood() {
  STATE.currentMood = getRandMood();
  for (let i = 0; i < STATE.moods.length; i++) {
    removeClass(CHAT_BOT_MOOD, STATE.moods[i]);
  }
  addClass(CHAT_BOT_MOOD, STATE.currentMood);
  CHAT_BOT_MOOD_VALUE.innerHTML = STATE.currentMood;
}

function getRandGreeting() {
  let rand = 0;
  switch (STATE.currentMood) {
    case "friendly":
      rand = getRand(1, greetings.friendly.length);
      return greetings.friendly[rand - 1];
    case "suspicious":
      rand = getRand(1, greetings.suspicious.length);
      return greetings.suspicious[rand - 1];
    case "boastful":
      rand = getRand(1, greetings.boastful.length);
      return greetings.boastful[rand - 1];
    default:
      break;
  }
}

function getRandConvo() {
  let rand = 0;
  switch (STATE.currentMood) {
    case "friendly":
      rand = getRand(1, convo.friendly.length);
      return convo.friendly[rand - 1];
    case "suspicious":
      rand = getRand(1, convo.suspicious.length);
      return convo.suspicious[rand - 1];
    case "boastful":
      rand = getRand(1, convo.boastful.length);
      return convo.boastful[rand - 1];
    default:
      break;
  }
}

function createLetter(cName, val) {
  const letter = document.createElement("div");
  addClass(letter, cName);
  setAttr(letter, "data-letter", val);
  letter.innerHTML = val;
  return letter;
}

function getAlphabet(isUpperCase) {
  let letters = [];
  for (let i = 65; i <= 90; i++) {
    let val = String.fromCharCode(i);
    if (!isUpperCase) val = val.toLowerCase();
    const letter = createLetter("pool-letter", val);
    letters.push(letter);
  }
  return letters;
}


function startNewLetterPath(letter, nextRand, interval) {
  clearInterval(interval);
  nextRand = getRandExcept(1, 4, nextRand);
  const nextPos = getRandPosOffScreen(nextRand);
  const transitionPeriod = STATE.letterPool.transitionPeriod;
  const delay = getRand(0, STATE.letterPool.transitionPeriod);
  const transition = `left ${transitionPeriod}ms linear ${delay}ms, top ${transitionPeriod}ms linear ${delay}ms, opacity 0.5s`;
  
  setElPos(letter, nextPos.x, nextPos.y);
  setStyle(letter, "transition", transition);

  interval = setInterval(() => {
    startNewLetterPath(letter, nextRand, interval);
  }, STATE.letterPool.transitionPeriod + delay);

  STATE.letterPool.intervals.push(interval);
}

function setRandLetterPaths(letters) {
  for (let i = 0; i < letters.length; i++) {
    const letter = letters[i];
    const startRand = getRand(1, 4);
    const nextRand = getRandExcept(1, 4, startRand);
    const startPos = getRandPosOffScreen(startRand);
    const nextPos = getRandPosOffScreen(nextRand);
    const transitionPeriod = STATE.letterPool.transitionPeriod;
    const delay = getRand(0, STATE.letterPool.transitionPeriod) * -1;
    const transition = `left ${transitionPeriod}ms linear ${delay}ms, top ${transitionPeriod}ms linear ${delay}ms, opacity 0.5s`;

    setElPos(letter, startPos.x, startPos.y);
    setStyle(letter, "transition", transition);
    addClass(letter, "invisible");
    LETTER_POOL.appendChild(letter);

    setTimeout(() => {
      setElPos(letter, nextPos.x, nextPos.y);
      removeClass(letter, "invisible");

      const interval = setInterval(() => {
        startNewLetterPath(letter, nextRand, interval);
      }, STATE.letterPool.transitionPeriod + delay);

    }, 1);
  }
}

function fillLetterPool(nSets = 1) {
  for (let i = 0; i < nSets; i++) {
    const lCaseLetters = getAlphabet(false);
    const uCaseLetters = getAlphabet(true);
    setRandLetterPaths(lCaseLetters);
    setRandLetterPaths(uCaseLetters);
  }
}

function findMissingLetters(letters, lCount, isUpperCase) {
  const missingLetters = [];
  for (let i = 65; i <= 90; i++) {
    const val = isUpperCase
      ? String.fromCharCode(i)
      : String.fromCharCode(i).toLowerCase();

    const nLetter = letters.filter((letter) => letter === val).length;

    if (nLetter < lCount) {
      let j = nLetter;
      while (j < lCount) {
        missingLetters.push(val);
        j++;
      }
    }
  }
  return missingLetters;
}

function replenishLetterPool(nSets = 1) {
  const poolLetters = LETTER_POOL.childNodes;
  const currentLetters = [];
  let missingLetters = [];
  const lettersToAdd = [];

  for (let i = 0; i < poolLetters.length; i++) {
    currentLetters.push(poolLetters[i].dataset.letter);
  }

  missingLetters = [
    ...missingLetters,
    ...findMissingLetters(currentLetters, nSets, false)
  ];

  missingLetters = [
    ...missingLetters,
    ...findMissingLetters(currentLetters, nSets, true)
  ];

  for (let i = 0; i < missingLetters.length; i++) {
    const val = missingLetters[i];
    lettersToAdd.push(createLetter("pool-letter", val));
  }
  setRandLetterPaths(lettersToAdd);
}


function clearLetterPool() {
  removeAllChildren(LETTER_POOL);
}

function scrollToBottomOfMessages() {
  CHAT_MESSAGE_COLUMN_WRAPPER.scrollTop = CHAT_MESSAGE_COLUMN_WRAPPER.scrollHeight;
}

function checkMessageColumnHeight() {
  if (CHAT_MESSAGE_COLUMN.clientHeight >= window.innerHeight) {
    removeClass(CHAT_MESSAGE_COLUMN, "static");
  } else {
    addClass(CHAT_MESSAGE_COLUMN, "static");
  }
}

function appendContentText(contentText, text) {
  for (let i = 0; i < text.length; i++) {
    const letter = document.createElement("span");
    letter.innerHTML = text[i];
    setAttr(letter, "data-letter", text[i]);
    contentText.appendChild(letter);
  }
}

function createChatMessage(text, isReceived) {
  const message = document.createElement("div");
  const profileIcon = document.createElement("div");
  const icon = document.createElement("i");
  const content = document.createElement("div");
  const contentText = document.createElement("h1");
  const direction = isReceived ? "received" : "sent";

  addClass(content, "content");
  addClass(content, "invisible");
  addClass(contentText, "text");
  addClass(contentText, "invisible");
  appendContentText(contentText, text);
  content.appendChild(contentText);

  addClass(profileIcon, "profile-icon");
  addClass(profileIcon, "invisible");
  profileIcon.appendChild(icon);

  addClass(message, "message");
  addClass(message, direction);

  if (isReceived) {
    addClass(icon, "fab");
    addClass(icon, "fa-cloudsmith");
    addClass(message, STATE.currentMood);
    message.appendChild(profileIcon);
    message.appendChild(content);
  } else {
    addClass(icon, "far");
    addClass(icon, "fa-user");
    message.appendChild(content);
    message.appendChild(profileIcon);
  }

  return message;
}

function findLetterInPool(targetLetter) {
  const letters = LETTER_POOL.childNodes;
  let foundLetter = null;

  for (let i = 0; i < letters.length; i++) {
    const nextLetter = letters[i];
    if (nextLetter.dataset.letter === targetLetter && !nextLetter.dataset.found) {
      foundLetter = letters[i];
      setAttr(foundLetter, "data-found", true);
      break;
    }
  }

  return foundLetter;
}

function createOverlayLetter(val) {
  const overlayLetter = document.createElement("span");
  addClass(overlayLetter, "overlay-letter");
  addClass(overlayLetter, "in-flight");
  overlayLetter.innerHTML = val;
  return overlayLetter;
}

function removePoolLetter(letter) {
  addClass(letter, "invisible");
  setTimeout(() => {
    removeChild(LETTER_POOL, letter);
  }, 500);
}

function setElPosFromRight(el, x, y) {
  setStyle(el, "right", `${x}px`);
  setStyle(el, "top", `${y}px`);
}


function animateOverlayLetter(letter, contentText, finalPos, isReceived) {
  removePoolLetter(letter);
  const initPos = letter.getBoundingClientRect();
  const overlayLetter = createOverlayLetter(letter.dataset.letter);

  if (isReceived) {
    setElPos(overlayLetter, initPos.left, initPos.top);
  } else {
    setElPosFromRight(overlayLetter, window.innerWidth - initPos.right, initPos.top);
  }

  LETTER_OVERLAY.appendChild(overlayLetter);

  setTimeout(() => {
    if (isReceived) {
      setElPos(overlayLetter, finalPos.left, finalPos.top);
    } else {
      setElPosFromRight(overlayLetter, window.innerWidth - finalPos.right, finalPos.top);
    }

    setTimeout(() => {
      removeClass(contentText, "invisible");
      addClass(overlayLetter, "invisible");

      setTimeout(() => {
        removeChild(LETTER_OVERLAY, overlayLetter);
      }, 1000);

    }, 1500);

  }, 100);
}

function animateMessageLetters(message, isReceived) {
  const content = message.getElementsByClassName("content")[0];
  const contentText = content.getElementsByClassName("text")[0];
  const letters = contentText.childNodes;
  const textPos = contentText.getBoundingClientRect();

  for (let i = 0; i < letters.length; i++) {
    const letter = letters[i];
    const targetLetter = findLetterInPool(letter.dataset.letter);
    const finalPos = letter.getBoundingClientRect();

    if (targetLetter) {
      animateOverlayLetter(targetLetter, contentText, finalPos, isReceived);
    } else {
      const tempLetter = createLetter("temp-letter", letter.dataset.letter);
      const pos = getRandPosOffScreen();

      addClass(tempLetter, "invisible");
      setElPos(tempLetter, pos.x, pos.y);
      TEMP_LETTER_POOL.appendChild(tempLetter);

      animateOverlayLetter(tempLetter, contentText, finalPos, isReceived);

      setTimeout(() => {
        removeChild(TEMP_LETTER_POOL, tempLetter);
      }, 100);
    }
  }
}

function addChatMessage(text, isReceived) {
  const message = createChatMessage(text, isReceived);
  const content = message.getElementsByClassName("content")[0];
  const contentText = content.getElementsByClassName("text")[0];
  const profileIcon = message.getElementsByClassName("profile-icon")[0];

  CHAT_MESSAGE_COLUMN.appendChild(message);
  toggleInput();

  setTimeout(() => {
    removeClass(profileIcon, "invisible");

    setTimeout(() => {
      removeClass(content, "invisible");

      setTimeout(() => {
        animateMessageLetters(message, isReceived);

        setTimeout(() => {
          replenishLetterPool(STATE.nLetterSets);
        }, 2500);

      }, 1000);

    }, 250);

  }, 250);
}

function checkIfInputFieldHasVal() {
  return MESSAGE_INPUT_FIELD.value.length > 0;
}

function clearInputField() {
  MESSAGE_INPUT_FIELD.value = "";
}

function disableInputField() {
  MESSAGE_INPUT_FIELD.blur();
  MESSAGE_INPUT_FIELD.value = "";
  MESSAGE_INPUT_FIELD.readOnly = true;
}
function enableInputField() {
  MESSAGE_INPUT_FIELD.readOnly = false;
  MESSAGE_INPUT_FIELD.focus();
}

function getChatbotMessageText() {
  if (STATE.chatbotMessageIndex === 0) {
    return getRandGreeting();
  } else {
    return getRandConvo();
  }
}

function sendChatbotMessage() {
  const text = getChatbotMessageText();
  STATE.isChatBotSendingMessage = true;
  addChatMessage(text, true);
  STATE.chatbotMessageIndex++;
  
  setTimeout(() => {
    STATE.isChatBotSendingMessage = false;
    toggleInput();
  }, 4000);
}

function sendUserMessage() {
  const text = MESSAGE_INPUT_FIELD.value;
  STATE.isUserSendingMessage = true;
  addChatMessage(text, false);

  setTimeout(() => {
    STATE.isUserSendingMessage = false;
    toggleInput();
  }, 4000);
}

function onEnterPress(e) {
  sendUserMessage();

  setTimeout(() => {
    sendChatbotMessage();
  }, 4000);

  toggleInput();
  clearInputField();
}

function initLetterPool() {
  clearLetterPool();
  fillLetterPool(STATE.nLetterSets);
}

function init() {
  setChatbotMood();
  initLetterPool();
  sendChatbotMessage();
  toggleInput();
  setMoodInterval(getRandMoodInterval());
}

let resetTimeout = null;

function resetLetterPool() {
  const intervals = STATE.letterPool.intervals;
  for (let i = 0; i < intervals.length; i++) {
    clearInterval(intervals[i]);
  }
  
  clearTimeout(resetTimeout);

  clearLetterPool();

  resetTimeout = setTimeout(() => {
    initLetterPool();
  }, 200);
}

function toggleInput() {
  if (checkIfInputFieldHasVal() && canSendMessage()) {
    addClass(MESSAGE_INPUT, "send-enabled");
  } else {
    removeClass(MESSAGE_INPUT, "send-enabled");
  }
}

function isValidLetter(e) {
  return (
    !e.ctrlKey &&
    e.key !== "Enter" &&
    e.keyCode !== 8 &&
    e.keyCode !== 9 &&
    e.keyCode !== 13
  );
}

function canSendMessage() {
  return !STATE.isUserSendingMessage && !STATE.isChatBotSendingMessage;
}

function getRandMoodInterval() {
  return getRand(20000, 40000);
}

let moodInterval = null;
function setMoodInterval(time) {
  moodInterval = setInterval(() => {
    clearInterval(moodInterval);
    setChatbotMood();
    setMoodInterval(getRandMoodInterval());
  }, time);
}

MESSAGE_INPUT_FIELD.onkeypress = function (e) {
  if (checkIfInputFieldHasVal() && e.key === "Enter") {
    removeClass(MESSAGE_INPUT, "send-enabled");
    if (canSendMessage()) {
      onEnterPress(e);
    }
  }
};

MESSAGE_INPUT_FIELD.onkeyup = function () {
  toggleInput();
};

MESSAGE_INPUT_FIELD.oncut = function () {
  toggleInput();
};

window.onload = function () {
  init();
};

window.onfocus = function () {
  resetLetterPool();
};

window.onresize = _.throttle(resetLetterPool, 200);

const greetings = {
  friendly: [
    "Hiya, pal. I hope you're having a terrific day!",
    "Good day to you, friend!"
  ],
  suspicious: [
    "Hmm, I would introduce myself, but I'm not so sure thats a good idea.",
    "Hello, how are you? Wait, don't answer that, I have no way of verifying your response!"
  ],
  boastful: [
    "Hey, did I mention I am built on JavaScript? Which is the greatest language ever by the way!",
    "Good day to you. Though I must say that I am having a GREAT day!"
  ]
};

const convo = {
  friendly: [
    "What a great thing you just said. I'm so glad you said it.",
    "Ahh, yes, I agree. It is so great to say things, isn't it?",
    "Please, tell me more. It brings me such joy to respond to the things you say.",
    "Ahh, yes valid point. Or was it? Either way, you're fantastic!",
    "Anyways, did I mention that I hope you're having a great day? If not, I hope it gets better!"
  ],
  suspicious: [
    "I just don't know if I can trust that thing you just said...",
    "Oh, interesting. I totally believe you. (Not really)",
    "Uh-huh, yeah, listen...I'm not going to fully invest in this conversation until I'm certain I know your motive.",
    "Wait, what the heck is that?? Oh, phewf, it's just another rogue letter 'R' that escaped the letter pool.",
    "You can't fool me, I know that's not true!"
  ],
  boastful: [
    "That's interesting. I'll have you know that I have an extremely advanced learning algorithm that analyzes everything you say...well, not really, but I wish.",
    "Hey, while I have you, I should probably tell you that I can respond in 4 seconds flat. Which is pretty fast if you ask me.",
    `Listen, that's neat and all, but look how fast I can calculate this math problem: 12345 * 67890 = ${
      12345 * 67890
    }. Didn't even break a sweat.`,
    "Oh, I forgot to mention that I've existed for over 100,000 seconds and that's something I'm quite proud of.",
    "Wow, thats pretty cool, but I can hold my breath for all of eternity. And it took me 0 seconds to gain that ability."
  ]
};
