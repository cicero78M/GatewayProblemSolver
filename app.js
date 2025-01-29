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
import { createSession } from './src/module/session_chat.js';

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
        let chat = await msg.getChat(); //this catch message data

        createSession(chat);

        if (!msg.isStatus && !msg.fromMe){
            if (!contact.isMyContact){
                //Save Contact Here
            }
        } 
    } catch (error) { //Catching the Error Request
        logsSend(error, "Main Apps");
    }
});