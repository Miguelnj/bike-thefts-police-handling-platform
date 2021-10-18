const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.middleWares();

        this.databaseConnect()
            .then(() => console.log("MongoDB Operative"))
            .catch((err) => console.log(`Could not connect database\n${err}`));

        this.routes();
    }

    middleWares(){
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    async databaseConnect() {
        await dbConnection();
    }

    routes() {
        this.app.use('/api/users', require('../routes/users'));
        this.app.use('/api/cases', require('../routes/cases'));
        this.app.use('/api/departments', require('../routes/departments'));

        this.app.use('/api/users/', require('../routes/users'));
    }

    start() {
        this.app.listen(process.env.PORT, () => {
            console.log("Server running on port " + this.port);
        });
    }

}

module.exports = Server;