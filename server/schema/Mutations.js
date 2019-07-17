const graphql =       require( 'graphql' );
const bcryptjs =      require( 'bcryptjs' );
const Event =         require( '../models/EventModel' );
const EventType =     require( '../types/EventType' );
const User =          require( '../models/UserModel' );
const UserType =      require( '../types/UserType' );
const Booking =       require( '../models/BookingModel' );
const BookingType =   require( '../types/BookingType' );

const { 
    GraphQLObjectType,
    GraphQLString, 
    GraphQLID, 
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull 
} = graphql;

// Create our Mutations object
const Mutations = new GraphQLObjectType( {
    name: 'Mutations',
    fields: {
        createUser: {
            type: UserType,
            args: {
                email:    { type: new GraphQLNonNull( GraphQLString ) },
                password: { type: new GraphQLNonNull( GraphQLString ) }
            },
            resolve( parent, args ) {
                return User.findOne( { email: args.email } )
                    .then( user => {
                        // 'findOne()' always returns something here, even if null 
                        if ( user ) {
                            throw new Error( `User ${ user.email } already exists`);
                        } 
                        return bcryptjs.hash( args.password, 12 ); // Continue the chain
                    })
                    .then( hashedPassword => {
                        const user = new User( {
                            email: args.email,
                            password: hashedPassword
                        })
                        return user.save()
                    })
                    .catch( err => { throw err; } )
            }
        },
        createEvent: {
            type: EventType,
            args: {
                title:       { type: new GraphQLNonNull( GraphQLString ) },
                description: { type: new GraphQLNonNull( GraphQLString ) },
                price:       { type: new GraphQLNonNull( GraphQLFloat ) }
            },
            resolve( parent, args, req ) { 
                if ( !req.isAuth ) {
                    throw new Error ( 'Not Authenticated' );
                }
                const now = new Date()
                const msecsString = now.getTime().toString()
                const event = new Event({
                    title: args.title,
                    description: args.description,
                    price: +args.price, // The '+' means 'convert to its type (float)
                    date: msecsString,
                    creator: req.userId
                });
                let createdEvent;
                return event
                    .save()
                    .then( result => {
                        // save() return a GraphQL object.  We
                        // only need the ._doc portion. 
                        createdEvent = { ...result._doc };
                        return User.findById( req.userId );
                    })
                    .then( user => {
                        if ( !user ) {
                            throw new Error( `User ${ user.email } does not exist` );
                        }
                        // Add the event 
                        user.createdEvents.push( event );
                        return user.save();
                    })
                    .then( result => {
                        // Here, 'result' is our saved user, not the event.
                        // So return the event we saved earlier.
                        return createdEvent;
                    })
                    .catch( err => { throw err; } );
            }
        },
        bookEvent: {
            type: BookingType,
            args: {
                event: { type: new GraphQLNonNull( GraphQLID ) }
            },
            resolve( parent, args, req ) {
                if ( !req.isAuth ) {
                    throw new Error ( 'Not Authenticated' )
                }
                return Booking.findOne( { event: args.event, user: req.userId } )
                    .then( booking => {
                        // 'findOne()' always returns something here, even if null 
                        if ( booking ) {
                            throw new Error ( 'Event/User pair already exists' );
                        }
                        return;
                    })
                    .then( () => {
                        const now = new Date()
                        const msecsString = now.getTime().toString()
                        const booking = new Booking({
                            user:      req.userId,
                            event:     args.event,
                            updatedAt: msecsString,
                            createdAt: msecsString
                        });
                        return booking.save();
                    })
                    .catch( err => { throw err; } );
            }
        },
        cancelBooking: {
            type: EventType,
            args: { id: { type: new GraphQLNonNull( GraphQLID ) } },
            resolve( parent, args, req ) {
                if ( !req.isAuth ) {
                    throw new Error ( 'Not Authenticated' )
                }
                return Booking.findByIdAndDelete( args.id )
                    .populate( 'event ')
                    .then( booking => {
                        // 'findOneAndDelete()' always returns something here, even if null 
                        if ( !booking ) {
                            throw new Error ( `Booking ${ args.id } not found` );
                        }
                        return booking.event;
                    })
                    .catch( err => { throw err; } );
            }
        }
    }
});

module.exports = Mutations;
