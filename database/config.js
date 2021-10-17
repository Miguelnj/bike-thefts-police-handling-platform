const mongoose = require('mongoose');


const dbConnection = async () => {

    try{
        await mongoose.connect(process.env.MONGODB_CONNECTION);
    }catch(error){
        console.log(error);
        throw new Error('Error while connecting to the database');
    }

};

module.exports = {dbConnection};