const _ =                require('lodash');
const bcryptjs =         require( 'bcryptjs' );
const jwtoken =          require( 'jsonwebtoken' );
const graphql =          require( 'graphql' );
const mySuperSecretKey = require( '../other/miscValues' );
const Event =            require( '../models/EventModel' );
const EventType =        require( '../types/EventType' );
const User =             require( '../models/UserModel' );
const UserType =         require( '../types/UserType' );
const AuthDataType =     require( '../types/AuthDataType' );
const Booking =          require( '../models/BookingModel' );
const BookingType =      require( '../types/BookingType' );

const { 
    GraphQLObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull
} = graphql;

// Create the root query object
const RootQuery = new GraphQLObjectType( {
    name: 'RootQuery',
    fields: { 
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve( parent, args ) {
                return User.findById( args.id );
            }
        },
        users: {
            type: new GraphQLList( UserType ),
            args: { users: { type: new GraphQLList( GraphQLID ) } },
            resolve( parent, args ) {
                return _.isEqual( args, {} ) ? User.find()
                                             : User.find( { id: { $in: args.users } } );
            }
        },
        login: {
            type: AuthDataType,
            args: { 
                email:    { type: new GraphQLNonNull( GraphQLString ) },
                password: { type: new GraphQLNonNull( GraphQLString ) }
            },
            resolve( parent, args ) {
                // Make sure the user (email) is valid.
                let validUser;
                return User.findOne( { email: args.email } )
                    .then( user => {
                        // 'findOne()' always returns something here, even if null
                        // Validate the user credentials.
                        if ( !user ) {
                            throw new Error( 'Authentication failed.' );
                        }
                        validUser = user;
                        return bcryptjs.compare( args.password, user.password );
                    })
                    .then ( passwordCheckResult => {
                        if ( !passwordCheckResult ) {
                            throw new Error( 'Authentication failed 2.' );
                        }
                        // If we get here, then create a token.
                        const token = jwtoken.sign( 
                            { userId: validUser.id, email: validUser.email },
                            mySuperSecretKey, 
                            { expiresIn: '1h' } 
                        );
                        return { userId: validUser.id, token: token, tokenExpiration: 1 };
                    })
                    .catch( err => {
                        throw new Error( err );
                    })
            }
        },
        event: {
            type: EventType,
            args: { id: { type: GraphQLID } },
            resolve( parent, args ) {
                return Event.findById( args.id );
            }
        },
        events: {
            type: new GraphQLList( EventType ),
            args: { events: { type: new GraphQLList( GraphQLID ) } },
            resolve( parent, args )
            {
                return _.isEqual( args, {} ) ? Event.find()
                                             : Event.find( { id: { $in: args.events } } );
            }
        },
        booking: {
            type: BookingType,
            args: { id: { type: GraphQLID } },
            resolve( parent, args, req ) {
                if ( !req.isAuth ) {
                    throw new Error ( 'Not Authenticated' )
                }
                return Booking.findById( args.id );
            }
        },
        bookings: {
            type: new GraphQLList( BookingType ),
            args: { bookingIds: { type: new GraphQLList( GraphQLID ) } },
            resolve( parent, args, req ) {
                if ( !req.isAuth ) {
                    throw new Error ( 'Not Authenticated' )
                }
                return _.isEqual( args, {} ) ? Booking.find()
                                             : Booking.find( { id: { $in: args.bookingIds } } );
            }
        }
    }
});

module.exports = RootQuery;
