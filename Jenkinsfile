pipeline {
    agent any

    stages {

        stage('Frontend Install') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Frontend Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Backend Install') {
            steps {
                bat 'cd backend && npm ci'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                bat 'docker build -t eventbooking-frontend .'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                bat 'docker build -t eventsphere-backend ./backend'
            }
        }

        stage('Deploy Frontend') {
            steps {
                bat 'docker stop eventbooking-frontend || exit 0'
                bat 'docker rm eventbooking-frontend || exit 0'
                bat 'docker run -d -p 8080:80 --name eventbooking-frontend eventbooking-frontend'
            }
        }

        stage('Deploy Backend') {
            steps {
                bat 'docker stop eventsphere-backend || exit 0'
                bat 'docker rm eventsphere-backend || exit 0'
                bat 'docker run -d -p 8000:8000 --name eventsphere-backend eventsphere-backend'
            }
        }
    }
}