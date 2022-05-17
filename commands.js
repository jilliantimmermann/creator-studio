import 'dotenv/config'

import { restClient } from './app.js';
import { Routes } from 'discord-api-types/v10';

// Command payloads
// See https://discord.com/developers/docs/interactions/application-commands#application-command-object
const TEST_COMMAND = {
  name: 'test',
  description: 'Just testing how commands work',
  type: 1
};

// Options docs: https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
const GAME_COMMAND = {
  name: 'game',
  description: 'Start game',
  options: [
    {
      type: 3,
      name: 'character',
      value: 'character',
      description: 'Enter the name of your character',
      required: 'true'
    }
  ],
  type: 1
};

// Register all commands
restClient
  .put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: [TEST_COMMAND, GAME_COMMAND] }
  )
  .then(() => console.log('Successfully registered commands'))
  .catch(console.error);
