//PORT
process.env.PORT = process.env.PORT || 3000;

//ENVIROMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//DATABASE
let urlDB;

//EXPIRATION DATE
// seconds * minutes * hours * days 
process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;

//SEED
process.env.SEED = process.env.SEED || 'Living.In.The.Sunlight';

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/stilltaiga';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;