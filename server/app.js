const express =          require( 'express' );
const bodyParser =       require( 'body-parser' );
const graphqlHTTP =      require( 'express-graphql' );
const mongoose =         require( 'mongoose' );
const Schema =           require( './schema/schema' );
const isAuth =           require( './middleware/isAuth' );

const app = express();

app.use( bodyParser.json() );
 
// Connect to MongoDB before we use GraphQL
mongoose.connect( 'mongodb://jrchriste65:mlab503@ds149616.mlab.com:49616/fullstack', { useNewUrlParser: true } )
    .then( () => { /* No-op */ } )
    .catch( err => { console.log( err ); process.exit(); } );

// Make sure we can connect
mongoose.connection.once( 'open', () => { console.log( 'Connected to MLab DB ...' ) } );

app.use( isAuth );

app.use( 
    '/graphql', 
    graphqlHTTP( { schema: Schema, graphiql: true } ) 
);

const PORT = 4000
app.listen( PORT, () => console.log( `Listening on port ${PORT} ...` ) );
