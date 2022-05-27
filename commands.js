import 'dotenv/config';

import { DiscordRequest } from './utils.js';

// Command payloads
// See https://discord.com/developers/docs/interactions/application-commands#application-command-object
const TEST_COMMAND = {
  name: 'test',
  description: 'Just testing how commands work',
  type: 1,
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
      required: 'true',
    },
  ],
  type: 1,
};

// ...commands is arbitrary # of commands https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
async function installCommands(...commands) {
  // Create command: https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
  const installCommandEndpoint = `/applications/${process.env.APP_ID}/commands`;

  for (let c of commands) {
    // install command
    try {
      await DiscordRequest(installCommandEndpoint, {
        method: 'POST',
        body: c,
      });
      console.log(`${c.name} command installed`);
    } catch (err) {
      console.error('Error installing command: ', err);
    }
  }
}

// Pass in whatever commands you want to install
installCommands(TEST_COMMAND, GAME_COMMAND);
