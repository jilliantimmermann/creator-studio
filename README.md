
## Project structure
A basic overview of the project structure:

```
├── .env.sample -> sample .env file for credentials
├── app.js      -> main entrypoint for app—handles events and interactions
├── commands.js -> slash command payloads + installation
├── utils.js    -> utility functions
├── package.json
├── README.md
└── .gitignore
```

## App setup

1. Go to [developer dashboard](https://discord.com/developers/applications) and click **New Application** in the top-right corner. Add a name and click **Create**.
2. On the left sidebar, click **Bot** then **Add Bot**. Feel free to modify anything like the name/description/image.
3. Click **Reset Token**, then copy that token somewhere safe (you'll need it later and can only see it once).
4. On the left sidebar, click **OAuth2**, then click **URL Generator**.
5. In the URL generator, select `applications.commands` and `bot`. For the `bot` portion, click anything you might need the bot to do. Probably **Send Messages** and **Manage Channels** at least.
6. Copy the generated URL and paste it in a new tab, then follow the install flow.

## Project setup

```
git clone https://github.com/shaydewael/creator-studio.git

cd creator-studio

npm install
```

### Add credentials

Credentials are stored in `.env`. You can rename `.sample.env` to `.env` and add credentials there. **Make sure to keep your credentials private as they have all the permissions of your app**

> The `.gitignore` file includes `.env` from default which will prevent your credentials from being checked into source control. But double and triple check it's not being added.

1. Add bot token from the **App Setup** section above
2. Go back to the your app in the developer dashboard. We're gonna copy the other credentials the app needs. Save these all locally (they'll be in your project):
  - On **General Information** copy the App ID
  - On **OAuth2**, copy the Client ID
  - To get Guild ID, you can copy the first number in the URL when visiting your development server in the browser

### To install commands

`commands.js` defines the different [application commands](https://discord.com/developers/docs/interactions/application-commands#application-command-object
) the app uses, and installs them to the guild.

You only need to run this once for your app to install the commands. If you make an update to the command, you'll need to rerun it.

```
node commands.js
```

### To run app

When developing (this will refresh your app when changes are made):

```
npm run dev
```

When/if in production:

```
node app.js
```

## Helpful resources

- [MDN JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Discord.js guide](https://discordjs.guide/#before-you-begin)
- [Discord API documentation](https://discord.com/developers/docs/intro). The **Resources** sections have most of the API methods listed
- [Discord.js documentation](https://discord.js.org/#/docs/main/stable/general/welcome)
- [Getting Started Guide](https://discord.com/developers/docs/getting-started) which doesn't use `discord.js`, but it may be helpful to guide through setting up the app.
