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
                sh "aws cloudformation create-stack --stack-name ecrrepository --template-body file://cloudformation_temp.yml --region 'us-east-1'"
            }
        }
        stage('Build') {
            steps {
                bat  'docker build -t tui .'
            }
        }
        stage('Push image') {
         steps {
           withDockerRegistry([url: "https://${ACCOUNT_ID}.dkr.ecr.ap-southeast-2.amazonaws.com/${ECR_REPO_NAME}",credentialsId: "ecr:${REGION}:aws_creds"]) {
                    bat 'docker push tui:latest'
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}