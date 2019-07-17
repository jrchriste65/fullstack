const graphql = require( 'graphql' );

const { 
    GraphQLObjectType,
    GraphQLString, 
    GraphQLInt,
    GraphQLID, 
} = graphql;

const AuthDataType = new GraphQLObjectType({
    name: 'AuthDataType',
    fields: () => ({
        id:              { type: GraphQLID },
        userId:          { type: GraphQLID },
        token:           { type: GraphQLString },
        tokenExpiration: { type: GraphQLInt }
    })
});

module.exports = AuthDataType;