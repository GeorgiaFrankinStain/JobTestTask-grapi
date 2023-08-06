#!/usr/bin/env node


// var amqp = require('amqplib');
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


















    amqp.connect('amqp://localhost', function(error0, connection) {
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
                        // setTimeout(function() {
                        //     connection.close();
                        //     process.exit(0);
                        // }, 500);
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


























/*








    let connection;
    try {
        connection = await amqp.connect("amqp://localhost");


        var correlationId = generateUuid();
        var num = parseInt(n);


        const channel = await connection.createChannel();

        const q = await channel.assertQueue('rpc_queue', { durable: false });
        channel.sendToQueue('rpc_queue',
            // Buffer.from("4"), {
            Buffer.from(num.toString()), {
                correlationId: correlationId,
                replyTo: q.queue
            });
        // console.log(" [x] Sent '%s'", text);



        channel.prefetch(1, false); // global=false
        await channel.consume(q.queue, async function(msg) {
            if (msg.properties.correlationId === correlationId) {
                console.log(' [.] Got %s', msg.content.toString());

                // setTimeout(function() {
                //     connection.close();
                //     process.exit(0);
            }



            // }, 500);
            res.status(200).json({"error":msg.content.toString()});
            // return;
            channel.ack(message);
        }, {
            noAck: true
        });


        await channel.close();
    } catch (err) {
        console.warn(err);
    } finally {
        if (connection) await connection.close();
    }



*/








    if (true) {
        // res.status(400).json({"error":"err.message"});
        return;
    } else {
        res.json({
            "message":"success",
            "data":"rows"
        })
    }
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
