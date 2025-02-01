import { logsSave, logsUserSend } from "./logs_view.js";
import { decrypted } from "../module/crypto.js";

export async function reqOprView(params, from) {

    logsSave("Start Presenting Data View");
    return new Promise((resolve, reject) => {

        try {

            params.forEach(element => {
                
                logsUserSend (from,
                    `Data operator :
                    Nama : ${decrypted(element.name)}
                    Contact : ${decrypted(element.contact)}
                    Working Status : ${element.status} 
                    `
                ); 
                
            });

            let data = {
                data: 'End of Operator Request Data List',
                state: true,
                code: 200
            };

            resolve (data);

        } catch (error) {

                let data = {
                    data: error,
                    msg : "Error on Req Opr View",
                    state: true,
                    code: 303
                    };
                reject (data);        
        }
        
    });

}