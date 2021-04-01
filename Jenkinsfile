//Variable to check the status of the stack
def stack_exists = "false"
def getSecurityGroup(){
  return ['sg-08ab5079ccecb9909']
}
pipeline {
    agent any
    environment {
        //Add the account id of the AWS Account from "Manage credentials" in Jenkins
        ACCOUNT_ID = credentials('account_id')
        REGION = "us-east-1"
        STACK_NAME = "tui-ecs-stack"
        ECR_REPO_NAME = "tui-backend"
        TASK_NAME = "tui-backend-task" 
        ECS_SERVICE = "tui-backend-service"
        CONTAINER_NAME = "tui-backend-container"
        CONTAINER_PORT = 8080
        CONTAINER_CPU = 256
        CONTAINER_MEMORY = 512
        CLUSTER_NAME = "tui-backend-cluster"
        DESIRED_COUNT = 1
        SECURITY_GROUP =  getSecurityGroup()
        SUBNET1 = "subnet-82cf59c9"
        SUBNET2 = "subnet-c0badea4"
        PRIORITY = 1
        PATH = "*"
        VPCID = "vpc-2293055a"
        REST_API = "tui-backend-api"
        METHOD_ROUTE = "/tui.api/v1/repositoryDetails"
        TEMPLATE_LOCATION = "file://cloudformation_template.yml"
    }
    stages {
        //Stage that checks if the stack already exists in AWS
        stage('Check if stack exists') {
            steps {
                script
                {
                    try
                    {
                        //Describe-stacks will return the status of the stack if its found, else it will throw exception.
                        instanceInfo = sh (
                                script: "aws cloudformation describe-stacks --stack-name  ${STACK_NAME} --region '${REGION}' --query 'Stacks[0].StackStatus' --output text",
                                returnStdout: true
                        ).trim()
                        stack_exists = "true"
                    }
                    catch(Exception e)
                    {
                        echo "Stack does not exist in AWS."
                    }
                }
            }
        }
        //This step checks the value of "stack_exists" variable and accordingly decides whether stack needs to be created or not.
        stage('Create Stack') {
            steps {
                script
                {
                    //Stack not found, so create stack.
                    if(stack_exists == "false")
                    {
                        sh "aws cloudformation create-stack --stack-name ${STACK_NAME} --template-body ${TEMPLATE_LOCATION} --region '${REGION}' --parameters  ParameterKey=RepositoryName,ParameterValue=${ECR_REPO_NAME} ParameterKey=TaskName,ParameterValue=${TASK_NAME} ParameterKey=ServiceName,ParameterValue=${ECS_SERVICE} ParameterKey=ContainerName,ParameterValue=${CONTAINER_NAME} ParameterKey=ContainerPort,ParameterValue=${CONTAINER_PORT} ParameterKey=ContainerCpu,ParameterValue=${CONTAINER_CPU} ParameterKey=ContainerMemory,ParameterValue=${CONTAINER_MEMORY} ParameterKey=ClusterName,ParameterValue=${CLUSTER_NAME} ParameterKey=SecurityGroup,ParameterValue=${SECURITY_GROUP} ParameterKey=Subnet1,ParameterValue=${SUBNET1} ParameterKey=Subnet2,ParameterValue=${SUBNET2} ParameterKey=Priority,ParameterValue=${PRIORITY} ParameterKey=Path,ParameterValue=${PATH} ParameterKey=VPCID,ParameterValue=${VPCID} ParameterKey=RestAPI,ParameterValue=${REST_API} ParameterKey=MethodRoute,ParameterValue=${METHOD_ROUTE} ParameterKey=ImageURL,ParameterValue='${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPO_NAME}' --capabilities CAPABILITY_NAMED_IAM"
                        //Introducted a delay of 4 minutes for the stack to get created and then build and push the docker image.
                        sleep time: 240000, unit: 'MILLISECONDS'
                    }
                    else
                    {
                        echo "stack already exists, not need to create one."
                    }
                }
            }
        }
        //Build and Push Docker Image
        stage('Build & Push Image') {
            steps {
                script {
                    //AWS Credentials(Access and Secret) stored as "aws_creds" in Manage Credentials in Jenkins 
                    docker.withRegistry(
                        "https://${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPO_NAME}",
                        "ecr:${REGION}:aws_creds"
                    )
                    {
                        def myImage = docker.build("${ECR_REPO_NAME}")
                        myImage.push("latest")
                    }
                    //Force a new deployment for the service
                    sh "aws ecs update-service --service ${ECS_SERVICE} --cluster ${CLUSTER_NAME} --desired-count ${DESIRED_COUNT} --force-new-deployment --region '${REGION}'"
                }
            }
        }
    }
}