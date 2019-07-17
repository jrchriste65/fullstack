const graphql =   require( 'graphql' );
const UserType =  require( './UserType' );
const EventType = require( './EventType' );
const Booking =   require( '../models/BookingModel' );

// This creates a GraphQL object type that uses
// the MongoDB User and Event models.  In each
// resolve() function, we convert from
// GraphQL to Mongo.

const { 
    GraphQLObjectType,
    GraphQLString, 
    GraphQLID, 
    GraphQLFloat
} = graphql;

const BookingType = new GraphQLObjectType({
    name: 'BookingType',
    fields: () => ({
        id:        { type: GraphQLID },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
        event:   { 
            type: EventType,
            resolve ( parentValue ) {
                return Booking.findById ( parentValue )
                    .populate( 'event' )
                    .then( booking => booking.event )
            }
        },
        user:    { 
            type: UserType,
            resolve ( parentValue ) {
                return Booking.findById ( parentValue )
                    .populate( 'user' )
                    .then( booking => booking.user )
            }
        }
    })
});

module.exports = BookingType;