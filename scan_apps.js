/**
 * 【使用方法】
 * 1. Node.js をインストールしてください。
 *    - 公式サイト: https://nodejs.org/
 *    - またはコマンド: winget install OpenJS.NodeJS.LTS
 *    (インストール後はターミナルの再起動が必要です)
 * 2. このディレクトリでターミナルを開きます。
 * 3. 以下のコマンドを実行してください:
 *    node scan_apps.js
 */
const fs = require('fs');
const path = require('path');

const parentDir = path.resolve(__dirname, '..');
const appsJsonPath = path.join(__dirname, 'apps.json');
const currentDirName = path.basename(__dirname);

// Known descriptions - can be extended or we could try to parse <title> from index.html
const descriptions = {
    'Color Reduction Tool': 'Reduce colors in images with various algorithms.',
    'EXIF Checker': 'Check and remove EXIF data from images.',
    'Shogi Game': 'Play Shogi against an AI opponent.'
};

function scanApps() {
    console.log(`Scanning directory: ${parentDir}`);

    fs.readdir(parentDir, { withFileTypes: true }, (err, entries) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        const apps = [];

        entries.forEach(entry => {
            if (entry.isDirectory()) {
                const dirName = entry.name;

                // Skip the App List Viewer itself and hidden directories
                if (dirName === currentDirName || dirName.startsWith('.')) {
                    return;
                }

                const appPath = path.join(parentDir, dirName);
                const indexHtmlPath = path.join(appPath, 'index.html');
                const iconPath = path.join(appPath, 'application.png');

                if (fs.existsSync(indexHtmlPath)) {
                    console.log(`Found app: ${dirName}`);

                    const appData = {
                        name: dirName,
                        path: `../${dirName}/index.html`,
                        description: descriptions[dirName] || 'Web Application'
                    };

                    if (fs.existsSync(iconPath)) {
                        appData.icon = `../${dirName}/application.png`;
                    }

                    apps.push(appData);
                }
            }
        });

        // Write to apps_data.js
        const jsContent = `window.APP_LIST = ${JSON.stringify(apps, null, 2)};`;
        const appsJsPath = path.join(__dirname, 'apps_data.js');

        fs.writeFile(appsJsPath, jsContent, (err) => {
            if (err) {
                console.error('Error writing apps_data.js:', err);
            } else {
                console.log(`Successfully updated apps_data.js with ${apps.length} apps.`);
            }
        });
    });
}

scanApps();
