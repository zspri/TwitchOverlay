const remote = require('electron').remote;
const fs = require('fs');
var appSettings = require('./config.json');

$("input[name=channel]").val(appSettings['channel']);
$(".ver").html(remote.app.getVersion());

$(".settings-btn").click(function() {
    remote.getCurrentWindow().loadURL(`file://${__dirname}/index.html`);
});

$(".sm-button[aria-for=channel]").click(function() {
    appSettings['channel'] = $("input[name=channel]").val();
    fs.writeFileSync('config.json', JSON.stringify(appSettings));
    remote.app.relaunch();
    remote.app.exit();
});

$(".sm-button[aria-for=devtools]").click(function() {
    remote.getCurrentWindow().webContents.openDevTools({
        mode:"undocked"
    })
});

$('input[name=transparency]').on('input', function () {
    var value = $(this).val();
    appSettings['opacity'] = value;
    fs.writeFileSync('config.json', JSON.stringify(appSettings));
    $("span[aria-for=transparency]").html(value);
    if (appSettings['opacity'] == 100) {
        $("body").css("background-color", `rgb(14, 12, 19)`);
    } else {
        $("body").css("background-color", `rgba(14, 12, 19, .${appSettings['opacity']})`);
    }
});

if (appSettings['opacity'] == 100) {
    $("body").css("background-color", `rgb(14, 12, 19)`);
} else {
    $("body").css("background-color", `rgba(14, 12, 19, .${appSettings['opacity']})`);
}
$('input[name=transparency]').val(appSettings['opacity']);
$("span[aria-for=transparency]").html($('input[name=transparency]').val());
