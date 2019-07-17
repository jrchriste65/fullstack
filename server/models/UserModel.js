const mongoose = require('mongoose');
const Schema = mongoose.Schema

// This creates the MongoDB User schema and model.
const userSchema = new Schema( {
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdEvents: [ {
        type: Schema.Types.ObjectId,
        ref: 'Event' // The name passed to mongoose.model()
    } ]
}, { 
    usePushEach: true 
})

// Create the User model using 'userSchema'.
const UserModel = mongoose.model( 'User', userSchema )
module.exports = UserModel
