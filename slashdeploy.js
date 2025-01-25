const { REST, Routes } = require("discord.js")

require('dotenv').config();

const token = process.env.token;

const botID = "1331311609607360674"
const serverID = "1331020807522091160"
<<<<<<< HEAD
const botToken = token
=======
const botToken = "censored"

>>>>>>> fc35ab24b1372e91d31cd58c4dc1d021ecaef5ea
const rest = new REST().setToken(botToken)
const slashRegister = async () =>{
    try{
        await rest.put(Routes.applicationGuildCommands(botID, serverID), {
            body: [
                {
                    name: "ping",
                    description:"returns pong",

                },
                {
                    name: "translate",
                    description:"translates to brainrot",
                    options: [
                        {
                            type: 3,
                            name: "text",
                            description: "The text to translate",
                            required: true,
                        },
                    ],

                },
                {
                    name: "collectfruit",
                    description:"collects the fruit",
                    options: [
                        {
                            type: 3,
                            name: "fruit_name",
                            description: "The name of the fruit",
                            required: true,
                        },
                    ],

                },
                {
                    name: "dropfruit",
                    description:"drops any fruit you have",

                },
                {
                    name: "showoff",
                    description:"shows any fruit you have",

                },
                {
                    name: "stats",
                    description:"shows what fruit a user has",
                    options: [
                        {
                            type: 6,
                            name: "user",
                            description: "the user to check the fruit for",
                            required: true,
                        },
                        {
                            type: 3,
                            name: "fruit_name",
                            description: "the name of the fruit",
                            required: false, 
                        },
                    ],

                },
                {
                    name: "whohasfruit",
                    description:"takes fruit as input, finds user with fruit",
                    options: [
                        {
                            type: 3,
                            name: "fruit_name",
                            description: "The name of the fruit",
                            required: true,
                        },
                    ],

                },
                {
                    name: "battle",
                    description:"challenges user to battle.",
                    options: [
                        {
                            type: 6,
                            name: "opponent",
                            description: "the opp",
                            required: true,
                        },
                    ],

                },
                {
                    name: "attack",
                    description:"use this in batttle to attack",
                },
                {
                    name: "battlestatus",
                    description: "check your current battle status",
                },
                {
                    name: "surrender",
                    description: "surrender in battle",
                    options: [
                        {
                            type: 6,
                            name: "opponent",
                            description: "the opp",
                            required: true,
                        },
                    ],
                },
                {
                    name: "usemove",
                    description: "use a move in battle",
                    options: [
                        {
                            type: 3,
                            name: "move_name",
                            description: "the name of the move",
                            required: true,
                        },
                    ],
                },
                {
                    name: "showmoves",
                    description: "show moves"
                },
                {
                    name: "pass",
                    description: "skips move"
                },
            ]
        })
    } catch(error){
        console.log(error)
    }
}

slashRegister()
