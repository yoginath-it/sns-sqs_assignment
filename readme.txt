STEP-1:Start LocalStack
>>localstack start

Configure AWS CLI to use LocalStack
>>aws configure --profile localstack
>>AWS Access Key ID [None]: test
>>AWS Secret Access Key [None]: test
>>Default region name [None]: us-east-1
>>Default output format [None]: json

Set environment variables
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export LOCALSTACK_HOSTNAME=localhost

STEP-2:Create SNS Topics and SQS Queues
1.Create SNS Topics:
aws --endpoint-url=http://localhost:4566 sns create-topic --name broadcast-topic
aws --endpoint-url=http://localhost:4566 sns create-topic --name communication-topic
aws --endpoint-url=http://localhost:4566 sns create-topic --name entity-topic
2.Create SQS Queues:
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name broadcast-queue
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name email-queue
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name sms-queue
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name entity-queue
3.Subscribe SQS Queues to SNS Topics:
aws --endpoint-url=http://localhost:4566 sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:broadcast-topic --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:000000000000:broadcast-queue
aws --endpoint-url=http://localhost:4566 sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:communication-topic --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:000000000000:email-queue
aws --endpoint-url=http://localhost:4566 sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:communication-topic --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:000000000000:sms-queue
aws --endpoint-url=http://localhost:4566 sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:entity-topic --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:000000000000:entity-queue

STEP-3:
Run the server: node index.js
STEP-4:Test the APIs
Publish a Message:curl -X POST http://localhost:3000/publish -H "Content-Type: application/json" -d '{"message": "Hello World!", "eventType": "broadcast"}'
Consume Messages:curl http://localhost:3000/consume/broadcast
