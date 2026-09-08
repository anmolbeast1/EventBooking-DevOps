pipeline {
    agent any

    stages {

        stage('Install') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t eventbooking-frontend .'
            }
        }

        stage('Deploy') {
            steps {
                bat 'docker stop eventbooking-frontend || exit 0'
                bat 'docker rm eventbooking-frontend || exit 0'
                bat 'docker run -d -p 8080:80 --name eventbooking-frontend eventbooking-frontend'
            }
        }
    }
}