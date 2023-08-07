#!/usr/bin/env node


var amqp = require('amqplib/callback_api');

var express = require("express")
var app = express()

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});


app.get('/hello', (req, res) => {
    return res.json({ message: 'Hello World!' });
});

app.get("/api/users", async (req, res, next) => {

    const n = req.query.n;

    console.log(n);
    amqp.connect('amqp://172.16.238.12', function(error0, connection) {
    // amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }


        var correlationId = generateUuid();
        var num = parseInt(n);


        var channel = connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            channel.assertQueue('', {
                exclusive: true
            }, function(error2, q) {
                if (error2) {
                    throw error2;
                }

                console.log(' [x] Requesting fib(%d)', num);
                channel.consume(q.queue, function(msg) {
                    if (msg.properties.correlationId === correlationId) {
                        console.log(' [.] Got %s', msg.content.toString());

                        res.status(200).json({"fib":msg.content.toString()});
                    }
                }, {
                    noAck: true
                });

                channel.sendToQueue('rpc_queue',
                    // Buffer.from("4"), {
                    Buffer.from(num.toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue
                    });
            });
        });
    });
});



// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});



function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}
