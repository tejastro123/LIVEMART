require('dotenv').config();
const twilio = require('twilio');

console.log('--- Twilio Credential Check ---');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log(`TWILIO_ACCOUNT_SID: ${accountSid ? accountSid.substring(0, 5) + '...' : 'UNDEFINED'} (Length: ${accountSid ? accountSid.length : 0})`);
console.log(`TWILIO_AUTH_TOKEN: ${authToken ? authToken.substring(0, 5) + '...' : 'UNDEFINED'} (Length: ${authToken ? authToken.length : 0})`);

if (!accountSid || !authToken) {
  console.error('ERROR: Missing Twilio credentials in .env');
  process.exit(1);
}

// Check for whitespace
if (accountSid.trim() !== accountSid) {
  console.warn('WARNING: TWILIO_ACCOUNT_SID has leading/trailing whitespace!');
}
if (authToken.trim() !== authToken) {
  console.warn('WARNING: TWILIO_AUTH_TOKEN has leading/trailing whitespace!');
}

const client = new twilio(accountSid, authToken);

console.log('Attempting to fetch account details...');

client.api.accounts(accountSid)
  .fetch()
  .then(account => {
    console.log('SUCCESS: Authenticated as ' + account.friendlyName);
    console.log('Status:', account.status);
    console.log('Type:', account.type);
  })
  .catch(error => {
    console.error('Twilio Error:', error.message);
    console.error('Code:', error.code);
    console.error('More Info:', error.moreInfo);
  });
