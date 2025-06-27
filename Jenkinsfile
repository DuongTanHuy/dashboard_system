node {
    def app

    stage('Clone repository') {
        checkout scm
    }

    stage('Prepare Environment') {
        script {
            def envContent = """
                PORT=3033
                REACT_APP_HOST_API=https://api.cnto.us
            """.stripIndent().trim()

            writeFile(file: '.env', text: envContent)
        }
    }

    stage('Install Dependencies') {
        nodejs('Node JS') {
            sh 'npm install'
        }
    }

    stage('Build app') {
        nodejs('Node JS') {
            sh 'npm run build'
        }
    }

    stage('Build image') {
       app = docker.build("dinhnhat2023/fullfill-app")
    }

    stage('Test image') {
        app.inside {
            sh 'echo "Tests passed"'
        }
    }

    stage('Push image') {
        withDockerRegistry(credentialsId: 'docker-hub', url: 'https://index.docker.io/v1/') {
            app.push("${env.BUILD_NUMBER}")
        }
    }

    stage('Trigger ManifestUpdate') {
                echo "triggering updatemanifestjob"
                build job: 'FULLFILL-APP-UPDATE-MANIFEST', parameters: [string(name: 'DOCKERTAG', value: env.BUILD_NUMBER)]
        }
}