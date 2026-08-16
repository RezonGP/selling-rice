pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'rice-backend:latest'
        DOCKER_IMAGE_FRONTEND = 'rice-frontend:latest'
        REGISTRY_CREDENTIALS_ID = 'docker-hub-credentials'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        ansiColor('xterm')
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                echo 'Checking out latest code from Git repository...'
                checkout scm
            }
        }

        stage('Security & Code Analysis') {
            parallel {
                stage('Backend Lint & Scan') {
                    steps {
                        dir('backend') {
                            echo 'Running npm audit and dependency security checks on Backend...'
                            sh 'npm audit --audit-level=high || true'
                        }
                    }
                }
                stage('Frontend Lint & Scan') {
                    steps {
                        dir('frontend') {
                            echo 'Running npm audit on Frontend...'
                            sh 'npm audit --audit-level=high || true'
                        }
                    }
                }
            }
        }

        stage('Build Docker Containers') {
            steps {
                echo 'Building production Docker images for Frontend and Backend...'
                sh 'docker-compose build --no-cache'
            }
        }

        stage('Deploy Production Cluster') {
            steps {
                echo 'Deploying application via Docker Compose...'
                sh 'docker-compose up -d --remove-orphans'
                sh 'docker-compose ps'
            }
        }

        stage('Post-Deploy Health Check') {
            steps {
                echo 'Verifying deployment health...'
                sleep 5
                sh 'curl -f http://localhost/nginx-health || exit 1'
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Rice E-Commerce Platform successfully built and deployed!'
        }
        failure {
            echo 'FAILURE: Pipeline failed. Check Jenkins logs for details.'
        }
    }
}
