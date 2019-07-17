const graphql =  require( 'graphql' )
const UserType = require( './UserType' )
const Event =    require( '../models/EventModel' )

// This creates a GraphQL object type that uses
// the MongoDB Event model.  In each
// resolve() function, we convert from
// GraphQL to Mongo.

const { 
    GraphQLObjectType,
    GraphQLString, 
    GraphQLID, 
    GraphQLFloat
} = graphql

const EventType = new GraphQLObjectType( {
    name: 'EventType',
    fields: () => ( {
        id:          { type: GraphQLID },
        title:       { type: GraphQLString },
        description: { type: GraphQLString },
        price:       { type: GraphQLFloat },
        date:        { type: GraphQLString },
        creator:     {
            type: UserType,
            resolve( parentValue ) {
                return Event.findById( parentValue )
                    .populate( 'creator' )
                    .then( event => event.creator )
                }
        }
    } )
} )

module.exports = EventType