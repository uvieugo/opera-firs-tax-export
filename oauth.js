const http = require('https');
const querystring = require('querystring');
const fs = require('fs');

const {grant_type,username,password,client_id,client_secret,auth_host,auth_protocol,auth_method,auth_path,auth_port} = require('./config');
module.exports = () => {

    return new Promise( resolve => {
        let auth_data = querystring.stringify({
            'grant_type': grant_type,
            'username': username,
            'password': password,
            'client_id' : client_id,
            'client_secret' : client_secret
        })
        
        let options = {
            protocol: auth_protocol,
            host: auth_host,
            port: auth_port,
            path: auth_path,
            method: auth_method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        
        }
        
        var post_req = http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', data => {
                fs.writeFile('./auth.json', data, err => {
                    if (err) {
                        console.log('Error writing file', err);
                    } else {
                        let today = new Date();
                        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        console.log(time);
                        console.log(`Successfully wrote file at ${time}`);
                    }
                })
                resolve(JSON.parse(data));
            })
        })
        
        post_req.write(auth_data)
        post_req.end();  
    });
}

