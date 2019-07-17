const mongoose = require( 'mongoose' );

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // We could specify MongoDB 'createdAt' and 'updatedAt'
    // using "{ usetimestamps: true }", but I want to 
    // keep the timestamps as integers
    createdAt: {
        type: String,
        required: true,
        required: true
    },
    updatedAt: {
        type: String,
        required: true,
        required: true
    }
});

const BookingModel = mongoose.model('Booking', bookingSchema );
module.exports = BookingModel;