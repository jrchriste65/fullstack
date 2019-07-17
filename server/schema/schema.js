const graphql =   require( 'graphql' )
const RootQuery = require( './RootQuery' )
const Mutations = require( './Mutations' )

const { GraphQLSchema } = graphql

// Create our GraphQL schema using the root query and mutations objects
const Schema = new GraphQLSchema( { query: RootQuery, mutation: Mutations } )

module.exports = Schema
