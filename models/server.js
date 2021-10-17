const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.middleWares();

        this.routes();
    }

    middleWares(){
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use('/api/users', require('../routes/users'));
    }

    start() {
        this.app.listen(process.env.PORT, () => {
            console.log("Server running on port " + this.port);
        });
    }

}

module.exports = Server;