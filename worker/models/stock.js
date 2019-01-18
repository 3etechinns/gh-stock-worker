var mongoose = require('mongoose');

var StockSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    price : {
        type: Number,
        required: true,
        trim: true
    },
    change : {
        type: Number,
        required: true,
        trim: true
    },
    volume : {
        type: Number,
        required: true,
        trim: true
    }
});

var Stock = mongoose.model('Stock', StockSchema);

module.exports = {Stock}