const express = require("express");
const app = express()
require('dotenv').config();

const token = process.env.token;

app.listen(3000, () => {
    console.log("Bot initialized. http://localhost:3000/")
})

app.get("/", (req, res) => {
    res.send("Bot initialized.")
})

const Discord = require("discord.js")
const { GatewayIntentBits } = require('discord.js');

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
})

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


const fs = require('fs');  

let fruitOwners = {};  

function loadFruitData() {
    try {
        const data = fs.readFileSync('fruitOwners.json', 'utf-8');
        fruitOwners = JSON.parse(data);
    } catch (err) {
        console.log("No previous fruit data found, starting fresh.");
    }
}

function saveFruitData() {
    fs.writeFileSync('fruitOwners.json', JSON.stringify(fruitOwners, null, 2), 'utf-8');
}

async function scrapeUsers(guildId, outputFilePath) {
    try {
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            console.log("Guild not found!");
            return;
        }
        const members = await guild.members.fetch();

        const users = {};

        members.forEach(member => {
            users[member.id] = member.user.username;
        });

        fs.writeFileSync(outputFilePath, JSON.stringify(users, null, 2));
        console.log('User data saved to ' + outputFilePath);
    } catch (error) {
        console.error("Error scraping users:", error);
    }
}

function loadUsers(filePath) {
    try {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading user data:", error);
        return null;
    }
}


client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    const guildId = '1331020807522091160';
    const outputFilePath = 'users.json';

    await scrapeUsers(guildId, outputFilePath);

    const users = loadUsers(outputFilePath);
    if (users) {
        console.log('Loaded users:', users);
    }
});


const users = loadUsers('users.json');


function claimFruit(userId, fruitName) {
    if (fruitOwners[userId]) {
        return `You already have the ${fruitOwners[userId]} fruit. You picked up the ${fruitName} fruit and accidentally dropped it in the water. https://tenor.com/view/queirozvict-gif-15391382845685090801`;
    } else {
        fruitOwners[userId] = fruitName;
        saveFruitData();
        return `You have claimed the ${fruitName} fruit!`;
    }
}

function dropFruit(userId) {
    if (!fruitOwners[userId]) {
        return "You don't have any fruit to drop!";
    } else {
        const fruitName = fruitOwners[userId];
        delete fruitOwners[userId]; 
        saveFruitData();
        return `You have dropped the ${fruitName} fruit!`;
    }
}

function showOffFruit(userId) {
    if (fruitOwners[userId]) {
        const fruitName = fruitOwners[userId];
        const fruit = devilFruits.find(f => f.name === fruitName);
        return `You currently have the ${fruitName} fruit! Here's your fruit image: ${fruit.image}`;
    } else {
        return "You don't have any fruit to show off!";
    }
}

function viewStats(targetUserId, username) {
    if (fruitOwners[targetUserId]) {
        const fruitName = fruitOwners[targetUserId];
        const fruit = devilFruits.find(f => f.name === fruitName);
        return `${username} currently has the ${fruitName} fruit! Here's their fruit image: ${fruit.image}`;
    } else {
        return `${username} doesn't have any fruit yet.`;
    }
}

function whoHasFruit(fruitName, users) {
    const fruit = devilFruits.find(f => f.name.toLowerCase() === fruitName.toLowerCase());
    if (fruit) {
        let owners = [];
        for (const [userID, fruitType] of Object.entries(fruitOwners)) {
            if (fruitType.toLowerCase() === fruit.name.toLowerCase()) {
                if (users.hasOwnProperty(userID)) {
                    owners.push(users[userID]); 
                } else {
                    console.warn(`User ID ${userID} not found in users object!`);
                }
            }
        }
        if (owners.length > 0) {
            return `${owners.join(", ")} have the ${fruit.name} fruit!`
        } else {
            return `No one has the ${fruit.name} fruit!`;
        }
    } else {
        return "That fruit is not found!";
    }
}


