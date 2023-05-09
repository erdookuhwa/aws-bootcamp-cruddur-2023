# Week 9 — CI/CD with CodePipeline, CodeBuild and CodeDeploy

#### CodePipeline
- In my AWS Management Console, I created a Pipeline
  - During the creation, I connected _GitHub (Version 2)_ as a source > Selected this project's Repo, and branch
    - ![image]()
  - I skipped the Build Stage and in the Deploy stage, selected ECS and my previously created ECS cluster & backend service from Week 6
    - ![image]()
- In the _cruddur-backend-fargate_, I added a stage _bake-image_ and added an action group to it. 


#### CodeBuild
- I built a project and opted in for _build badges_
  - I chose GitHub as my source provider, connected and selected this project's repo
  - Using the Single Build type, I selected the _PULL_REQUEST_MERGED_ Event Type
- [`buildspec.yml`]() specified the build specifications in this file 
- Build badge is then populated which I added to the root [`README`]()

##### Trigger Build
- I created a PR and merged into the prod branch to trigger a build
- 





🚧 💻
