const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;
const enteredValue = prompt("Maximum Life for you and the monster", "100");

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONGATTACK";

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let chosenMaxLife = parseInt(enteredValue);

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}

let currentMonsterHelath = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

let logEntries = [];

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, playerHealth, monsterHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalPlayerHealth: playerHealth,
    finalMonsterHealth: monsterHealth,
  };

  if ((ev = LOG_EVENT_PLAYER_ATTACK)) {
    logEntry.target = "Monster";
  } else if ((ev = LOG_EVENT_PLAYER_STRONG_ATTACK)) {
    logEntry.target = "Monster";
  } else if ((ev = LOG_EVENT_PLAYER_HEAL)) {
    logEntry.target = "Player";
  }

  logEntries.push(logEntry);
}

function reset() {
  currentMonsterHelath = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHelath = currentPlayerHealth;

  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;

  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHelath,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHelath;
    setPlayerHealth(initialPlayerHelath);
    alert("you would have been dead but the bonus life saved you!");
  }

  if (currentMonsterHelath <= 0 && currentPlayerHealth > 0) {
    alert("you won");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "player Won",
      currentMonsterHelath,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHelath > 0) {
    alert("you lost");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "Monster Won",
      currentMonsterHelath,
      currentPlayerHealth
    );
  } else if (currentMonsterHelath < 0 && currentPlayerHealth < 0) {
    alert("you have a draw");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "A Draw",
      currentMonsterHelath,
      currentPlayerHealth
    );
  }

  if (currentMonsterHelath <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  let logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;

  /*   if (mode == MODE_ATTACK) {
    maxDamage = ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_ATTACK;
  } else if (mode == MODE_STRONG_ATTACK) {
    maxDamage = STRONG_ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }
 */ const damage = dealMonsterDamage(maxDamage);
  currentMonsterHelath -= damage;
  writeToLog(logEvent, damage, currentMonsterHelath, currentPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - healValue) {
    alert("you can't heal to more than your max initial health");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHelath,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler() {
  console.log(logEntries);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healHandler);
logBtn.addEventListener("click", printLogHandler);
