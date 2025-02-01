//Route
import express from 'express';
const app = express();

//WWebjs
import wwebjs from 'whatsapp-web.js';

const { Client, LocalAuth} = wwebjs;

//.env
import 'dotenv/config';

//QR-Code
import qrcode from 'qrcode-terminal';

//Figlet
import figlet from 'figlet';
const { textSync } = figlet;

//Banner
import { set } from 'simple-banner';
import { logsError, logsSave, logsSend, logsUserSend } from './src/view/logs_view.js';

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { newOpr, reqOpr } from './src/controller/add_opr.js';
import { reqOprView } from './src/view/opr_req_view.js';
import { decrypted } from './src/module/crypto.js';

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

        let contacts = new Array();

        reqOpr().then(
            response =>{
                response.data.forEach(element => {
                    contacts.push(decrypted(element.contact));
                });
            }
        ).catch(
            error => logsError(error)
        )

        if(msg.body.startsWith('!newopr')){

            let contact = `${msg.body.split(' ')[1]}@c.us`;
            let name = msg.body.split(' ')[2];

            newOpr(contact, name).then(
                response => logsSend(response.data)
            ).catch(
                error => logsError(error)
            )

        } else if (msg.body.startsWith('!reqopr')){

            logsSave("Starting Request")

            await reqOpr().then(
                response => reqOprView(response.data, msg.from).then(
                    response => logsSend(response.data)
                ).catch(
                    error => logsError(error)
                )

            ).catch(
                error => logsError(error)
            )
        } else if ((msg.body).toLowerCase().startsWith('register#')){
            //register#clientID
        } else {    

            if (msg.from === "62895601093339@c.us"){
                
                try {

                    // Create newData
                    let oprReady = false;
                    let chatList = readdirSync(`json_data/chat_session/`);
                    // Check Chat ID State & Data
                    if(chatList.includes(`${msg.from}.json`)){
                        chatList.forEach(element => {
                            if (element === `${msg.from}.json`){
                                let chatData = JSON.parse(readFileSync(`json_data/chat_session/${element}`));
                                if(chatData.status){
                                    logsUserSend(chatData.opr, 
                                    `Client : ${msg.from}\n\nPesan : ${msg.body}`);
                                }
                            }
                        });

                    } else {
                        reqOpr().then(
                            response =>{
                                response.data.forEach(element => {

                                    if (!element.status){   

                                        element.status = true;

                                        let newChat = new Object();    
                                        newChat.timestamp = msg.timestamp;
                                        newChat.from = msg.from;
                                        newChat.opr = decrypted(element.contact);
                                        newChat.status = true;
                
                                        oprReady = true;        

                                        writeFileSync(`json_data/chat_session/${msg.from}.json`, JSON.stringify(newChat));    

                                        writeFileSync(`json_data/opr_data/opr_file.json`, JSON.stringify(response.data));

                                        logsUserSend(decrypted(element.contact), 
                                        `Client : ${msg.from}\n\nPesan : ${msg.body}`);
                                    }
            
                                    if (!oprReady){
                                        
                                        logsUserSend(
                                            msg.from, 
`Mohon Maaf, Saat ini CS Kami sedang melayani pelanggan lainnya,
Silahkan tunggu beberapa saat lagi, kami akan segera menghubungi anda kembali.
Terimakasih sudah bersabar menunggu.`
                                        );
                                    }
                                    
                                });

                            }
                        ).catch(
                            error => logsError(error)                            
                        );
                    }
                } catch (error) {

                    let oprReady = false;

                    reqOpr().then(
                        response =>{
                            response.data.forEach(element => {

                                if (!element.status){

                                    element.status = true;

                                    writeFileSync(`json_data/opr_data/opr_file.json`, JSON.stringify(response.data));

                                    oprReady = true;
                                    newChat.opr = decrypted(element.contact);
                                    mkdirSync(`json_data/chat_session/`);
                                    writeFileSync(`json_data/chat_session/${msg.from}.json`, 
                                        JSON.stringify(newChat));
        
                                    logsUserSend(decrypted(response.contact), 
                                    `Client : ${msg.from}\n\nPesan : ${msg.body}`);
                                }
        
                                if (!oprReady){
                                    logsUserSend(
                                        msg.from, 
`Mohon Maaf, Saat ini CS Kami sedang melayani pelanggan lainnya,
Silahkan tunggu beberapa saat lagi, kami akan segera menghubungi anda kembali.
Terimakasih sudah bersabar menunggu.`
                                    );
                                }
                                
                            });

                        }
                    ).catch(
                        error => {
                            logsError(error);
                        }
                    );       
                }

                // if (!contact.isMyContact){
                //     //Save Contact Here
                //     let newContact = new Object();
                //     newContact.contact = msg.from;
                //     newContact.pushname = msg.pushname ? msg.pushname : msg.contact;

                //     try {

                //         let contactList = readFileSync(`json_data/contact_data/contact_file.json`);
                //         let contacts = new Array();

                //         contactList.forEach(element => {
                //             contacts.push(element.contact);
                //         });

                //         if (!contacts.includes(msg.from)){
                //             contactList.push(contact)
                //             writeFileSync(`json_data/contact_data/contact_file.json`, JSON.stringify(contactList));
                //         }

                //     } catch (error) {
                //         contactList.push(newContact)
                //         mkdirSync(`json_data/contact_data/`);
                //         writeFileSync(`json_data/contact_data/contact_file.json`, JSON.stringify(contactList));
                //     } 
                // }
            }
        }

    } catch (error) { //Catching the Error Request
        logsSend(error, "Main Apps");
    }
});