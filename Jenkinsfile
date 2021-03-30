pipeline {
    agent any
    environment {
        ACCOUNTID = 'true'
        REGION    = 'us-east'
    }
    stages {
        stage('Submit Stack') {
            steps {
                sh "aws cloudformation create-stack --stack-name ecrrepository --template-body file://cloudformation_temp.yml --region 'us-east-1' --parameters  ParameterKey=AccountId,ParameterValue=${ACCOUNTID} ParameterKey=Region,ParameterValue=${REGION}"
            }
        }
    }
}