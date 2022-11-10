var axios = require('axios');
const crypto = require('crypto');

const config = {
  agentId: process.env.agent_id,
  channelSecret: process.env.channel_secret
}

const postToDialogflow = async (req, event) => {
  req.headers.host = "dialogflow.cloud.google.com";
  await axios({
    method: 'post',
    url: `https://dialogflow.cloud.google.com/v1/integrations/line/webhook/${config.agentId}`,
    headers: req.headers,
    data: JSON.stringify(req.body)
  })
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return JSON.stringify(response.data)
    })
    .catch(function (error) {
      console.log(error);
      return error
    });
};

const convertToDialogflow = async (req, body) => {
  const jsonBody = JSON.stringify(body);
  req.headers.host = "dialogflow.cloud.google.com";
  req.headers["x-line-signature"] = calculateLineSignature(jsonBody);
  req.headers["content-length"] = jsonBody.length;
  await axios({
    method: 'post',
    url: `https://dialogflow.cloud.google.com/v1/integrations/line/webhook/${config.agentId}`,
    headers: req.headers,
    data: JSON.stringify(body)
  })
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return JSON.stringify(response.data)
    })
    .catch(function (error) {
      console.log(error);
      return error
    });
};

function calculateLineSignature(body) {
  const signature = crypto
    .createHmac('SHA256', config.channelSecret)
    .update(body).digest('base64');
  return signature;
}
function createLineTextEvent(originalRequest, originalEvent, text) {
  return {
    events:
      [{
        type: 'message',
        replyToken: originalEvent.replyToken,
        source: originalEvent.source,
        timestamp: originalEvent.timestamp,
        mode: originalEvent.mode,
        message: {
          type: 'text',
          text,
        },
      }],
    destination: originalRequest.body.destination,
  };
}

module.exports = {
  postToDialogflow,
  createLineTextEvent,
  convertToDialogflow
}