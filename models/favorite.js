const mongoose = require('mongoose');
const { Schema } = mongoose;

const FavoriteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
        type: Schema.Types.ObjectId,
        ref: 'Dish'
    }]
}, {
    timestamps: true

});

module.exports = mongoose.model('Favorite', FavoriteSchema);