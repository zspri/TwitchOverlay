const remote = require('electron').remote;
const fs = require('fs');
try {
    var appSettings = require('./config.json');
} catch(e) {
    var appSettings = {}
}

$(".ver").html(remote.app.getVersion());
if (appSettings['identity'] !== undefined) {
    delete appSettings['identity'];
    fs.writeFileSync('config.json', JSON.stringify(appSettings));
} if (appSettings['opacity'] !== undefined) {
    if (appSettings['opacity'] == 100) {
        $("body").css("background-color", `rgb(14, 12, 19)`);
    } else {
        $("body").css("background-color", `rgba(14, 12, 19, .${appSettings['opacity']})`);
    }
}

$(".sm-button.login").click(function() {
    if ($("input[name=username]").val().length == 0 || $("input[name=password]").val().length == 0) {
        $("#msg").html(`<i class="fas fa-exclamation-triangle" style="color:#f04747"></i>&nbsp;&nbsp;Fill out the required fields.`);
    } else {
        appSettings['identity'] = {'username': $("input[name=username]").val(), 'password': $("input[name=password]").val()};
        if (appSettings['channel'] === undefined) {
            appSettings['channel'] = appSettings['identity']['username'];
        }
        fs.writeFileSync('config.json', JSON.stringify(appSettings));
        remote.getCurrentWindow().loadURL(`file://${__dirname}/index.html`);
    }
});
