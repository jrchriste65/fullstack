const jwtoken = require( 'jsonwebtoken' );
const mySuperSecretKey = require( '../other/miscValues' );

// 'isAuth' is middleware we created that will
// take an auth token off the request header and
// validate it.
//
// Note that we never return an error.  Doing so can 
// lockup the GraphQL router in app.js.

const isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if ( !authHeader ) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    if ( ( !token ) || ( token === '' ) ) {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwtoken.verify( token, mySuperSecretKey );
    }
    catch ( err ) {
        req.isAuth = false;
        return next();
    }
    if ( !decodedToken ) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    return next();
};

module.exports = isAuth;
