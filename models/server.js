const express = require('express');
const cors = require('express');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.PORT = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            users: '/api/users',
            uploads: '/api/uploads',
            search: '/api/search',
        };

        // Database connection
        this.databaseConnect();

        // Middlewares
        this.middlewares();


        // Routes
        this.routes();
    }

    async databaseConnect() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Read an parse of body
        this.app.use( express.json() );

        // Public directory
        this.app.use( express.static('public') );

        // Fileupload
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir  : '/tpm/',
            createParentPath: true
        }) )

    }

    routes() {

        this.app.use( this.paths.auth, require('../routes/auth') );
        this.app.use( this.paths.users, require('../routes/user') );
        this.app.use( this.paths.categories, require('../routes/categories') );
        this.app.use( this.paths.products, require('../routes/products') );
        this.app.use( this.paths.search, require('../routes/search') );
        this.app.use( this.paths.uploads, require('../routes/uploads') );
          
    }

    listen() {
        this.app.listen(this.PORT, () => {
            console.log('Server running on port: ', this.PORT)
        });
    }

}

module.exports = Server;