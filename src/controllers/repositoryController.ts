import express from 'express';
import axios from 'axios';
import {constObj} from '../config/globals';

class RepositoryController {

    headers:any = {
        'Accept': 'application/vnd.github.v3+json'
    }

    //Method for load balancer health checks
    checkHealth = async(req: express.Request, res: express.Response)=> {
        try
        {
            res.status(200).send();
        }
        catch(e)
        {
            res.status(500).send({
                status : 500,
                Message: constObj.GENERAL_EXCEPTION
            });
        }
    }
    //Get the repository details for the username
    getRepositoryDetails = async(req: express.Request, res: express.Response)=> {
        try
        {
            var userName:string = req.body.userName;
            //Get all the repositories for that username
            const userRepositories = await this.getRepositories(userName);
            if(userRepositories!= null && userRepositories.length > 0)
            {
                var response: any = [];
                //If its a valid github user
                for(const userRepository of userRepositories)
                {
                    var repository:any = {
                        "name" : userRepository.name,
                        "owner" : userRepository.owner.login,
                    }
                    //Get all the branches in that repository
                    var branches:any = await this.getBranches(userName,userRepository.name);
                    if(branches)
                    {
                        repository["branches"] = branches;
                        response.push(repository);
                    }
                };
                res.status(200).send({
                    status : 200,
                    Message: response
                });
            }
            else
            {
                res.status(404).send({
                    status : 404,
                    Message: constObj.USERNAME_NOT_FOUND
                });
            }
        }
        catch(e)
        {
            res.status(500).send({
                status : 500,
                Message: constObj.GENERAL_EXCEPTION
            });
        }
    }

    //Gets all the repositories for a username
    async getRepositories(userName: string)
    {
        try
        {
            const response = await axios({
                url : `https://api.github.com/users/${userName}/repos`,
                headers: this.headers,
                method : "get",
            });
            if(response.hasOwnProperty("data"))
            {
                var json_response:any = JSON.parse(JSON.stringify(response.data));
                return json_response;
            }
            else
            {
                return []; 
            }
        }
        catch(e)
        {
            return null;
        }
    }
    //Gets all the branches in a repository
    async getBranches(userName: string,repoName: string)
    {
        try
        {
            const response = await axios({
                url : `https://api.github.com/repos/${userName}/${repoName}/branches`,
                headers: this.headers,
                method : "get",
            });
            var json_response:any = JSON.parse(JSON.stringify(response.data));
            var branches:any = await this.formatBranchesResponse(json_response);
            return branches;
        }
        catch(e)
        {
            return null;
        }
    }
    //Format's the branch response.
    async formatBranchesResponse(branches:Array<any>)
    {
        try
        {
            var branch_details:Array<any> = []; 
            branches.forEach(function (value) {
                branch_details.push({
                    "name" : value.name,
                    "commit" : value.commit.sha
                });
            });
            return branch_details;
        }
        catch(e)
        {
            return null;
        }
    }
}

export default new RepositoryController();