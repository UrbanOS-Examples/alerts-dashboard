library(
    identifier: 'pipeline-lib@4.8.0',
    retriever: modernSCM([$class: 'GitSCMSource',
                          remote: 'https://github.com/SmartColumbusOS/pipeline-lib',
                          credentialsId: 'jenkins-github-user'])
)

def doStageIf = scos.&doStageIf
def doStageIfRelease = doStageIf.curry(scos.changeset.isRelease)

node ('infrastructure') {
    ansiColor('xterm') {
        scos.doCheckoutStage()

        doStageIfRelease('Deploy to Production') {
            deployTo(environment: 'prod')
            scos.applyAndPushGitHubTag('prod')
        }
    }
}

def deployTo(params = [:]) {
    def environment = params.get('environment')
    def extraVars = params.get('extraVars', [:])

    def terraform = scos.terraform(environment)
    sshagent(["GitHub"]) {
        terraform.init()
    }
    terraform.plan(terraform.defaultVarFile, extraVars)
    terraform.apply()
}