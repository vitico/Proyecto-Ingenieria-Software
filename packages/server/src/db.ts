import mongoose from "mongoose";
import {Mockgoose} from "mockgoose";

const dbHost = "db.homelab.vitico.space";
const dbPort = "27017";
const dbName = "movil";
let uri = `mongodb://root:pass12345@${dbHost}:${dbPort}/${dbName}?authSource=admin` 
export function connect() {
    return new Promise<void>((resolve, reject) => {
        let doConn = () => {
            return mongoose.connect(uri, {
                
                ssl: false, useNewUrlParser: true,useUnifiedTopology: true, 
            }).then(() => {
                resolve();
            }).catch(err => reject(err));
        }
        if (process.env.NODE_ENV === 'test') {

            const mockgoose = new Mockgoose(mongoose);

            mockgoose.prepareStorage()
                .then(doConn)
        } else {
            doConn();
        }
    });
}

export function close() {
    return mongoose.disconnect();
}

module.exports = {connect, close};