const fs = require('fs');
const util = require('util');
const http = require('https');
const md5 = require('md5');
const readFile = util.promisify(fs.readFile);
const {client_secret,vat_number,business_place,tax_host,tax_method,tax_path,tax_port,tax_protocol} = require('./config');

module.exports = async (totalValue,taxRate,baseValue,taxValue) => {
        let token = JSON.parse(await readFile('auth.json'));
        let access_token = token.access_token
        return new Promise (resolve => {
            let result
            let secretKey = client_secret
            let business_device = "1";
            let bill_number = "1";
            let bill_datetime = new Date().toISOString().slice(0,-5);
            let total_value = totalValue;
            let payment_type = "C";
            let security_code = md5(secretKey+vat_number+business_place+business_device+bill_number+bill_datetime+total_value);
            let rate = taxRate;
            let base_value = baseValue;
            let value = taxValue;

            var post_data = JSON.stringify({
                    "bill": {
                    "vat_number": vat_number,
                    "business_place": business_place,
                    "business_device": business_device,
                    "bill_number": bill_number,
                    "bill_datetime": bill_datetime,
                    "total_value": total_value,
                    "payment_type": payment_type,
                    "security_code": security_code
                    },
                      "bill_taxes": [
                    {
                      "rate": rate,
                      "base_value": base_value,
                      "value": value
                    }
                  ],
                  "bill_tax_gst": [
                    {
                      "rate": rate,
                      "base_value": base_value,
                      "value": value
                    }
                  ]
            })
          
            var post_options = {
                protocol: tax_protocol,
                host: tax_host,
                port: tax_port,
                path: tax_path,
                method: tax_method,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(post_data),
                    'Authorization': `Bearer ${access_token}`
                }
            };
      
            var post_req = http.request(post_options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    // console.log('Response: ' + chunk);
                    result = chunk;
                    resolve(result);
                });
            });
            
            post_req.on('error', (e) => {
                console.error(`problem with request: ${e.message}`);
            });
          
            // post the data
            post_req.write(post_data);
            post_req.end();
        });
}