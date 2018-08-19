# TwitchOverlay

A custom Twitch IRC client built with Electron

![image](https://discord-is-down.party/MIIuECnN.png)

## Requirements

 - Windows (64-bit)

### Dev requirements

- Node 8 or above
- Electron 2.0.4
- electron-builder

## Installing

### Production (regular users)

Go to the [releases](https://github.com/devakira/TwitchOverlay/releases) page and download 'TwitchOverlay (version).exe'

### Development

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
