const remote = require('electron').remote;
const fs = require('fs');
const settings = require('electron-settings');

$(".ver").html(remote.app.getVersion());
if (settings.has('identity')) {
    settings.delete('identity');
} if (settings.has('opacity')) {
    var opacity = settings.get('opacity');
    if (opacity == 100) {
        $("body").css("background-color", `rgb(14, 12, 19)`);
    } else {
        $("body").css("background-color", `rgba(14, 12, 19, .${opacity})`);
    }
}

$(".sm-button.login").click(function() {
    if ($("input[name=username]").val().length == 0 || $("input[name=password]").val().length == 0) {
        $("#msg").html(`<i class="fas fa-exclamation-triangle" style="color:#f04747"></i>&nbsp;&nbsp;Fill out the required fields.`);
    } else {
        settings.set('identity', {
            'username': $("input[name=username]").val(),
            'password': $("input[name=password]").val()
        });

        if (!settings.has('channel')) {
            settings.set('channel', settings.get('identity.username'));
        }

        remote.getCurrentWindow().loadURL(`file://${__dirname}/index.html`);
    }
});

$(".sm-button.skip-login").click(function() {
    settings.set('identity', {
        'username': '?anonymous?',
        'password': ''
    });

    settings.set('channel', 'twitchpresents');

    remote.getCurrentWindow().loadURL(`file://${__dirname}/index.html`);
});
