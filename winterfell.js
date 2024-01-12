let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let enemyHealth;
let inventory = ["Knife"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const enemyName = document.querySelector("#enemyName");
const enemyHealthText = document.querySelector("#enemyHealth");

const enemies = [
  {
    name: "Wildlings",
    level: 2,
    health: 15
  },
  {
    name: "Whitewalkers",
    level: 8,
    health: 60
  },
  {
    name: "Night King",
    level: 20,
    health: 300
  }
];

const weapons = [
  {
    name: "Knife",
    power: 5
  },
  {
    name: "Sword",
    power: 30
  },
  {
    name: "Cross Bow",
    power: 50
  },
  {
    name: "Dragon Glass",
    power: 100
  }
];

const locations = [
  {
    name: "Winterfell",
    "button text": ["Shop", "Go beyond wall", "Fight night king"],
    "button functions": [goToShop, goBeyondWall, fightNightKing],
    text: "You are in the Winterfell"
  },

  {
    name: "Shop",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to Winterfell"],
    "button functions": [buyHealth, buyWeapon, goToWinterfell],
    text: "You entered the shop."
  },

  {
    name: 'Beyond the wall',
    "button text": ['Fight Wildlings','Fight White Walkers','Go to Winterfell'],
    "button functions": [fightWildlings,fightWhitewalkers,goToWinterfell],
    text: 'You are now beyond the wall, aware of Wildlings, Giants and Whitewalkers!!'
  },

  {
    name: "fight",
    "button text": ["Attack", "Defend", "Run"],
    "button functions": [attack, defend, goToWinterfell],
    text: "You are fighting a monster."
  },

  {
    name: "kill monster",
    "button text": ["Go to Winterfell", "Go to Winterfell", "Go to Winterfell"],
    "button functions": [goToWinterfell, goToWinterfell, goToWinterfell],
    text: "The enemy screams \'Arg!\' as it dies. You gain experience points and find gold."
  },

  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You died. ☠️"
  },

  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You Won🎉🎉!!.. You Defeated the Night king!!"
  }
];

// initialize buttons
// button1.onclick = goToShop;
// button2.onclick = goBeyondWall;
// button3.onclick = fightNightKing;

//button functions
function update(location){
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
}

function goToWinterfell() {
  update(locations[0]);
  button2.style.visibility = "visible";
  button3.style.visibility = "visible";
  }

function goToShop() {
  update(locations[1]);
  }
  
function goBeyondWall() {
  update(locations[2]);
}

//functions inside goToShop()
function buyHealth(){
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}
function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  }
  else{
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let oldWeapon = inventory.shift();
    text.innerText = "You sold a " + oldWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  }
  else{
    text.innerText = "Don't sell your only weapon!";
  }
}

function goFight(){
  update(locations[3]);
  enemyHealth = enemies[fighting]['health'];
  monsterStats.style.display = 'block';
  enemyName.innerText = enemies[fighting]['name'];
  enemyHealthText.innerText = enemyHealth;
}
function fightWildlings(){
  fighting = 0;
  goFight();
}
function fightWhitewalkers(){
  fighting = 1;
  goFight();
}
function fightNightKing() {
  fighting = 2;
  goFight();
}

function getEnemyAttackValue(level){
  const hit = (level*5) - (Math.floor(Math.random() * xp ));
  return (hit>0) ? hit : 0;
}

function attack(){
  document.querySelector("#game").style.backgroundColor = "#caffbf";
  timeFunc();
  text.innerText = "The " + enemies[fighting].name + " attacks.";
  text.innerText += " You attack it with your "+weapons[currentWeapon].name+".";
  health -= getEnemyAttackValue(enemies[fighting].level);
  if (isEnemyHit()) {
    enemyHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  }else{
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  enemyHealthText.innerText = enemyHealth;
  if(health <= 0){
    healthText.innerText = 0;
    lose();
  }
  else if(enemyHealth <= 0){
    (fighting === 2) ? winGame() : defeatEnemy();
  }
}

function defend() {
  text.innerText = "You dodge the attack from the "+enemies[fighting].name;
}

function isEnemyHit(){
  return Math.random() > 0.2 || health<20;
}

//win or lose
function defeatEnemy(){
  button2.style.visibility = "hidden";
  button3.style.visibility = "hidden";
  gold += Math.floor(enemies[fighting].level * 6.7);
  xp += enemies[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
  }

function lose(){
  button2.style.visibility = "hidden";
  button3.style.visibility = "hidden";
  update(locations[5]);
}

function winGame(){
  update(locations[6]);
}

function restart(){
  button2.style.visibility = "visible";
  button3.style.visibility = "visible";
  xp = 0, health = 100, gold = 50;
  currentWeapon = 0;
  inventory = ["Knife"];
  xpText.innerText = xp;
  goldText.innerText = gold;
  healthText.innerText = health;
  goToWinterfell();
}

let timeout;

function timeFunc(){
  timeout = setTimeout(changeBg,100);
}

function changeBg(){
  document.querySelector("#game").style.backgroundColor = "#cb997e";
}