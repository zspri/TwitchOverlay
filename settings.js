const remote = require('electron').remote;
const fs = require('fs');
const settings = require('electron-settings');

$("input[name=channel]").val(settings.get('channel'));
$(".ver").html(remote.app.getVersion());

$(".settings-btn").click(function() {
    remote.getCurrentWindow().loadURL(`file://${__dirname}/index.html`);
});

$(".sm-button[aria-for=channel]").click(function() {
    settings.set('channel', $("input[name=channel]").val());
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
    settings.set('opacity', value);
    setOpacity();
});

function setOpacity() {
    var opacity = settings.get('opacity');
    if (opacity == 100) {
        $("body").css("background-color", `rgb(14, 12, 19)`);
    } else if (opacity == undefined) {
        opacity = 80
        settings.set('opacity', 80); 
    } else {
        $("body").css("background-color", `rgba(14, 12, 19, .${opacity})`);
    }
    $('input[name=transparency]').val(settings.get('opacity'));
    $("span[aria-for=transparency]").html(settings.get('opacity') + "%");
}

setOpacity();
