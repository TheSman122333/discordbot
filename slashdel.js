const { REST, Routes } = require('discord.js');
require('dotenv').config();

const token = process.env.token;

const clientId = "1331311609607360674"
const guildId = "1331020807522091160"
const botToken = token


const rest = new REST().setToken(botToken);

// for guild-based commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);
