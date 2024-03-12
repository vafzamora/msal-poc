const express = require('express');
const cors = require("cors")
const jwt = require("jsonwebtoken")
const jwksClient = require("jwks-rsa")

const webApiConfig = require("./config/WEB-API.json");

const corsOptions = {
    origin: "http://localhost:4200",
    optionsSuccessStatus: 200
}

const validateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        
        const validationOptions = {
            audience: webApiConfig.authOptions.audience,
            issuer: webApiConfig.authOptions.authority, 
        };
        
        jwt.verify(token, getSigningKeys, validationOptions, (err, payload) => {
            req.decoded = payload; 
            if (err) {
                console.log(err);
                return res.sendStatus(403);
            }
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

const requireRole = (requiredRole) => (req, res, next)=>{
    if( requiredRole != "" 
            && req.decoded != undefined 
            && req.decoded.roles.findIndex(role=>role==requiredRole)>=0 ){
        next();
    }else{
        res.sendStatus(403);
    } 

}

const getSigningKeys = (header, callback) => {
    var client = jwksClient({
        jwksUri: webApiConfig.discoveryKeysEndpoint,
    });
    
    client.getSigningKey(header.kid, function (err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

const app = express();
app.use(cors(corsOptions));
app.use(validateJwt);
app.use(express.json());

const PORT = process.env.PORT || webApiConfig.serverPort;

app.get("/protected",requireRole("secret.reader") ,(request, response) => {
    
    const result = {
        "data": "# This is a secret. # 🤐"
    }
    response.send(result);
})

app.get("/open", (request, response) => {
    const result = {
        "data": "# This is public data. # 😊"
    }
    response.send(result);
})

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});


