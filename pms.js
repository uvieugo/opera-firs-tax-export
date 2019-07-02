const server = require('server');
const firs_tax = require('./firs_post')
const {pms_port,tax_rate} = require('./config');
const { get, post } = server.router;
const { render, json } = server.reply;
const { error } = server.router;
const { status } = server.reply;
const { header } = server.reply; 
const cors = [
    ctx => header("Access-Control-Allow-Origin", "*"),
    ctx => header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"),
    ctx => ctx.method.toLowerCase() === 'options' ? 200 : false
  ];
const posRooms = ["940","941","942","914"]
module.exports = () => {
      server({port: pms_port}, [
        get('/', async ctx => {
          console.log(ctx.data);
          let gross_total = parseFloat(ctx.data.gross_total).toFixed(2)
          // let tax_rate = "5.00"
          let net_total = parseFloat(ctx.data.net_total).toFixed(2)
          let tax_total = parseFloat(ctx.data.tax_total_1).toFixed(2)
             if ( !(posRooms.includes(ctx.data.room_num)) ){
              let response = await firs_tax(gross_total,tax_rate,net_total,tax_total).then(response => {
                console.log(response);
                let result = JSON.parse(response).payment_code
                return result;
              });
              return response || status(200);
            }else{
              return status(204);
            }
        }),
      ]).then(ctx => {
        console.log(`PMS Endpoint launched on http://localhost:${ctx.options.port}/`);
      });

}
