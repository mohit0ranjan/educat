const Database = require('better-sqlite3');
const db = new Database('d:/Projects/EdTechPlatform/backend/.tmp/data.db');

try {
    const users = db.prepare('SELECT * FROM up_users').all();
    console.log('Users found:', JSON.stringify(users, null, 2));
} catch (err) {
    console.error('Error reading users:', err.message);
} finally {
    db.close();
}
