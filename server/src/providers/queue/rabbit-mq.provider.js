const amqp = require('amqplib')
const QueueBase = require('./base.provider')

class RabbitMqQueueProvider extends QueueBase {
    constructor(connectionUrl, config = {}) {
        const name = 'rabbit-mq'
        super(name)
        this.connectionUrl = connectionUrl
        this.connection = null
        this.channel = null
        this.config = config
    }

    async connect() {
        try {
            this.connection = await amqp.connect(this.connectionUrl)
            this.channel = await this.connection.createChannel()
            await this.channel.assertQueue(this.config.queueName)
            console.log('Connected to RabbitMQ')
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error)
        }
    }

    async disconnect() {
        try {
            await this.channel.close()
            await this.connection.close()
            console.log('Disconnected from RabbitMQ')
        } catch (error) {
            console.error('Error disconnecting from RabbitMQ:', error)
        }
    }

    async sendMessage(message) {
        try {
            const messageString = JSON.stringify(message)
            await this.channel.sendToQueue(this.queueName, Buffer.from(messageString))
            console.log('Message sent to RabbitMQ:', message)
        } catch (error) {
            console.error('Error sending message to RabbitMQ:', error)
        }
    }

    async receiveMessages(count = 10) {
        try {
            const { messages } = await this.channel.get(this.queueName, { noAck: true, count, ...this.config })

            if (messages && messages.length > 0) {
                const receivedMessages = messages.map((msg) => JSON.parse(msg.content.toString()))
                console.log('Received messages from RabbitMQ:', receivedMessages)
                return receivedMessages
                // Perform further processing with the received messages
            }
            console.log('No messages available in RabbitMQ')
            return []
        } catch (error) {
            console.error('Error receiving messages from RabbitMQ:', error)
            return null
        }
    }

    async deleteMessage(message) {
        try {
            await this.channel.ack(message)
            console.log('Deleted message from RabbitMQ:', message)
        } catch (error) {
            console.error('Error deleting message from RabbitMQ:', error)
        }
    }
}

module.exports = RabbitMqQueueProvider
