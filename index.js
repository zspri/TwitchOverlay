const {app, BrowserWindow, Tray, process, Menu, globalShortcut, shell} = require('electron');

let mainWindow, tray;

app.on('ready', () => {
    const screen = require('electron').screen;
    mainWindow = new BrowserWindow({
        height: 480,
        width: 275,
        frame: false,
        resizable: false,
        transparent: true
    });

    mainWindow.loadURL('file://' + __dirname + '/index.html');
    // Hide window in taskbar
    mainWindow.setSkipTaskbar(true);
    mainWindow.setAlwaysOnTop(true);
    globalShortcut.register('CommandOrControl+`', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
            var display = screen.getPrimaryDisplay();
            // Position at top-right
            mainWindow.setPosition(display.bounds.width - mainWindow.getSize()[0], 0);
            mainWindow.setAlwaysOnTop(true);
        }
    });

    tray = new Tray('tray.png');
    tray.setToolTip('Twitch overlay activated. Press Ctrl + ` to show.');
    const trayContextMenu = Menu.buildFromTemplate([
        {label: `TwitchOverlay v${app.getVersion()}`, enabled: false},
        {type: "separator"},
        {label: "Website", click: () => {shell.openExternal('https://overlay.twitchbot.io')}},
        {label: "Source code", click: () => {shell.openExternal('https://github.com/devakira/twitchoverlay')}},
        {type: "separator"},
        {label: "Toggle Chat", click: () => {
            mainWindow.webContents.executeJavaScript(`renderer.toggleChat()`);
        }},
        {label: "Settings", click: () => {mainWindow.loadURL('file://' + __dirname + '/settings.html');}},
        {type: "separator"},
        {label: "Quit Application", role: "quit"}
    ]);
    tray.setContextMenu(trayContextMenu);
    const trayBounds = tray.getBounds();
    var display = screen.getPrimaryDisplay();
    // Position at top-right
    mainWindow.setPosition(display.bounds.width - mainWindow.getSize()[0], 0);

    tray.on('click', () => {
        mainWindow.show();
        var display = screen.getPrimaryDisplay();
        // Position at top-right
        mainWindow.setPosition(display.bounds.width - mainWindow.getSize()[0], 0);
        mainWindow.setAlwaysOnTop(true);
    });

    mainWindow.on('blur', () => {
        mainWindow.setAlwaysOnTop(true);
    });

    mainWindow.on('closed', () => {
        app.quit();
    });

    mainWindow.on('resize', () => {
        var display = screen.getPrimaryDisplay();
        // Position at top-right
        mainWindow.setPosition(display.bounds.width - mainWindow.getSize()[0], 0);
        mainWindow.setAlwaysOnTop(true);
    });

    mainWindow.on('enter-html-full-screen', () => {
        mainWindow.setPosition(0, 0);
    });

    mainWindow.on('leave-html-full-screen', () => {
        var display = screen.getPrimaryDisplay();
        // Position at top-right
        mainWindow.setPosition(display.bounds.width - mainWindow.getSize()[0], 0);
    });

    mainWindow.webContents.on('new-window', function(event, url){
      event.preventDefault();
      shell.openExternal(url);
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
