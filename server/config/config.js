//PORT
process.env.PORT = process.env.PORT || 3001;

//ENVIROMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//DATABASE
let urlDB;

//EXPIRATION DATE
// seconds * minutes * hours * days 
process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;

//Google SignIn
process.env.CLIENT_ID = process.env.CLIENT_ID || '69900441704-v0t5haa24svbtqgg5bv231210f9av0hj.apps.googleusercontent.com';

//SEED
process.env.SEED = process.env.SEED || 'Living.In.The.Sunlight';

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/stilltaiga';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;