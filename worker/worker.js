require('./config/config.js');
const {mongoose} = require('./db/mongoose');
const {Stock} = require('./models/stock');

var socketIOClient = require('socket.io-client');
var axios = require('axios');

const socket = socketIOClient('http://127.0.0.1:3000');

socket.on('connect', () => {
    console.log('connected to sever');

    socket.on('disconnect', () => {
        console.log('disconnected from server');
    });
})

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
    try {
        await mongoose.connection.dropCollection('stocks');
        let docs = await Stock.insertMany(stocks);
        console.log(`Inserted ${docs.length} items`);
        socket.emit('stocksUpdated', docs.length);
    } catch(e) {
        throw new Error('Unable to insert stocks into db', e);
    }    
}

var worker = async () => {
    try {
        var stocks = await getStockDetails();
        await postStockDetails(stocks);     
        process.exit();
    } catch (e){
        console.log('Unable to execute worker', e);
        process.exit();
    }
}

worker();

