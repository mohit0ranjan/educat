const Database = require('better-sqlite3');
const db = new Database('d:/Projects/EdTechPlatform/backend/.tmp/data.db');

try {
    const roles = db.prepare('SELECT * FROM up_roles').all();
    console.log('Roles found:', JSON.stringify(roles, null, 2));
} catch (err) {
    console.error('Error reading roles:', err.message);
} finally {
    db.close();
}
