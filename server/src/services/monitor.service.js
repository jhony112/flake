const { SQSClient, GetQueueAttributesCommand } = require('@aws-sdk/client-sqs')

const region = 'us-west-2' // Replace with your own region
// Replace with your own queue URL

const getTotalInQueue = async (QueueUrl) => {
    const countParams = {
        QueueUrl,
        AttributeNames: [
            'ApproximateNumberOfMessages',
            'ApproximateNumberOfMessagesNotVisible',
        ],
    }
    const sqsClient = new SQSClient({ region })
    try {
        const data = await sqsClient.send(
            new GetQueueAttributesCommand(countParams)
        )
        return data
    } catch (err) {
        console.error(err, err.stack)
        return null
    }
}

module.exports = { getTotalInQueue }
