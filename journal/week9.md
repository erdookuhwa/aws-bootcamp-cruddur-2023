# Week 9 — CI/CD with CodePipeline, CodeBuild and CodeDeploy

#### CodePipeline
- In my AWS Management Console, I created a Pipeline
  - During the creation, I connected _GitHub (Version 2)_ as a source > Selected this project's Repo, and branch
    - ![image]()
  - I skipped the Build Stage and in the Deploy stage, selected ECS and my previously created ECS cluster & backend service from Week 6
    - ![image]()
  - Then skipped on to CodeBuild
- In the _cruddur-backend-fargate_, I added a stage _bake-image_ and added an action group to it


#### CodeBuild
- I built a project and opted in for _build badges_
  - I chose GitHub as my source provider, connected and selected this project's repo
  - Using the Single Build type, select the _PULL_REQUEST_MERGED_ Event Type
- [`buildspec.yml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/buildspec.yml) specified the build specifications in this file 
- Build badge is then populated which I added to the root [`README`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/README.md)

##### Trigger Build
- Created a PR and merged into the prod branch to trigger a build

#### CodePipeline Continuation...
Now that the build is successful, moving on to the next configurations for the CodePipeline
- Editing the pipeline and added a build stage:
  - ![image]()
  - ![]()
- Added an action group to the build stage with the following setup:
  - ![]()
- In the Deploy stage, updated Input artifacts from SourceArtifact > ImageDefinition (which was the output from the _bake (build) stage_
- Clicked on Save then Release Changes to trigger pipeline run
  - ![]()

#### Testing
###### ECS
- In ECS, a new task was launched after the Pipeline was run
  - ![image]()
  - Updated [`app.py`]() health-check function
- Can view modified message in browser @ health-check URL





🚧 💻
