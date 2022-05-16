/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.helloPubSub = (event, context) => {
  const message = event.data
    ? Buffer.from(event.data, 'base64').toString()
    : 'Hello, World';
  console.log(message);

  sendMessage(message);
};

const dotenv = require('dotenv');
const https = require('https');

dotenv.config();

const slackToken = process.env.SLACK_TOKEN;
const slackChannel = process.env.SLACK_CHANNEL_ID;
console.log(slackChannel);

function sendMessage(message) {
  var postData = JSON.stringify({
    'channel' : slackChannel,
    'text' : message,
  });

  var options = {
    hostname: 'slack.com',
    path: '/api/chat.postMessage',
    method: 'POST',
    port: 443,
    headers: {
         'Content-Type': 'application/json',
         'Content-Length': postData.length,
         'Authorization': 'Bearer ' + slackToken,
       }
  };

  var req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });
  
  req.on('error', (e) => {
    console.error(e);
  });
  
  req.write(postData);
  req.end();
}