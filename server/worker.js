require('./config/config.js');
const {mongoose} = require('./db/mongoose');
const {Stock} = require('./models/stock');

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

var postStockDetails = async (stocks) => {
    await Stock.collection.deleteMany({});
    Stock.collection.insertMany(stocks, (err, docs) => {
        if(err) {
            console.log('Unable to insert stocks into db', err)
        } else {
            console.log(`Inserted ${docs.insertedCount} items`)
        }
    });
}

// var worker = schedule.scheduleJob('*/1 * * * *', async () => {
//     try {
//         var stocks = await getStockDetails();
//         await postStockDetails(stocks);
//     } catch (e){
//         throw new Error('Unable to execute worker');
//     }
    
// });

var worker = async () => {
    try {
        var stocks = await getStockDetails();
        await postStockDetails(stocks);

    } catch (e){
        throw new Error('Unable to execute worker', e);
    }
}

worker();

