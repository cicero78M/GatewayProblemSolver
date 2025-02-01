import { mkdirSync, readdirSync,  writeFileSync } from "fs";
import { encrypted } from "../module/crypto.js";

export async function addNewUser(contact, clientId) {
   
    const newUser = new Object();
    newUser.contact = encrypted(contact);
    newUser.id = encrypted(clientId);
    newUser.status = encrypted("TRUE");


    return new Promise((resolve, reject) => {

        try {

            let userList = JSON.parse(readdirSync(`json_data/user_data`));

            if (!userList.includes(`${contact.replace('@c.us', '')}.json`)){
                try {
                    mkdirSync(`json_data/user_data`);
                    writeFileSync(`json_data/user_data/${contact.replace('@c.us', '')}.json`, JSON.stringify(newUser));                    
                } catch (error) {
                    writeFileSync(`json_data/user_data/${contact.replace('@c.us', '')}.json`, JSON.stringify(newUser));                    
                }

                let data = {
                    data: 'New User Added Succesfully',
                    state: true,
                    code: 200
                  };
                  resolve (data);
                  
            } else {

            let data = {
                data: 'User Already Exists',
                state: true,
                code: 201
                };

                reject (data);
            }
    
        } catch (error) {

            let userList = new Array();

            userList.push(newUser);

            mkdirSync(`json_data/user_data`);
            writeFileSync(`json_data/user_data/userList.json`, JSON.stringify(userList));

            let data = {
                data: 'New User Added Succesfully',
                state: true,
                code: 200
              };
              resolve (data);
        }    
    });
}