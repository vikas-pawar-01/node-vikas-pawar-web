const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');
const amqp = require('amqplib/callback_api');

const test = (req, res, next) => {
    res.send("Not implemented..");
};

const sender = (req, res, next) => {
    try {
        amqp.connect('amqp://localhost', (err,conn) => {
            if(err) {
                throw err;
            }
            conn.createChannel((err1,ch) => {
                if(err1) {
                    throw err1;
                }

                let q = 'sample';
                let msg = 'Hello World!';

                ch.assertQueue( q, {
                    durable: true
                });

                ch.sendToQueue(q, Buffer.from(msg), {persistent: true});
                console.log(" [x] sent %s", msg);
            });
        });        
    } catch (error) {
        return next(error);
    }

    res.send("RabbitMq message sent..");    
};

const consumer = (req, res, next) => {

    amqp.connect('amqp://localhost', (err, conn) => {
        if(err) {
            throw err;
        }

        conn.createChannel( (err1, ch) => {
            if(err1){
                throw err1;
            }

            let q = 'sample';

            ch.assertQueue(q, {
                durable: true
            });

            console.log(" [*] Waiting for message in %s. To exit press CTRL+C", q);
            ch.consume(q, (msg) => {
                console.log(" [x] Received %s", msg.content.toString());
            }, {
                noAck: true
            });
        });
    });

    res.send("Message processed by Consumer ..");
};

const sendEmail = async (req, res, next) => {
    let transporter = nodemailer.createTransport({            
        name: 'www.vikaspawar.info',
        host: 'smtpout.secureserver.net',
        port: 465,
        secure: 'SSL/TLS',
        auth: {
            user: process.env.GMAIL,
            pass: process.env.PASS
        }
    });

    let mailOptions = {
        from: 'no-reply@vikaspawar.info',
        to: 'hello@vikaspawar.info, vikas.pawar17@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function(error, info){            
        if (error) {
            return next(error);
        } else {
            res.json({ message: 'Email sent: ' + info.response });
        }
    });

    res.json({ message: 'Email sent!' });
};

const sendQueueMessage = async (req, res, next) => {
    console.log('SQS function run!');
    
    AWS.config.update({region: 'us-west-2'});

    const qsqs = new AWS.SQS({apiVersion: '2012-11-05'});

    var params = {
        DelaySeconds: 0,
        MessageAttributes: {
            "Title": {
              DataType: "String",
              StringValue: "Developer"
            },
            "Author": {
              DataType: "String",
              StringValue: "Vikas Pawar"
            },
            "WeeksOn": {
              DataType: "Number",
              StringValue: "6"
            }
          },
        MessageBody: 'SQS Message Test 1',
        QueueUrl: "https://sqs.us-west-2.amazonaws.com/069994906946/vikas-queue-new"
    };

    qsqs.sendMessage(params, function(err, data) {
        if (err) {
            console.log('SQS function error:', err); 
            return next(err);
        }
    });

    console.log('SQS function execution done!'); 
    
    res.json({ message: 'SQS Message Sent!' });
};

const webClick = async (req, res, next) => {
    console.log('webClick function run!');

    const axios = require('axios');

    for(let i=1; i <= 5; i++) {
        try {
            const web = await axios.get(`https://vikaspawar.info/?ver=${i}`);            
            console.log(`Clicked- ${i} times`);
        } catch (err) {
            const error = new HttpError(
                'webClick up failed, please try again later.',
                500
            );
            return next(error);
        }           
    }

    res.json({ message: 'Website https://vikaspawar.info/ clicked!!!' });
};

const script = (req, res, next) => {
    let cron = require('node-cron');
    cron.schedule('* * * * * *', () => {
        console.log('Running task for every minute.');
    });

    res.send('Cron scheduled');
};

exports.test = test;
exports.sendEmail = sendEmail;
exports.sendQueueMessage = sendQueueMessage;
exports.webClick = webClick;
exports.sender = sender;
exports.consumer = consumer;
exports.script = script;