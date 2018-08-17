const remote = require('electron').remote;
const tmi = require('tmi.js');
const sanitizer = require('sanitizer');
var appSettings;
try {
    appSettings = require('./config.json');
} catch(e) {
    remote.getCurrentWindow().loadURL(`file://${__dirname}/login.html`);
}


appSettings['channels'] = [`#${appSettings['channel']}`]

var client = new tmi.client(appSettings);

client.on("message", function(channel, userstate, message, self) {
    var badge = "";
    if ("broadcaster" in userstate['badges']) {
        badge = "<img class='badge' src='https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1'>";
    } else if (userstate['user-type'] == "mod" || userstate['mod'] === true) {
        badge = "<img class='badge' src='https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1'>";
    } if ("premium" in userstate['badges']) {
        badge += "<img class='badge' src='https://static-cdn.jtvnw.net/badges/v1/a1dd5073-19c3-4911-8cb4-c464a7bc1510/1'>";
    } if (userstate['subscriber'] === true) {
        badge += "<img class='badge' src='https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1'>";
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
});

client.on("connected", function(address, port) {
    $(".loader").css("visibility", "hidden");
    $(".msg-container").append(`<div class="msg action">Connected to ${address}:${port}</div>`);
});

client.on("disconnected", function(reason) {
    $(".msg-container").append(`<div class="msg action">You were disconnected. Reason: ${reason}</div>`);
    if (reason == "Login authentication failed") {
        remote.getCurrentWindow().loadURL(`file://${__dirname}/login.html`);
    }
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

if (appSettings['opacity'] == 100) {
    $("body").css("background-color", `rgb(14, 12, 19)`);
} else {
    $("body").css("background-color", `rgba(14, 12, 19, .${appSettings['opacity']})`);
}
$(".channel-name").html(appSettings['channel']);

client.connect();
