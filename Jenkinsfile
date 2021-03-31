def stack_exists = "false"
pipeline {
    agent any
    environment {
        ACCOUNT_ID = credentials('account_id')
        REGION = 'us-east-1'
        ECR_REPO_NAME = 'tui-backend'
    }
    stages {
        stage('Check if stack exists') {
            steps {
                script
                {
                    try
                    {
                        instanceInfo = sh (
                                script: "aws cloudformation describe-stacks --stack-name  ecs-stack --region 'us-east-1' --query 'Stacks[0].StackStatus' --output text",
                                returnStdout: true
                        ).trim()
                        stack_exists = "true"
                    }
                    catch(Exception e)
                    {
                        echo "Stack Doesnt exist."
                    }
                }
            }
        }
        stage('Create Stack if not found') {
            steps {
                script
                {
                    if(stack_exists == "false")
                    {
                        sh "aws cloudformation create-stack --stack-name ecs-stack --template-body file://cloudformation_temp.yml --region 'us-east-1' --parameters  ParameterKey=ImageURL,ParameterValue='${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPO_NAME}' --capabilities CAPABILITY_NAMED_IAM"
                    }
                    else
                    {
                        echo "stack already exists, not need to create one"
                    }
                    sleep time: 60000, unit: 'MILLISECONDS'
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    docker.withRegistry(
                        "https://${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPO_NAME}",
                        "ecr:${REGION}:aws_creds"
                    )
                    {
                        def myImage = docker.build("${ECR_REPO_NAME}")
                        myImage.push("tui")
                    }
                }
            }
        }
    }
}