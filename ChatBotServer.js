const express = require("express");
const bodyParser  = require("body-parser");
const axios = require("axios");


const app = express();
app.use(bodyParser.json());


const token = "EAAdOle9zqC8BPMbWHgTH1L4pUqpAYMt3J0adZBeOL0RCTHg6bm2tNGtx3GYSKESUjSrdEKQhTlcekvMC1GZCy1gY3J7ArZCgpxwTeNZBs8Yv0Xl8N6bFRLxB0ExdY2oZCckKhdW42gwRpEYnvGq6IVeA9QWf4yiApG9JsCooQZAokrdovAFr1LYdiKoZAn9DfLa3cpTXSyXIgUa7CZBpEcofzAZDZD";

app.get("/webhook" , (req , res)=>{
        const mode = req.query["hub.mode"];
        const verify_token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];
        if(mode === "subscribe" && verify_token === token){
            console.log("Logged correctly !!");
            res.status(200).send(challenge);
        }
        else{
            res.sendStatus(404);
        }

});


app.post("/webhook" , (req , res)=>{
 const body = req.body;
 if(body.object === "page"){
    body.entry.forEach(entry=>{
     const event = entry.messaging[0];
     const senderid= event.sender.id;
     if(event.message && event.message.text){
        const userMessage = event.message.text;
        console.log("We recieved this message " + userMessage);
        axios.post(`https://graph.facebook.com/v17.0/me/messages?access_token=${token}`, 

            {recipient :{id : senderid} , 
            message : {text : "you said " + userMessage}
        
            }).then(()=>{
                console.log("Message sent successfully!!!");
            }).catch(error=>{

                console.log(error.response.data);
            });
     }

    });
res.status(200).send("Event received!!!");
 }
 else{
    res.sendStatus(400);
 }
});


app.listen(3000 , ()=>{
    console.log("Server is connected successfully!!!")
})