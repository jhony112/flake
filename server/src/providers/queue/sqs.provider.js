const {
    SQSClient,
    SendMessageCommand,
    ReceiveMessageCommand,
    DeleteMessageCommand,
    GetQueueUrlCommand,
} = require('@aws-sdk/client-sqs');

const QueueBase = require('./base.provider');

const { getEnv } = require('../../utils/strings');

class SQSQueueProvider extends QueueBase {
    constructor(config = {}) {
        const name = 'SQSQueueProvider';
        super(name);
        this.config = config;
        const credentials = {
            accessKeyId: config.AWS_ACCESS_KEY_ID,
            secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        };
        this.sqsClient = new SQSClient({ region: config.AWS_REGION || 'eu-west-2', credentials }); // Replace with your desired AWS region
    }

    async connect() {
        try {
            const { QueueUrl } = await this.sqsClient.send(
                new GetQueueUrlCommand({
                    QueueName: this.config.queueName,
                    QueueOwnerAWSAccountId: this.config.AWS_ACCOUNT_ID,
                })
            );
            this.queueUrl = QueueUrl;
            console.log(`event: [connect] : connected to ${QueueUrl}`);
            return true;
        } catch (error) {
            console.log(error);
            if (error && error.Error) {
                console.error('Error connecting to SQS:', error.Error.Message);
            }
            return false;
        }
    }

    // eslint-disable-next-line class-methods-use-this
    async disconnect() {
        // No explicit disconnection needed for SQS
        console.log('Disconnected from SQS');
    }

    async sendMessage(message) {
        try {
            const params = {
                QueueUrl: this.queueUrl,
                MessageBody: JSON.stringify(message),
            };

            await this.sqsClient.send(new SendMessageCommand(params));
            console.log('Message sent to SQS:', message);
        } catch (error) {
            console.error('Error sending message to SQS:', error);
        }
    }

    async receiveMessage() {
        try {
            const params = {
                QueueUrl: this.queueUrl,
                MessageAttributeNames: ['All'],
                MaxNumberOfMessages: getEnv(this.config.SQS_QUEUE_MAX_MESSAGES, 10, true),
                VisibilityTimeout: getEnv(this.config.SQS_VISIBILITY_TIMEOUT, 30, true), // Set the visibility timeout as desired
                WaitTimeSeconds: getEnv(this.config.SQS_QUEUE_WAIT_TIME, 10, true), // Set the wait time as desired
            };

            const { Messages } = await this.sqsClient.send(new ReceiveMessageCommand(params));

            if (Messages && Messages.length > 0) {
                console.log('Received message from SQS:', Messages);
                return Messages.map((m) => ({
                    provider: this.name,
                    job_id: m.MessageId,
                    payload: !this.config.parseResponse ? m.Body : JSON.parse(m.Body),
                    raw: { ...m, provider: this.name },
                }));
            }
            return [];
        } catch (error) {
            console.error('Error receiving message from SQS:', error);
            return null;
        }
    }

    // need this to be able to handle resend
    async parseMessage(message) {
        try {
            return {
                provider: this.name,
                payload: !this.config.parseResponse ? message.Body : JSON.parse(message.Body),
                raw: message,
            };
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async deleteMessage(message) {
        try {
            const params = {
                QueueUrl: this.queueUrl,
                ReceiptHandle: message.ReceiptHandle,
            };

            await this.sqsClient.send(new DeleteMessageCommand(params));
            console.log('Deleted message from SQS:', message.MessageId);
            return true;
        } catch (error) {
            console.error('Error deleting message from SQS:', error.message);
            return false;
        }
    }
}

module.exports = SQSQueueProvider;
