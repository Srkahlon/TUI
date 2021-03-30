pipeline {
    agent any
    stages {
        stage('Submit Stack') {
            steps {
                sh "aws cloudformation create-stack --stack-name ecrrepository --template-body file://cloudformation_template.json --region 'us-east-1'"
            }
        }
    }
}