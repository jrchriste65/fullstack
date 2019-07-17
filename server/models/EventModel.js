const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema

// This creates the MongoDB Event schema and model.
const eventSchema = new Schema( {
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,  // Actually, it's a float
        required: true
    },
    date: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User' // The name passed to mongoose.model()
    }
}, { 
    usePushEach: true 
} )

// Create the Event model using 'eventSchema'.
const EventModel = mongoose.model( 'Event', eventSchema )
module.exports = EventModel
