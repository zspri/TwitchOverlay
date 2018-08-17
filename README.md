# TwitchOverlay

A custom Twitch IRC client built with Electron

![image](https://discord-is-down.party/MIIuECnN.png)

## Requirements

 - Node 8 or above
 - npm
 - Electron 2.0.4
 - Windows (x64)

## Installing

**Production:**
Download ./TwitchOverlay-win32-x64.zip, extract the files, and run TwitchOverlay.exe

**Development:**
```sh
git clone https://github.com/devakira/TwitchOverlay
cd TwitchOverlay
npm install
electron .
```

## Logging in

As of Sept. 17, 2013, Twitch now requires that you log into IRC using an OAuth token instead of your plaintext password or hash for additional security. To generate an oAuth token, go to https://twitchapps.com/tmi/, click `Connect with Twitch`, and copy the text in the box.
