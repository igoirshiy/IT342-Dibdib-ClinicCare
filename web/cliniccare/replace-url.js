const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;

            // Replace template literals `http://127.0.0.1:8080...`
            if (content.includes('`http://127.0.0.1:8080')) {
                content = content.replace(/`http:\/\/127\.0\.0\.1:8080/g, '`${process.env.REACT_APP_API_URL || "http://127.0.0.1:8080"}');
                updated = true;
            }

            // Replace normal strings 'http://127.0.0.1:8080...' or "http://127.0.0.1:8080..."
            if (content.includes("'http://127.0.0.1:8080")) {
                content = content.replace(/'http:\/\/127\.0\.0\.1:8080/g, '(process.env.REACT_APP_API_URL || "http://127.0.0.1:8080") + \'');
                updated = true;
            }
            if (content.includes('"http://127.0.0.1:8080')) {
                content = content.replace(/"http:\/\/127\.0\.0\.1:8080/g, '(process.env.REACT_APP_API_URL || "http://127.0.0.1:8080") + "');
                updated = true;
            }

            if (updated) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir(path.join(__dirname, 'src'));
