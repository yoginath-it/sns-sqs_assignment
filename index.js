const express = require('express');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const { SQSClient, ReceiveMessageCommand } = require('@aws-sdk/client-sqs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const snsClient = new SNSClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test'
  }
});

const sqsClient = new SQSClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test'
  }
});

const TOPICS = {
  broadcast: 'arn:aws:sns:us-east-1:000000000000:broadcast-topic',
  communication: 'arn:aws:sns:us-east-1:000000000000:communication-topic',
  entity: 'arn:aws:sns:us-east-1:000000000000:entity-topic'
};

const QUEUES = {
  broadcast: 'https://localhost:4566/000000000000/broadcast-queue',
  email: 'https://localhost:4566/000000000000/email-queue',
  sms: 'https://localhost:4566/000000000000/sms-queue',
  entity: 'https://localhost:4566/000000000000/entity-queue'
};

app.post('/publish', async (req, res) => {
  const { message, eventType } = req.body;
  const params = {
    Message: message,
    TopicArn: TOPICS[eventType]
  };

  try {
    const data = await snsClient.send(new PublishCommand(params));
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get('/consume/:queueName', async (req, res) => {
  const queueUrl = QUEUES[req.params.queueName];
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10,
    VisibilityTimeout: 30,
    WaitTimeSeconds: 0
  };

  try {
    const data = await sqsClient.send(new ReceiveMessageCommand(params));
    res.send(data.Messages || []);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

