const net = require('net');
const firs_tax = require('./firs_post');
const {pos_port,tax_rate} = require('./config');
const not_taxable = ["1000"]

// Create TCP SERVER

module.exports = () => {
      const server = net.createServer((c) => {
          c.on('end', () => {
            console.log('client disconnected');
          });
          c.on('data', (data) => {
              let fData = Buffer.from(data).toString('ascii');
              let posId= fData.slice(fData.indexOf('\u0001')+1,fData.indexOf('\u0002'));
              if (posId.trim() == "0"){
                c.write(data);
              }else{
                let sPoint = fData.indexOf('\u0002')+1;
                let ePoint = fData.indexOf('\u0003');
                let fExt = fData.slice(sPoint,ePoint);
                let resultArr = fExt.split('\u001c')
                console.log(fData)
                console.log(resultArr);
                let totalValue = resultArr[4]
                let rate = (parseFloat(resultArr[3]) * 100).toFixed(2);
                let taxValue1 = resultArr[5]
                let taxValue2 = resultArr[6]
                let tenderMedia = resultArr[7];
                if (not_taxable.includes(tenderMedia)){
                  c.write(create_pos_message(posId,""));
                }else{
                  let baseValue = parseFloat(totalValue) - ( parseFloat(taxValue1) + parseFloat(taxValue2));
                  console.log(`Total Amount: ${totalValue}, VAT Rate: ${rate}, Value without Tax: ${baseValue}, VAT Amount: ${taxValue2}`);
                  firs_tax(totalValue,rate,baseValue,taxValue2).then(response => {
                    console.log(response)
                    let result = JSON.parse(response).payment_code
                    c.write(create_pos_message(posId,result))
                  });
                }
              }
          });
      }); 
        
      server.on('error', (err) => {
        console.log(err);
        throw err;
      });
        
      server.listen(pos_port, () => {
          console.log('POS Endpoint is Running');
      });
}

function create_pos_message(posId,taxcode){
  let pos_message;
  const SOH = String.fromCharCode(01);
  const STX = String.fromCharCode(02);
  const ETX = String.fromCharCode(03);
  const EOT = String.fromCharCode(04);
  const FS = String.fromCharCode(28);
  const appSeq = "01 ";
  const messId = "TaxDetail"
  const tax_code = taxcode;
  pos_message = SOH + posId + STX + FS + appSeq + messId + FS + tax_code + ETX + EOT;
  console.log(pos_message);
  return pos_message;
}
