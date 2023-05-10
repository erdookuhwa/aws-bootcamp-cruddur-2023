# Week 9 — CI/CD with CodePipeline, CodeBuild and CodeDeploy

#### CodePipeline
- In my AWS Management Console, I created a Pipeline
  - During the creation, I connected _GitHub (Version 2)_ as a source > Selected this project's Repo, and branch
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week9_connectGitHubApp.png)
  - I skipped the Build Stage and in the Deploy stage, selected ECS and my previously created ECS cluster & backend service from Week 6
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week9_Deploy%20Stage.png)
  - Then skipped on to CodeBuild


#### CodeBuild
- I built a project and opted in for _build badges_
  - I chose GitHub as my source provider, connected and selected this project's repo
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week9_githubConnected.png)
  - Using the Single Build type, select the _PULL_REQUEST_MERGED_ Event Type
- [`buildspec.yml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/buildspec.yml) specified the build specifications in this file 
- Build badge is then populated
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week9_codebuildBadge.png)
  - Copied the badge URL and added to the root of this project's [`README`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/README.md)
  - Granted CodeBuild's service role some ECR permissions: [`aws/policies/codebuild-ecr-role.json`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/aws/policies/codebuild-ecr-role.json)

##### Trigger Build
- Created a PR and merged into the prod branch to trigger a build. Successful build in console:
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week9_buildSuccessful.png)

#### CodePipeline Continuation...
Now that the build is successful, moving on to the next configurations for the CodePipeline:
- Editing the pipeline and added a build stage:
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week9_editPipeline.png)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week9_addStage.png)
- Added an action group to the build stage with the following setup:
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week9_editActionGroup.png)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week9_buildActionGroup.png)
- In the Deploy stage, updated Input artifacts from SourceArtifact > ImageDefinition (which was the output from the _bake-image (build) stage_
- Clicked on Save then Release Changes to trigger pipeline run. 
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week9_codePipeline.png)
- When the Pipeline got to the Build Phase, the build was triggered in CodeBuild
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week9_buildStageComplete.png)
- Pipeline triggered _Task_ in ECS for the backend-service
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week9_pipelineTaskRedeploy.png)
- The Application Load Balancer's Target Group was also updated with this trigger
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week9_drainingTG.png)

#### Testing
  - Updated [`app.py`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/app.py#L130) health-check return data. Pushed and merged changes to prod to trigger new deployment. Accessing the health-check now returns the modified data:
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week9_newHealthCheck.png)
