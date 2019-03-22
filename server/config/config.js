//PORT
process.env.PORT = process.env.PORT || 3000;

//ENVIROMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Data Base
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/stilltaiga';
} else {
    urlDB = 'mongodb+srv://mojicator:oOvglOGEgCHOAPbf@cluster0-ez2fe.mongodb.net/test';
}

process.env.URLDB = urlDB;