const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

if (!envConfig.DATABASE_URL) {
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = envConfig;
    if (DB_USER && DB_HOST && DB_NAME) {
        const url = `DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"`;
        fs.appendFileSync(envPath, `\n${url}\n`);
        console.log('Added DATABASE_URL to .env');
    } else {
        console.log('Could not construct DATABASE_URL, missing vars');
    }
} else {
    console.log('DATABASE_URL already exists');
}
