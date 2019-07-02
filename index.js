const get_token = require('./oauth');
const pms = require('./pms');
const pos = require('./pos');
const schedule = require('node-schedule');

const start = async () => {
    await get_token();
    pms();
    pos();
    timer();
}
const timer = () => {
    var j = schedule.scheduleJob('*/45 * * * *', function(){  
        get_token();
    });
}
start();