const {app, BrowserWindow, Tray, process, Menu, globalShortcut} = require('electron');

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
            mainWindow.setPosition(display.bounds.width - windowSize[0], 0);
            mainWindow.setAlwaysOnTop(true);
        }
    });

    tray = new Tray('assets/tray.png');
    tray.setToolTip('Twitch overlay activated. Press Ctrl + ` to show.');
    const trayContextMenu = Menu.buildFromTemplate([
        {type: "normal", label: `TwitchOverlay v${app.getVersion()}`, enabled: false},
        {type: "separator"},
        {type: "normal", label: "Quit Application", role: "quit"}
    ]);
    tray.setContextMenu(trayContextMenu);
    const trayBounds = tray.getBounds();
    const windowSize = mainWindow.getSize();
    var display = screen.getPrimaryDisplay();
    // Position at top-right
    mainWindow.setPosition(display.bounds.width - windowSize[0], 0);

    tray.on('click', () => {
        mainWindow.show();
        var display = screen.getPrimaryDisplay();
        // Position at top-right
        mainWindow.setPosition(display.bounds.width - windowSize[0], 0);
        mainWindow.setAlwaysOnTop(true);
    });

    mainWindow.on('blur', () => {
        mainWindow.setAlwaysOnTop(true);
    });

    mainWindow.on('closed', () => {
        app.quit();
    })

    mainWindow.on('resize', () => {
        var display = screen.getPrimaryDisplay();
        // Position at top-right
        mainWindow.setPosition(display.bounds.width - windowSize[0], 0);
        mainWindow.setAlwaysOnTop(true);
    })
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
