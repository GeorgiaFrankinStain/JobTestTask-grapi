#!/usr/bin/env node


var amqp = require('amqplib');

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

app.get("/api/users", async (req, res, next) => {

    const n = req.query.n;

    console.log(n);









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




        // await channel.consume(q.queue, function(msg) {
        //     if (msg.properties.correlationId === correlationId) {
        //         console.log(' [.] Got %s', msg.content.toString());
        //         setTimeout(function() {
        //             connection.close();
        //             process.exit(0);
        //         }, 500);
        //     }
        // }, {
        //     noAck: true
        // });


        await channel.close();
    } catch (err) {
        console.warn(err);
    } finally {
        if (connection) await connection.close();
    }











    if (true) {
        res.status(400).json({"error":"err.message"});
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
