const mongoose = require('mongoose');
const { Schema } = mongoose;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

const LeaderSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true

    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
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

module.exports = mongoose.model('Leader', LeaderSchema);
