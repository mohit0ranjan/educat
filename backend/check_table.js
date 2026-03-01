const Database = require('better-sqlite3');
const db = new Database('d:/Projects/EdTechPlatform/backend/.tmp/data.db');

try {
    const info = db.prepare('PRAGMA table_info(up_users)').all();
    console.log('User Table Info:', JSON.stringify(info, null, 2));
} catch (err) {
    console.error('Error reading table info:', err.message);
} finally {
    db.close();
}
