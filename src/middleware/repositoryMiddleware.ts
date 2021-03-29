import express from 'express';
import {constObj} from '../config/globals';

class RepositoryMiddleware {
    //Checks if proper headers are present in all the incoming requests, if not send appropriate error msg
    async validateHeader(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.headers && req.headers.hasOwnProperty("accept") && req.headers["accept"] == "application/json") {
            next();
        } else {
            res.status(406).send({
                status : 406,
                Message: constObj.INVALID_HEADER
            });
        }
    }
    //Check if required field in present in the request body, if not send proper error msg.
    async validateRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.body && req.body.userName && req.body.userName != "") {
            next();
        } else {
            res.status(404).send({
                status : 404,
                Message: constObj.MISSING_USERNAME
            });
        }
    }
}

export default new RepositoryMiddleware();