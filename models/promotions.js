const mongoose = require('mongoose');
const { Schema } = mongoose;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

const PromoSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true

    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: "New"
    },
    price: {
        type: Currency,
        required: true
    }, 
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
    
});

module.exports = mongoose.model('Promotion', PromoSchema);