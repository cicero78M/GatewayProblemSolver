import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { decrypted, encrypted } from "../module/crypto.js";
import { logsSave } from "../logs_view.js";

export async function newOpr(contact, name) {
   
    const newOpr = new Object();
    newOpr.contact = encrypted(contact);
    newOpr.name = encrypted(name);
    newOpr.status = encrypted("false");


    return new Promise((resolve, reject) => {

        try {

            let oprList = new Array();

            oprList = JSON.parse(readFileSync(`json_data/opr_data/opr_file.json`));
            let operators = new Array();

            logsSave(oprList);
    
            oprList.forEach(element => {
                operators.push(decrypted(element.contact));
            });
    
            if (!operators.includes(contact)){
                oprList.push(newOpr)
                writeFileSync(`json_data/opr_data/opr_file.json`, JSON.stringify(oprList));

                let data = {
                    data: 'New operator Added Succesfully',
                    state: true,
                    code: 200
                  };
                  resolve (data);
            
            } else {

            let data = {
                data: 'Operator Already Exists',
                state: true,
                code: 201
                };
                reject (data);
            }
    
        } catch (error) {

            let oprList = new Array();

            oprList.push(newOpr);

            mkdirSync(`json_data/opr_data/`);
            writeFileSync(`json_data/opr_data/opr_file.json`, JSON.stringify(oprList));

            let data = {
                data: 'New operator Added Succesfully',
                state: true,
                code: 200
              };
              resolve (data);
        }    
    });
}

export async function reqOpr() {

    logsSave("Req Opr Function Starting")
    
    return new Promise((resolve, reject) => {

        try {

            let oprList = JSON.parse(readFileSync(`json_data/opr_data/opr_file.json`));
            
            let data = {
                data: oprList,
                state: true,
                code: 200
              };

              resolve (data);

        } catch (error) {

            let data = {
                data: error,
                msg : "Error on Req Opr List",
                state: true,
                code: 303
                };
            reject (data);
        }  
    });
}