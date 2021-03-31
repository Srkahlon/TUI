pipeline {
    agent any
    environment {
        ACCOUNT_ID = credentials('account_id')
        REGION = 'us-east-1'
        ECR_REPO_NAME = 'tui-backend'
    }
    stages {
        stage('Submit Stack') {
            steps {
                script
                {
                    //sh "aws cloudformation create-stack --stack-name ecs-stack --template-body file://cloudformation_temp.yml --region 'us-east-1' --parameters  ParameterKey=ImageURL,ParameterValue='${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPO_NAME}' --capabilities CAPABILITY_NAMED_IAM"
                    instanceInfo = sh (
                                script: "aws cloudformation describe-stacks --stack-name  ecs-stack --region 'us-east-1'",
                                returnStdout: true
                        ).trim()
                    echo "the instance info is printed below"
                    echo "${instanceInfo}"
                }
            }
        }
        // stage('Build') {
        //     steps {
        //         script {
        //             docker.withRegistry(
        //                 "https://${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPO_NAME}",
        //                 "ecr:${REGION}:aws_creds"
        //             )
        //             {
        //                 def myImage = docker.build("${ECR_REPO_NAME}")
        //                 myImage.push("tui")
        //             }
        //         }
        //     }
        // }
    }
}