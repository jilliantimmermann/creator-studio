import 'dotenv/config';

import { Client, Intents, MessageActionRow, MessageButton } from 'discord.js';
import { getRandomEmoji, DiscordRequest } from './utils.js';

// Gateway client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// custom IDs for interactions below (you could just pass strings if you wanted)
const Interactions = {
  START_BUTTON: 'start',
  DISMISS_BUTTON: 'dismiss',
};

// map games, including character name, channel IDs, etc.
let gameStates = {};

client.once('ready', () => {
  // Gateway connection is active
  console.log('Ready!');
});

// Handles application commands
client.on('interactionCreate', async (interaction) => {
  console.log('Interaction received: ', interaction);
  // Return if it's not a command
  if (!interaction.isCommand()) return;
  const { commandName, user } = interaction;

  if (commandName === 'game') {
    const characterName = interaction.options.getString('character');
    // Save their choice of character name
    gameStates[user.id] = {
      name: characterName,
    };

    // Button docs: https://discord.com/developers/docs/interactions/message-components#buttons
    // Implementation: https://discordjs.guide/interactions/buttons.html#building-and-sending-buttons
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(Interactions.START_BUTTON)
        .setLabel('Start Game')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(Interactions.DISMISS_BUTTON)
        .setLabel('Dismiss')
        .setStyle('SECONDARY')
    );

    // This is just a function in utils.js cause it's fun lol
    const randomEmoji = getRandomEmoji();
    const messageText = "Let's start playing! " + randomEmoji;

    // Responding to interactions docs: https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
    await interaction.reply({ content: messageText, components: [row] });
  }
});

// Handles buttons
client.on('interactionCreate', async (interaction) => {
  // Return if it's not a button
  if (!interaction.isButton()) return;

  const { customId, user } = interaction;

  if (customId === Interactions.START_BUTTON) {
    const characterName = gameStates[user.id].name;

    // Creates channel: https://discord.com/developers/docs/resources/guild#create-guild-channel
    const createChannelEndpoint = `/guilds/${process.env.GUILD_ID}/channels`;

    // Wrap in try/catch to handle any errors from the Discord API
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
    try {
      // The method is the REST API verb
      let guildResponse = await DiscordRequest(createChannelEndpoint, {
        method: 'POST',
        body: {
          name: `game-${characterName}`,
          type: 0,
          topic: `Test channel for ${characterName}`,
        },
      });
      guildResponse = await guildResponse.json();
      console.log('Channel Created: ', guildResponse);

      const gameChannelID = guildResponse.id;
      gameStates[user.id].channel = gameChannelID;

      // Empty components array removes buttons
      // Message formatting: https://discord.com/developers/docs/reference#message-formatting
      await interaction.update({
        content: `Game starting in <#${gameChannelID}>`,
        components: [],
      });

      // Create message in channel: https://discord.com/developers/docs/resources/channel#create-message
      const createMessageEndpoint = `/channels/${gameChannelID}/messages`;

      // Posts in new channel
      let msgResponse = await DiscordRequest(createMessageEndpoint, {
        method: 'POST',
        body: {
          content: 'Just startin a game in here',
        },
      });
      msgResponse = await msgResponse.json();

      console.log('Posted message: ', msgResponse);
    } catch (e) {
      console.log('Error starting game: ', e);
    }
  } else if (customId === Interactions.DISMISS_BUTTON) {
    await interaction.update({ content: 'No game 😔', components: [] });
  }
});

// Initiates connection to gateway
client.login(process.env.BOT_TOKEN);
