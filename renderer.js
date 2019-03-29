const remote = require('electron').remote;
const tmi = require('tmi.js');
const sanitizer = require('sanitizer');
const DiscordRPC = require('discord-rpc');
var appSettings;
try {
    appSettings = require('./config.json');
} catch(e) {
    remote.getCurrentWindow().loadURL(`file://${__dirname}/login.html`);
}

DiscordRPC.register('536605206599958535');
const rpc = new DiscordRPC.Client({transport: 'ipc'});
const startTimestamp = new Date();

appSettings['channels'] = [`#${appSettings['channel']}`]

var client = new tmi.client(appSettings);

client.on("message", function(channel, userstate, message, self) {
    var badge = "";
    if (userstate['badges'] != null) {
        if ("broadcaster" in userstate['badges']) {
            badge = "<img class='badge' src='https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1'>";
        } else if (userstate['user-type'] == "mod" || userstate['mod'] === true) {
            badge = "<img class='badge' src='https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1'>";
        } if ("premium" in userstate['badges']) {
            badge += "<img class='badge' src='https://static-cdn.jtvnw.net/badges/v1/a1dd5073-19c3-4911-8cb4-c464a7bc1510/1'>";
        } if (userstate['subscriber'] === true) {
            badge += "<img class='badge' src='https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1'>";
        }
    }
    switch (userstate["message-type"]) {
        case "action":
            $(".msg-container").append(`<div class="msg" style="color:${userstate['color']}"><b>${badge} ${userstate['display-name']}</b> ${sanitizer.escape(message)}</div>`);
            $(".msg-container").scrollTop($(".msg-container")[0].scrollHeight);
            break;
        case "chat":
            $(".msg-container").append(`<div class="msg"><span class="author" style="color:${userstate['color']}">${badge} ${userstate['display-name']}</span><span class="content">${sanitizer.escape(message)}</span></div>`);
            $(".msg-container").scrollTop($(".msg-container")[0].scrollHeight);
            break;
        default:
            console.warn(`unknown message type '${userstate['message-type']}'`);
            break;
    }
});

client.on("notice", function(channel, msgid, message) {
    $(".msg-container").append(`<div class="msg action">${sanitizer.escape(message)}</div>`);
    $(".msg-container").scrollTop($(".msg-container")[0].scrollHeight);
});

client.on("slowmode", function(channel, enabled, length) {
    if (enabled) {
        $(".msg-container").append(`<div class="msg action">This room is now in slow mode. You may send messages every ${length} seconds.</div>`);
        $(".msg-container").scrollTop($(".msg-container")[0].scrollHeight);
    } else {
        $(".msg-container").append(`<div class="msg action">This room is no longer in slow mode.</div>`);
        $(".msg-container").scrollTop($(".msg-container")[0].scrollHeight);
    }
});

client.on("subscribers", function(channel, enabled) {
    if (enabled) {
        $(".msg-container").append(`<div class="msg action">Subscribers-only mode has been turned on for this room.</div>`);
        $(".msg-container").scrollTop($(".msg-container")[0].scrollHeight);
    } else {
        $(".msg-container").append(`<div class="msg action">Subscribers-only mode has been turned off.</div>`);
        $(".msg-container").scrollTop($(".msg-container")[0].scrollHeight);
    }
});

client.on("clearchat", function(channel) {
    $(".msg-container").html(`<div class="msg action">Chat has been cleared.</div>`);
});

client.on("connecting", function(address, port) {
    $(".loader").css("visibility", "visible");
    rpc.login({clientId: '536605206599958535'}).catch(console.error);
});

client.on("connected", function(address, port) {
    $(".loader").css("visibility", "hidden");
    $(".msg-container").append(`<div class="msg action">Connected to ${address}:${port}</div>`);
});

client.on("disconnected", function(reason) {
    $(".msg-container").append(`<div class="msg action">You were disconnected. Reason: ${reason}</div>`);
    $(".msg-container").append(`<div class="msg action"><a href="login.html">Go back to login</a></div>`);
});

client.on("reconnect", function () {
    $(".loader").css("visibility", "visible");
    $(".msg-container").append(`<div class="msg action">Reconnecting to server...</div>`);
});

$('.msg-sender').keypress(function(e) {
    var keycode = event.keyCode || event.which;
    if (keycode == '13') {
        client.say(appSettings['channels'][0], $('.msg-sender').val());
        $(".msg-sender").val("");
    }
});

$(".send-button").click(function() {
    client.say(appSettings['channels'][0], $('.msg-sender').val());
    $(".msg-sender").val("");
});

$(".settings-btn").click(function() {
    remote.getCurrentWindow().loadURL(`file://${__dirname}/settings.html`);
});

$(".chat-collapser").click(function() {
    toggleChat();
});

if (appSettings['opacity'] == 100) {
    $("body").css("background-color", `rgb(14, 12, 19)`);
} else {
    $("body").css("background-color", `rgba(14, 12, 19, .${appSettings['opacity']})`);
}
$(".channel-name").html(appSettings['channel']);
var options = {
    width: 275,
    height: 155,
    channel: appSettings['channel']
};
var player = new Twitch.Player("twitch-embed", options);
var streamData = {"title": "Unknown"};
player.setMuted(false);
player.setVolume(1);

function toggleChat() {
    $("body").toggleClass("nochat");
    const window = remote.getCurrentWindow();
    var classes = $("body").attr('class').split(' ');
    var display = remote.screen.getPrimaryDisplay();
    remote.getCurrentWindow().setResizable(true);
    if (classes.indexOf('nochat') != -1) {
        // chat is collapsed
        window.setSize(325, 250);
        window.setPosition(display.bounds.width - window.getSize()[0], 0);
        player.setWidth(325);
        player.setHeight(205);
    } else {
        window.setSize(275, 480);
        window.setPosition(display.bounds.width - window.getSize()[0], 0);
        player.setWidth(275);
        player.setHeight(155);
    }
    remote.getCurrentWindow().setResizable(false);
}

function getStreamMetadata() {
    if (player.getEnded()) {
        return {"title": "Stream ended"};
    }
    client.api({
        url: `https://api.twitch.tv/helix/streams?user_login=${player.getChannel()}`,
        headers: {"Client-ID": "vsvrwnky0r1f14e0lraro310k085wk"}
    }, (err, res, body) => {
        if (err) {console.error(err);}
        console.log(body);
        streamData = body.data[0];
        //startTimestamp = new Date(streamData.started_at);
    });
}

function updateRPC(body) {
    if (body === undefined) {
        var body = {"title": "Stream offline"}
    }
    if (player.getEnded()) {
        body.title = "Stream offline";
    }
    var icon = player.isPaused() ? 'pause' : 'play';
    var icon = player.getEnded() ? undefined : icon;
    rpc.setActivity({
        details: `Watching ${player.getChannel()}`,
        state: `${body.title}`,
        startTimestamp,
        largeImageKey: 'twitch',
        largeImageText: `TwitchOverlay v${remote.app.getVersion()}\nhttps://overlay.twitchbot.io`,
        smallImageKey: icon,
        smallImageText: player.isPaused() ? 'Stream paused' : 'Stream playing',
        instance: false
    });
    console.log('RPC Update');
}

rpc.on('ready', () => {
    getStreamMetadata();
    setInterval(() => {
        updateRPC(streamData);
    }, 2e3);
});

if (require('electron').remote.getCurrentWindow().getSize()[1] == 250) {
    $('body').addClass('nochat');
    player.setWidth(325);
    player.setHeight(205);
}

module.exports = {client, player, rpc, toggleChat};

client.connect();
