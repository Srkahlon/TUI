pipeline {
    agent any
    stages {
        stage('Submit Stack') {
            steps {
                sh "aws cloudformation create-stack --stack-name ecrrepository --template-body file://cloudformation_temp.yml --region 'us-east-1'"
                def globalExports = cfnExports()
                echo ${globalExports}
            }
        }
    }
}