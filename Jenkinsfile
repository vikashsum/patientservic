pipeline {
    agent any

    environment {
        AWS_REGION      = 'ap-south-1'
        AWS_ACCOUNT_ID  = '772706200970'
        ECR_REPOSITORY  = 'patient-service'
        ECS_CLUSTER     = 'hospital-microservices-cluster'
        ECS_SERVICE     = 'patient-service'

        IMAGE_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:latest"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Checking out source code..."
                git branch: 'main',
                    url: 'https://github.com/vikashsum/patientservic.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh """
                docker build -t ${IMAGE_URI} .
                """
            }
        }

        stage('Login to Amazon ECR') {
            steps {
                echo "Logging into Amazon ECR..."
                sh """
                aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                """
            }
        }

        stage('Push Image to ECR') {
            steps {
                echo "Pushing image to ECR..."
                sh """
                docker push ${IMAGE_URI}
                """
            }
        }

        stage('Deploy to ECS') {
            steps {
                echo "Deploying to ECS..."
                sh """
                aws ecs update-service \
                  --cluster ${ECS_CLUSTER} \
                  --service ${ECS_SERVICE} \
                  --force-new-deployment \
                  --region ${AWS_REGION}
                """
            }
        }

        stage('Wait for Deployment') {
            steps {
                echo "Waiting for ECS deployment..."
                sh """
                aws ecs wait services-stable \
                  --cluster ${ECS_CLUSTER} \
                  --services ${ECS_SERVICE} \
                  --region ${AWS_REGION}
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                sh """
                aws ecs describe-services \
                  --cluster ${ECS_CLUSTER} \
                  --services ${ECS_SERVICE} \
                  --region ${AWS_REGION}
                """
            }
        }
    }

    post {
        success {
            echo "========================================"
            echo "Deployment Successful"
            echo "Patient Service is updated in ECS."
            echo "========================================"
        }

        failure {
            echo "========================================"
            echo "Deployment Failed"
            echo "Check Jenkins console output."
            echo "========================================"
        }

        always {
            sh "docker image prune -f || true"
        }
    }
}
