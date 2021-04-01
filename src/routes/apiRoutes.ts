import RepositoryController from '../controllers/repositoryController';
import RepositoryMiddleware from '../middleware/repositoryMiddleware';
import express from 'express';

export class Routes{
    
    app: express.Application;
    constructor(app: express.Application) {
        this.app = app;
        this.configureRoutes();
    }

    configureRoutes() {
        this.app.post(`/tui.api/v1/repositoryDetails`,[
            RepositoryMiddleware.validateHeader,
            RepositoryMiddleware.validateRequest,
            RepositoryController.getRepositoryDetails,
        ]);
        this.app.post(`/`,[
            RepositoryController.commonMethod
        ]);
        return this.app;
    }
}