var schedule = require('node-schedule');
var axios = require('axios');

var getStockDetails = async () => {
    try {
        var res = await axios.get('https://dev.kwayisi.org/apis/gse/live');
        var stocks = res.data;
        return stocks;
    } catch (e) {
        throw new Error('Could not fetch stocks from stock api', e);
    }
    
}

var postStockDetails = (data) => {
    console.log(JSON.stringify(data, null, 2));
    console.log(data.length)
}

var worker = schedule.scheduleJob('*/1 * * * *', async () => {
    try{
        var data = await getStockDetails();
        postStockDetails(data);
    } catch (e){
        throw new Error('Unable to execute worker');
    }
    
});


