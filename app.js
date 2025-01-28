//Route
import express from 'express';
const app = express();

//WWebjs
import wwebjs from 'whatsapp-web.js';
const { Client, LocalAuth } = wwebjs;

//.env
import 'dotenv/config';

//QR-Code
import qrcode from 'qrcode-terminal';

//Figlet
import figlet from 'figlet';
const { textSync } = figlet;

//Banner
import { set } from 'simple-banner';
import { logsSave, logsSend } from './src/logs_view.js';

//Local Dependency
//.env
const private_key = process.env;

// Routing Port 
const port = private_key.EXPRESS_PORT;

app.listen(port, () => {
    console.log(`Cicero System Start listening on port >>> ${port}`)
});

// WWEB JS Client Constructor
export const client = new Client({
    authStrategy: new LocalAuth({
        clientId: private_key.APP_SESSION_NAME,
    }),
});

// On WWEB Client Initializing
console.log('System Initializing...');
client.initialize();

// On WWeB Authenticate Checking
client.on('authenthicated', (session)=>{
    logsSave(JSON.stringify(session));
});

// On WWEB If Authenticate Failure
client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

// On WWEB If Disconected
client.on('disconnected', (reason) => {
    console.error('Client was logged out', reason);
});

// On Pairing with QR Code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// On Reject Calls
let rejectCalls = true;
client.on('call', async (call) => {
    console.log('Call received, rejecting. GOTO Line 261 to disable', call);
    if (rejectCalls) await call.reject();
});

// On WWeb Ready
client.on('ready', () => {
    //Banner
    logsSave(textSync("CICERO -X- GONET", {
        font: "Ghost",
        horizontalLayout: "fitted",
        verticalLayout: "default",
        width: 240,
        whitespaceBreak: true,
    }));

    set("Cicero System Manajemen As A Services");
    logsSave('===============================');
    logsSave('===============================');
    logsSave('======System Fully Loaded!=====');
    logsSave('=========Enjoy the Ride========');
    logsSave('===We\'ll Take Care Everything==');
    logsSave('===============================');
    logsSave('===============================');
});

client.on('message', async (msg) => {
    try {

        const contact = await msg.getContact(); // This Catch Contact Sender. 
        
        if (msg.isStatus){ // This Catch Wa Story from Users
            //If Msg is WA Story
            const chat = await msg.getChat();
            chat.sendSeen();

            if (contact.pushname !== undefined){
                
                logsSave(contact.pushname+" >>> "+msg.body);
                
                let body = msg.body;
                let url = body.match(/\bhttps?:\/\/\S+/gi);
                if (url != null || url != undefined){
                    let splittedUrl = url[0].split('/');
                    if (splittedUrl.includes("www.instagram.com")){
                        logsSave('Response Sent');
                        //client.sendMessage(msg.author, 'Terimakasih sudah berpartisipasi melakukan share konten :\n\n'+url[0]+'\n\nSelalu Semangat ya.');
                            
                        //   let rawLink;
                        /*  
                        if(url[0].includes('/?')){
                            rawLink = url[0].replaceAll('/?', '?');
                            shortcode = rawLink.split('?')[0].split('/').pop();
                        } else {
                            shortcode = url[0].split('/').pop();
                        }

                        //Report Likes from Insta Official
                        let response = await _instaSW(contact.number, shortcode);
                    
                        if (response.code === 200){
                            client.sendMessage(msg.from, response.data);
                        } else {
                            logsSave(response.data);
                        }
                    */ 
                    }
                }            
            }
        } else { // This Catch Request Messages
            //Splitted Msg
            const splittedMsg = msg.body.split("#"); //this Proccess Request Order by Splitting Messages
            if (splittedMsg.length > 1){ //System response if message is user by lenght of splitted messages

                let chatMsg = await msg.getChat(); //this catch message data
                chatMsg.sendSeen(); //this send seen by bot whatsapp
                chatMsg.sendStateTyping(); //this create bot typing state 

                logsSave(msg.from+' >>> '+splittedMsg[1].toLowerCase());
                
            //if(splittedMsg[1].toLowerCase()......
            } else {
                const contact = await msg.getContact();
                logsSave(contact.number+" >>> "+msg.body);
            } // if(splittedMsg.length....
        } //if(msg.status....
    } catch (error) { //Catching the Error Request
        logsSend(error, "Main Apps");
    }
});