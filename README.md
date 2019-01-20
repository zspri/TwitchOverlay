# TwitchOverlay

A custom Twitch chat client built with Electron with a built-in stream player.

![image](https://cdn.discordapp.com/attachments/376375897109954560/536553108747321354/unknown.png)

## Requirements

 - Windows (64-bit)

## Installing

Go to the [releases](https://github.com/devakira/TwitchOverlay/releases) page and download 'TwitchOverlay (version).exe' to use the production build.

### Development Build

#### Dev requirements

- Node 10 or above
- Electron 4
- electron-builder

```sh
git clone https://github.com/devakira/TwitchOverlay
cd TwitchOverlay
npm install
electron .
```

## Logging in

As of Sept. 17, 2013, Twitch now requires that you log into IRC using an OAuth token instead of your plaintext password or hash for additional security. To generate an oAuth token, go to https://twitchapps.com/tmi/, click `Connect with Twitch`, and copy the text in the box.

## Building

```sh
npm install
electron-builder --windows portable
```

This will generate an executable at `./dist/TwitchOverlay (version).exe`.