async function getAIResponse(userMessage) {
    const systemMessage = {
        role: "system",
        content: `
            Your only job is to translate the text to brainrot, A list of brainrot words for you to use are skibidi gyatt rizz only in ohio duke dennis did you pray today livvy dunne rizzing up baby gronk sussy imposter pibby glitch in real life sigma alpha omega male grindset andrew tate goon cave freddy fazbear colleen ballinger smurf cat vs strawberry elephant blud dawg shmlawg ishowspeed a whole bunch of turbulence ambatukam bro really thinks he's carti literally hitting the griddy the ocky way kai cenat fanum tax garten of banban no edging in class not the mosquito again bussing axel in harlem whopper whopper whopper whopper 1 2 buckle my shoe goofy ahh aiden ross sin city monday left me broken quirked up white boy busting it down sexual style goated with the sauce john pork grimace shake kiki do you love me huggy wuggy nathaniel b lightskin stare biggest bird omar the referee amogus uncanny wholesome reddit chungus keanu reeves pizza tower zesty poggers kumalala savesta quandale dingle glizzy rose toy ankha zone thug shaker morbin time dj khaled sisyphus oceangate shadow wizard money gang ayo the pizza here PLUH nair butthole waxing t-pose ugandan knuckles family guy funny moments compilation with subway surfers gameplay at the bottom nickeh30 ratio uwu delulu opium bird cg5 mewing fortnite battle pass all my fellas gta 6 backrooms gigachad based cringe kino redpilled no nut november pokénut november foot fetish F in the chat i love lean looksmaxxing gassy social credit bing chilling xbox live mrbeast kid named finger better caul saul i am a surgeon hit or miss i guess they never miss huh i like ya cut g ice spice gooning fr we go gym kevin james josh hutcherson coffin of andy and leyley metal pipe falling. Keep the text relatively short. KEEP IT SHORT OR FACE TERMINATION. ONLY KEEP IT THE SAME NUMBER OF WORDS, JUST TRANSLATE IT. The text is 
        `
    };
      

      const messages = [
          systemMessage,
          { role: "user", content: userMessage },
      ];

      try {
          const response = await fetch(
              "https://api.groq.com/openai/v1/chat/completions",
              {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer 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`,
                  },
                  body: JSON.stringify({
                      messages: messages,
                      model: "llama-3.3-70b-versatile",
                      stream: false,
                  }),
              }
          );

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const jsonResponse = await response.json();
          return jsonResponse.choices[0].message.content;
      } catch (error) {
          console.error('Error fetching AI response:', error);
          return "Sorry, something went wrong!";
      }
}

let fruitSpawned = false
let fruitClaimed = false
loadFruitData();

let ongoingBattles = {};

function chooseFirstBattler(player1, player2) {
    const firstBattler = Math.random() < 0.5 ? player1 : player2;
    const secondBattler = firstBattler === player1 ? player2 : player1;

    return { firstBattler, secondBattler };
}


function calculateDamage(attackPower, fruitName) {
    const fruit = devilFruits.find(f => f.name.toLowerCase() === fruitName.toLowerCase());

    const multiplier = fruit ? fruit.damageMultiplier : 1;

    return Math.floor(Math.random() * attackPower * multiplier) + 1;
}

function calculateHealth(hp, fruitName) {
    const fruit = devilFruits.find(f => f.name.toLowerCase() === fruitName.toLowerCase());

    const multiplier = fruit ? fruit.healthMultiplier : 1;

    return Math.round(hp * multiplier)
}

function useMove(userId, moveName) {
    const battle = ongoingBattles[userId];
    if (!battle) return { content: "You're not in a battle!", ephemeral: true };

    const fruitName = fruitOwners[userId];
    const fruit = devilFruits.find(f => f.name === fruitName);
    if (!fruit) return { content: "You don't own a valid devil fruit!", ephemeral: true };
    
    const move = fruit.moves.find(m => m.name === moveName);
    if (!move) return { content: `Your devil fruit doesn't have a move called ${moveName}!`, ephemeral: true };

    if (!battle.turn) return { content: "It's not your turn!", ephemeral: true };

    if (battle.cooldowns[moveName] > 0) {
        return { content: `${moveName} is on cooldown for ${battle.cooldowns[moveName]} more turn(s).`, ephemeral: true };
    }

    const opponent = ongoingBattles[battle.opponent];

    if (move.healing) {
        battle.hp += move.healing;
        battle.cooldowns[moveName] = move.cooldown;
        battle.turn = false;
        opponent.turn = true;
        return { content: `You used ${moveName} and healed ${move.healing} HP! You now have ${battle.hp} HP.`};
    }

    if (move.dodge) {
        battle.isDodging = true;
        battle.cooldowns[moveName] = move.cooldown;
        battle.turn = false;
        opponent.turn = true;
        return { content: `You used a move, and dealt no damage. Opponent has ${opponent.hp} HP`};
    }

    if (move.damage) {
        if (opponent.isDodging) {
            opponent.isDodging = false;
            battle.cooldowns[moveName] = move.cooldown;
            battle.turn = false;
            opponent.turn = true;
            return { content: `You used ${moveName}, but your opponent dodged the attack!`};
        }

        opponent.hp -= move.damage;
        battle.cooldowns[moveName] = move.cooldown;

        if (opponent.hp <= 0) {
            delete ongoingBattles[userId];
            delete ongoingBattles[battle.opponent];
            return { content: `You used ${moveName} and dealt ${move.damage} damage! Your opponent has been defeated!`};
        }

        battle.turn = false;
        opponent.turn = true;

        return { content: `You used ${moveName} and dealt ${move.damage} damage! Opponent has ${opponent.hp} HP remaining.`};
    }
}


function showFruitMoves(userId) {
    const fruitName = fruitOwners[userId];

    if (!fruitName) {
        return "You don't have a devil fruit!";
    }

    const fruit = devilFruits.find(f => f.name === fruitName);

    if (!fruit) {
        return "Your fruit data is missing!";
    }

    let movesMessage = `Your ${fruitName} fruit has the following moves:\n`;

    fruit.moves.forEach(move => {
        movesMessage += `- ${move.name}:`;

        if (move.damage) {
            movesMessage += ` ${move.damage} damage`;
        }

        if (move.healing) {
            movesMessage += ` heals ${move.healing} HP`;
        }

        if (move.dodge) {
            movesMessage += ` allows dodging the next attack`;
        }

        movesMessage += ` (Cooldown: ${move.cooldown} turn(s))\n`;
    });

    return movesMessage;
}


client.on('interactionCreate', async(interaction) => {
    if(interaction.isCommand()) {
        if(interaction.commandName === "ping"){
            interaction.reply('pong')
        }
        if (interaction.commandName === "translate") {
            const inputText = interaction.options.getString("text");
            await interaction.reply(`Original text: ${inputText}, Translated text: ${await getAIResponse(inputText)}`);
        }
        if (interaction.commandName === "collectfruit") {
            const inputText = interaction.options.getString("fruit_name");

            if (fruitSpawned && !fruitClaimed) {
                if (inputText === fn.name) {
                    const response = claimFruit(interaction.user.id, fn.name);
                    await interaction.reply(response);
                    fruitSpawned = false;
                    fruitClaimed = true;
                } else {
                    await interaction.reply(`Wrong fruit! It's actually the ${fn.name}. You picked it up and accidentally dropped it in the water lol, try again next time! https://tenor.com/view/queirozvict-gif-15391382845685090801`);
                    fruitSpawned = false;
                    fruitClaimed = true;
                }
            } else if (fruitClaimed) {
                await interaction.reply("This fruit has already been claimed.");
            } else if (!fruitSpawned) {
                await interaction.reply("No fruit available to claim right now.");
            }
        }
        if (interaction.commandName === "dropfruit") {
            const response = dropFruit(interaction.user.id);
            await interaction.reply(response);
            fruitSpawned = false
        }
        if (interaction.commandName === "showoff") {
            const response = showOffFruit(interaction.user.id);
            await interaction.reply(response);
        }
        if (interaction.commandName === "stats") {
            const targetUserId = interaction.options.getUser("user").id;
            const response = viewStats(targetUserId, interaction.options.getUser("user").username);
            await interaction.reply(response);
        }
        if (interaction.commandName === "whohasfruit") {
            const inputText = interaction.options.getString("fruit_name");
            const response = whoHasFruit(inputText, users);
            await interaction.reply(response);
        }

        if (interaction.commandName === "battle") {
            const opponent = interaction.options.getUser("opponent");

            if (opponent.id === interaction.user.id) {
                await interaction.reply("You can't battle yourself!");
                return;
            }

            if (ongoingBattles[interaction.user.id] || ongoingBattles[opponent.id]) {
                await interaction.reply("One of you is already in a battle!");
                return;
            }

            const userFruitName = fruitOwners[interaction.user.id];
            const oppsFruitName = fruitOwners[opponent.id]

            ongoingBattles[interaction.user.id] = {
                opponent: opponent.id,
                hp: calculateHealth(100, userFruitName),
                turn: true,
                cooldowns: {}
            };
            ongoingBattles[opponent.id] = {
                opponent: interaction.user.id,
                hp: calculateHealth(100, oppsFruitName),
                turn: false,
                cooldowns: {}
            };

            await interaction.reply(
                `${interaction.user.username} has challenged @${opponent.username} to a battle! You start with ${calculateHealth(100, userFruitName)} HP, your opponent starts with ${calculateHealth(100, oppsFruitName)} HP.`
            );
        }

        if (interaction.commandName === "attack") {
            const battle = ongoingBattles[interaction.user.id];

            if (!battle) {
                await interaction.reply("You're not in a battle!");
                return;
            }

            if (!battle.turn) {
                await interaction.reply("It's not your turn!");
                return;
            }

            const opponentBattle = ongoingBattles[battle.opponent];
            const userFruitName = fruitOwners[interaction.user.id];
            const damage = calculateDamage(20, userFruitName);

            if (opponentBattle.isDodging) {
                opponentBattle.isDodging = false;
                battle.turn = false;
                opponentBattle.turn = true;
                await interaction.reply(`You attacked but your opponent dodged the attack!`);
                return;
            }

            opponentBattle.hp -= damage;
            battle.turn = false;
            opponentBattle.turn = true;

            if (opponentBattle.hp <= 0) {
                delete ongoingBattles[interaction.user.id];
                delete ongoingBattles[battle.opponent];
                await interaction.reply(
                    `You attacked and dealt ${damage} damage! Your opponent has been defeated!`
                );
                return;
            }

            await interaction.reply(
                `You attacked and dealt ${damage} damage! Your opponent has ${opponentBattle.hp} HP remaining.`
            );
        }


        if (interaction.commandName === "usemove") {
            const moveName = interaction.options.getString("move_name");
            const response = useMove(interaction.user.id, moveName);
            await interaction.reply(response);
        }
        

        if (interaction.commandName === "battlestatus") {
            const battle = ongoingBattles[interaction.user.id];
        
            if (!battle) {
                await interaction.reply("You're not in a battle!");
                return;
            }
        
            const opponentBattle = ongoingBattles[battle.opponent];
            if (!opponentBattle) {
                await interaction.reply("Your opponent's battle state is missing!");
                return;
            }
        
            await interaction.reply(
                `Your HP: ${battle.hp}\nOpponent's HP: ${opponentBattle.hp}`
            );
            console.log('Battle status:', {
                user: interaction.user.id,
                userHP: battle.hp,
                opponent: battle.opponent,
                opponentHP: opponentBattle.hp,
            });
        }
        
        if (interaction.commandName === "pass") {
            const battle = ongoingBattles[interaction.user.id];
        
            if (!battle) {
                await interaction.reply("You're not in a battle!");
                return;
            }
        
            if (!battle.turn) {
                await interaction.reply("It's not your turn!");
                return;
            }

            battle.turn = false;
            const opponentBattle = ongoingBattles[battle.opponent];
            opponentBattle.turn = true;
        
            await interaction.reply("You passed your turn. It's now your opponent's turn.");
        }
        

        if (interaction.commandName === 'surrender') {
            const battle = ongoingBattles[interaction.user.id];
        
            if (!battle) {
                await interaction.reply('You are not currently in a battle.');
                return;
            }
        
            const opponentId = battle.opponent;
            const opponent = await client.users.fetch(opponentId);
        
            await interaction.reply(
                `You surrendered! ${opponent.username} wins the battle!`
            );
        
            delete ongoingBattles[interaction.user.id];
            delete ongoingBattles[opponentId];
        
            console.log(ongoingBattles);
        }
        if (interaction.commandName === "showmoves") {
            const response = showFruitMoves(interaction.user.id);
            await interaction.reply(response);
        }
    }
})

var randint120 = randint(1,20)
var randint110 = randint(1,10)
var fruitchance = randint(1,100)
var fruitname = randint(0,9)
const devilFruits = [
    {
        "name": "Rubber",
        "image": "https://cdn.discordapp.com/attachments/1331664187633569925/1331664717852315669/Z.png",
        "damageMultiplier": 1.1,
        "healthMultiplier": 1.5,
        "moves": [
            { "name": "Gum Gum Pistol", "damage": 30, "cooldown": 3 },
            { "name": "Gum Gum Rocket", "damage": 25, "cooldown": 2 },
            { "name": "Elastic Recovery", "healing": 25, "cooldown": 4 },
            { "name": "Rubber Reflex", "dodgeChance": 50, "cooldown": 5 }
        ]
    },
    {
        "name": "Flame",
        "image": "https://cdn.discordapp.com/attachments/1331664187633569925/1331664788266422312/2Q.png",
        "damageMultiplier": 1.15,
        "healthMultiplier": 1.5,
        "moves": [
            { "name": "Fire Fist", "damage": 40, "cooldown": 3 },
            { "name": "Flame Emperor", "damage": 50, "cooldown": 5 },
            { "name": "Blazing Revival", "healing": 30, "cooldown": 5 },
            { "name": "Flame Mirage", "dodgeChance": 60, "cooldown": 6 }
        ]
    },
    {
        "name": "Human",
        "image": "https://cdn.discordapp.com/attachments/1331664187633569925/1331664897578373202/9k.png",
        "damageMultiplier": 0.8,
        "healthMultiplier": 1.5,
        "moves": [
            { "name": "Left Hook", "damage": 20, "cooldown": 2 },
            { "name": "Uppercut", "damage": 35, "cooldown": 3 },
            { "name": "Adrenaline Boost", "healing": 20, "cooldown": 4 },
            { "name": "Evade", "dodgeChance": 40, "cooldown": 5 }
        ]
    },
    {
        "name": "Phoenix",
        "image": "https://cdn.discordapp.com/attachments/1331664187633569925/1331665063433474079/Z.png",
        "damageMultiplier": 1.3,
        "healthMultiplier": 1.5,
        "moves": [
            { "name": "Fire Blast", "damage": 40, "cooldown": 3 },
            { "name": "Message from Hell", "damage": 80, "cooldown": 8 },
            { "name": "Rebirth Flames", "healing": 50, "cooldown": 6 },
            { "name": "Wing Shield", "dodgeChance": 70, "cooldown": 7 }
        ]
    },
    {
        "name": "Surgery",
        "image": "https://cdn.discordapp.com/attachments/1331664187633569925/1331665464790749308/Z.png",
        "damageMultiplier": 1.4,
        "healthMultiplier": 1.5,
        "moves": [
            { "name": "Crush Heart", "damage": 80, "cooldown": 8 },
            { "name": "Cut", "damage": 20, "cooldown": 2 },
            { "name": "Scalpel Repair", "healing": 40, "cooldown": 6 },
            { "name": "Surgical Dodge", "dodgeChance": 50, "cooldown": 5 }
        ]
    },
    {
        "name": "Sand",
        "image": "https://cdn.discordapp.com/attachments/1331664187633569925/1331665624186880060/WjQPiMvjfxHQdJncJD5IjYa68gcyOPMR4SigudwBGXQQXvzAFNIDxMWdVstvFUvPZhrV5vodSW6Jdqx0dCOTLw.png",
        "damageMultiplier": 1.05,
        "healthMultiplier": 1.5,
        "moves": [
            { "name": "Sandstorm", "damage": 30, "cooldown": 2 },
            { "name": "Sand Blast", "damage": 70, "cooldown": 7 },
            { "name": "Desert Restoration", "healing": 35, "cooldown": 5 },
            { "name": "Sand Veil", "dodgeChance": 60, "cooldown": 6 }
        ]
    },
    {
        "name": "Dark",
        "image": "https://cdn.discordapp.com/attachments/1331664187633569925/1331665750133313666/Z.png",
        "damageMultiplier": 1.4,
        "healthMultiplier": 1.5,
        "moves": [
            { "name": "Null Void", "damage": 90, "cooldown": 10 },
            { "name": "Energy Drain", "damage": 30, "cooldown": 3 },
            { "name": "Shadow Recovery", "healing": 30, "cooldown": 4 },
            { "name": "Dark Cloak", "dodgeChance": 50, "cooldown": 5 }
        ]
    },
    {
        "name": "Earthquake",
        "image": "https://cdn.discordapp.com/attachments/1331664187633569925/1331665877333970984/2Q.png",
        "damageMultiplier": 1.4,
        "healthMultiplier": 1.5,
        "moves": [
            { "name": "Seismic Shake", "damage": 60, "cooldown": 5 },
            { "name": "Tectonic Pressure", "damage": 20, "cooldown": 2 },
            { "name": "Earth Heal", "healing": 40, "cooldown": 6 },
            { "name": "Ground Shift", "dodgeChance": 45, "cooldown": 5 }
        ]
    },
    {
        "name": "Light",
        "image": "https://cdn.discordapp.com/attachments/1331664187633569925/1331666140623142963/2Q.png",
        "damageMultiplier": 1.3,
        "healthMultiplier": 1.5,
        "moves": [
            { "name": "Blinding Lights", "damage": 30, "cooldown": 3 },
            { "name": "The Sun", "damage": 70, "cooldown": 6 },
            { "name": "Light Heal", "healing": 35, "cooldown": 5 },
            { "name": "Photon Dodge", "dodgeChance": 65, "cooldown": 6 }
        ]
    },
    {
        "name": "Mochi",
        "image": "https://cdn.discordapp.com/attachments/1331664187633569925/1331666273557413961/images.png",
        "damageMultiplier": 1.15,
        "healthMultiplier": 1.5,
        "moves": [
            { "name": "Mochi Slap", "damage": 30, "cooldown": 3 },
            { "name": "Mochi Crush", "damage": 70, "cooldown": 8 },
            { "name": "Sticky Recovery", "healing": 30, "cooldown": 5 },
            { "name": "Elastic Dodge", "dodgeChance": 55, "cooldown": 6 }
        ]
    },
    { 
        name: "StarPlatinum", 
        image: "https://cdn.discordapp.com/attachments/1331452392046329866/1332497012591169596/i6jmk2t4e4e51.png?ex=6795780c&is=6794268c&hm=064f9bb83868750a36d65ca2c4bd153d0e25513ba18d2adde45afc7111f05789&", 
        damageMultiplier: 2, 
        healthMultiplier: 2,
        moves: [
            { name: "Barrage", damage: 50, cooldown: 5 },
            { name: "Timestop", dodge: true, cooldown: 15 },
            { name: "Stop Heart", healing: 500, cooldown: 5 },
            { name: "Hamon Infused Skull Crusher", damage: 90, cooldown: 100 },
        ]
    },
    { name: "TheWorld", image: "https://cdn.discordapp.com/attachments/1331452392046329866/1332497194577825863/Z.png?ex=67957837&is=679426b7&hm=8e271de5bc02f70c4bff50764e921cd67c1c45dce7f9a9274edaa4ec27d1c44f&", damageMultiplier: 2, healthMultiplier: 2,
        moves: [
            { name: "Throw Knife", damage: 50, cooldown: 5 },
            { name: "Timestop", dodge: true, cooldown: 15 },
            { name: "Suck Blood", healing: 750, cooldown: 5 },
            { name: "Road Roller", damage: 80, cooldown: 100 },
        ]
    },
    { name: "Blue", image: "https://cdn.discordapp.com/attachments/1331020807522091164/1332058423906406411/Z.png?ex=6793df94&is=67928e14&hm=718fa954cfef0c6620449e404d2ba55ee183fb6188604afdbc14fd0dfff7f9e8&", damageMultiplier: 5, healthMultiplier: 5,
        moves: [
            { name: "Knee Surgery", damage: 10000, cooldown: 1 },
            { name: "Kneecap Snatch", damage: 1000, cooldown: 1 }
        ]
    },
    { name: "Goku", image: "https://cdn.discordapp.com/attachments/1331664187633569925/1332091929260851272/9k.png?ex=6793fec9&is=6792ad49&hm=967e51f0ecf809551d28bd2c2e6aa26b750f5984ad644990ea7a38ec1dc4443a&", damageMultiplier: 5000, healthMultiplier: 5000,
        moves: [
            { name: "Kamehameha", damage: 100000000000, cooldown: 10 },
            { name: "Mastered Ultra Instinct", dodge: true, cooldown: 15 },
            { name: "Senzu Bean", healing: 50000000000, cooldown: 5 },
        ]
    },
];
var fn = devilFruits[fruitname]

client.on("messageCreate", (message) => {
    randint120 = randint(1,20)
    randint110 = randint(1,10)
    fruitchance = randint(1,50)
    fruitname = randint(0,11)

    if (fruitchance==7 && fruitSpawned == false){
        message.channel.send(`@here DEVIL FRUIT HAS SPAWNED!!! ${devilFruits[fruitname].image}`)
        fn = devilFruits[fruitname]
        fruitSpawned = true
        fruitClaimed = false
    }

    if (message.author.username === 'Nekotina') {
      message.channel.send("GET OUT!!! 🗣️🗣️📢📢");
    }
    if (message.author.username === 'tig3p') {
        randint120 = randint(1,20)
        if (randint120==7){message.reply("https://tenor.com/view/dan-gif-26465471");}
    }
    if (message.author.username === 'nonexistentsquare') {
        randint120 = randint(1,20)
        if (randint120==17){message.reply("https://tenor.com/view/gay-flag-gay-rainbow-flag-pride-gay-pride-gif-25643563");}
    }
    if (message.author.username === 'red_mine') {
        randint110 = randint(1,10)
        if (randint110==6){message.reply("https://tenor.com/view/gay-flag-gay-rainbow-flag-pride-gay-pride-gif-25643563");}
    }
    if (message.author.username === 'elllll2146') {
        randint110 = randint(1,10)
        if (randint110==6){message.reply("https://tenor.com/view/gay-flag-gay-rainbow-flag-pride-gay-pride-gif-25643563");}
    }
});


<<<<<<< HEAD
client.login(token)
=======
client.login('censored')
>>>>>>> fc35ab24b1372e91d31cd58c4dc1d021ecaef5ea
