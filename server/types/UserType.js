const graphql = require( 'graphql' )
const User = require( '../models/UserModel')

// This creates a GraphQL object type that uses
// the MongoDB Event model/schema.  In each
// resolve() function, we convert from
// GraphQL to Mongo.

const { 
    GraphQLObjectType,
    GraphQLString, 
    GraphQLID, 
    GraphQLList
} = graphql

const UserType = new GraphQLObjectType( {
    name: 'UserType',
    fields: () => ( {
        id:            { type: GraphQLID },
        email:         { type: GraphQLString },
        password:      { type: GraphQLString },
        createdEvents: {
            // Do the require below to prevent a circular reference
            type: new GraphQLList( require( './EventType' ) ), 
            resolve( parentValue ) {
                // return User.findEvents( parentValue.id );
                return User.findById( parentValue.id )
                    .populate( 'createdEvents' )
                    .then( user => user.createdEvents );
            }
        }
    } )
} )

module.exports = UserType
