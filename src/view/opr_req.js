import { logsSave, logsUserSend } from "../logs_view.js";
import { decrypted } from "../module/crypto.js";

export async function reqOprView(params, from) {

    logsSave("Start Presenting Data View");
    logsSave(params);

    try {

        params.forEach(element => {
            logsSave(element);



            let oprData = new Object();

            oprData.name = decrypted(element.name);
            oprData.contact = decrypted(element.contact);
            oprData.status = decrypted(element.status);
    
            logsUserSend (from,
                `Data operator :
                Nama : ${oprData.name}
                Contact : ${oprData.contact}
                Working Status : ${oprData.status} 
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
}