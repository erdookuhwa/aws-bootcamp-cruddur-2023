# Week X - Sync Tool for Static Website Hosting

### Static Building for App
- [static-build](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b6f531940fd9bd74b2b4231cfd24d31e3f3bb9cc/bin/frontend/static-build): used for packaging/building app ready for static hosting.
  - fixed warnings after running the build command
- zip the build directory for upload to S3
  ```sh
  zip -r cruddurBuild.zip build/
  ```
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5fe8eccc37c64acb0ac11334eb8ca2d3adf18a6f/_docs/assets/WeekX_downloadBuildZip.png)
- Uploaded its content to the root S3 bucket in _AWS Management Console_
- Previously the domain was inaccessible
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5fe8eccc37c64acb0ac11334eb8ca2d3adf18a6f/_docs/assets/WeekX_domainInAccessible.png)
- After uploading the build contents, I'm now able to access my cruddur app:
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5fe8eccc37c64acb0ac11334eb8ca2d3adf18a6f/_docs/assets/WeekX_domainAccessible.png)

### Adding Sync Tool
- [sync](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/626ba65f5194f2e8fd04565e62ad518c4abf4823/bin/frontend/sync): Created the sync script to automate the process of syncing our static website in S3 with CloudFront
- [generate-env](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/626ba65f5194f2e8fd04565e62ad518c4abf4823/bin/frontend/generate-env): Updated the frontend's `generate-env` file to generate env vars for the sync tool.
- In the terminal, install `dotenv` and `aws_s3_website_sync` by running the commands:
  ```ruby
  gem install dotenv
  gem install aws_s3_website_sync
  ```

### Test Syncing
- Made a modification to [DesktopSidebar.js](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/626ba65f5194f2e8fd04565e62ad518c4abf4823/frontend-react-js/src/components/DesktopSidebar.js), ran the `static-build` script to build the files, then ran the [sync](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/626ba65f5194f2e8fd04565e62ad518c4abf4823/bin/frontend/sync) which sets up the env and triggers a build for the app; after accepting the changes, it redeployed the website showing new changes.
- Planning the `sync`
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8a5afe4331ed5456ea7d686b3c7ccbc8929c0328/_docs/assets/WeekX_runSyncI.png)
- Accepting the "plan", confirms CloudFront Distribution will be invalidated
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8a5afe4331ed5456ea7d686b3c7ccbc8929c0328/_docs/assets/WeekX_syncInvalidate.png)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8a5afe4331ed5456ea7d686b3c7ccbc8929c0328/_docs/assets/WeekX_CloudFrontInvalidation.png)
- Before Syncing
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8a5afe4331ed5456ea7d686b3c7ccbc8929c0328/_docs/assets/WeekX_beforeSync.png)
- After Syncing, change is now visible online
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8a5afe4331ed5456ea7d686b3c7ccbc8929c0328/_docs/assets/WeekX_afterSync.png)


### Attempting Automation with GitHub Actions...
- Created a [Gemfile](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b5288acf19ee92a84297873ef810bc8110eb8c8e/Gemfile) to install required libraries
- Setup tasks in [Rakefile](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b5288acf19ee92a84297873ef810bc8110eb8c8e/Rakefile)
- Defined github actions in [sync.yaml](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b5288acf19ee92a84297873ef810bc8110eb8c8e/.github/workflows/sync.yaml)

### CFN SYNC
- Created the [template.yaml](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/81f042ddbfe6d110ef8f81309a546e8a6092d6d1/aws/cfn/sync/template.yaml) to create the sync resource
- Stored parameters in [config.toml](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/81f042ddbfe6d110ef8f81309a546e8a6092d6d1/aws/cfn/sync/config.toml)
- Created the [sync](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/81f042ddbfe6d110ef8f81309a546e8a6092d6d1/bin/cfn/sync) script to deploy the template
- From cli, run the commands so the sync script can run. We also updated [gitpod.yml](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8d768c691c3bd0e010f0743469fcaa0beabbea7e/.gitpod.yml) to do this whenever a new workspace is launched:
  ```ruby
    bundle install
    bundle update --bundler
  ```
- Run the sync script to create changeset which provisions the Sync Role and GitHub OpenID Connect (GithubOidc) resources
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/e6daf4d7d9088e4953d30ae0ea0eb2778a1a0ddf/_docs/assets/WeekX_cfnSyncResources.png)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/e6daf4d7d9088e4953d30ae0ea0eb2778a1a0ddf/_docs/assets/WeekX_cfnSyncStack.png)
  #### Error Syncing
  - When running the sync script after building, you may get this error.
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/e6daf4d7d9088e4953d30ae0ea0eb2778a1a0ddf/_docs/assets/WeekX_errorSyncing.png)
  - This is because in our generated `sync.env`, we specify only the output directory but sync is looking for a file to place the change set in. Fix by appending a placeholder after `/tmp`:
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/e6daf4d7d9088e4953d30ae0ea0eb2778a1a0ddf/_docs/assets/WeekX_fixSyncError.png)

### Post Lambda Confirmation
- Updated the [cruddur-post-confirmation.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/6df0283e45cd20456caccd1f73f1dfe7787ca102/aws/lambdas/cruddur-post-confirmation.py) function in AWS Console.
- Updated the env var with the new DB credentials
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/c0c6b277ad05cb491ae19114439df690daace5c1/_docs/assets/WeekX_lambdaEnvVar.png)
- Checked and verified that my API Gateway triggers were in place and had the right authorization and integration

##### Posting a Crud
- Modified the `data_activities` function in [app.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/64505455bc183439d5d5a86338562bf0aef73ae2/backend-flask/app.py) to handle authorization and create activity via `cognito_user_id`
- Updated [seed.sql](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/64505455bc183439d5d5a86338562bf0aef73ae2/backend-flask/db/seed.sql), added user already in my Cognito in AWS
- Updated query in [create.sql](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/64505455bc183439d5d5a86338562bf0aef73ae2/backend-flask/db/sql/activities/create.sql) to base select on `cognito_user_id`
- Updated the [create_service.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/64505455bc183439d5d5a86338562bf0aef73ae2/backend-flask/services/create_activity.py) service to use `cognito_user_id`
- Added authorization handling in [ActivityForm.js](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/64505455bc183439d5d5a86338562bf0aef73ae2/frontend-react-js/src/components/ActivityForm.js)

##### Issues with Posting a Crud in Prod
- After making all these changes, I was unable to post a crud in Prod. ❗*__`CORS`__*❗😏 To resolve, I did the following:
  - Loaded schema to prod by running the [schema-load](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/c0c6b277ad05cb491ae19114439df690daace5c1/bin/db/schema-load)
  - Seeded the prod data considering the seed.sql was just modified; used the [seed](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/c0c6b277ad05cb491ae19114439df690daace5c1/bin/db/seed) script
  - Connected to the prod db using the [connect](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/c0c6b277ad05cb491ae19114439df690daace5c1/bin/db/connect) script and updated the `cognito_user_id` field of the users table to match the user `sub` in Cognito. i.e. for same user in prod.

- For my hosted app to get all these new changes, I had to update the _task-definition of my backend service_
  - I re-built the image using the [build](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/c0c6b277ad05cb491ae19114439df690daace5c1/bin/backend/build) script
  - Pushed image using the [push](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/c0c6b277ad05cb491ae19114439df690daace5c1/bin/backend/push) script
  - Registered the new task definition using the [register](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/c0c6b277ad05cb491ae19114439df690daace5c1/bin/backend/register) script
  - Deployed the new service to use the newly (latest) registered task definition

- Finally, post was successful! 🥳
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/6cc505ae2ba10866131cdd484527edce2ab9d0b0/_docs/assets/WeekX_postCrudFromDomain.png)

### CICD Pipeline
- Update templates.
  - [config.toml](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/0703c480d62bf0644ce5372034fdcb732bdae973/aws/cfn/cicd/config.toml): added buildspec to the config
  - [codebuild.yml](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/0703c480d62bf0644ce5372034fdcb732bdae973/aws/cfn/cicd/nested/codebuild.yaml): added policy to allow access to the artifacts bucket
  - [template.yml](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/0703c480d62bf0644ce5372034fdcb732bdae973/aws/cfn/cicd/template.yaml): modified the policy and added parameters for the _artifacts_ and _buildspec_
- Run script to update changeset. _Execute changeset_
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/a4f8bf275d6fb197c0a812d1bfeb8e9ba11f6a54/_docs/assets/WeekX_CICDUpdateTemplate.png)
- Trigger build by merging to prod branch.
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/a4f8bf275d6fb197c0a812d1bfeb8e9ba11f6a54/_docs/assets/WeekX_CICDPipelineBuildSuccessful.png)


### Refactor JWT
#### Closing the Reply Box
- Added the to the [ReplyForm.js](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/2cf11937a2fe4397866e769a0a24ea7af0832f28/frontend-react-js/src/components/ReplyForm.js) close function to close the reply popup.
  ```js
  ...
    const close = (event)=> {
    if (event.target.classList.contains("reply_popup")) {
      props.setPopped(false)
    }
  }
  ...
  <div className="popup_form_wrap reply_popup" onClick={close}>
  ...
  ```

#### Replying to an Activity
Setting this up as a decorator, made the modification to [app.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/2cf11937a2fe4397866e769a0a24ea7af0832f28/backend-flask/app.py) and [cognito_jwt.token.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/2cf11937a2fe4397866e769a0a24ea7af0832f28/backend-flask/lib/cognito_jwt_token.py)


### Refactoring `app.py`
- Moved logic for different aspects of the code in [app.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/28bbd705b18ecbcca838ed3763cf4bd229575e9e/backend-flask/app.py) to their respective files for easy readability, maintenance, and scalability.
  - [cloudwatch.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/28bbd705b18ecbcca838ed3763cf4bd229575e9e/backend-flask/lib/cloudwatch.py)
  - [cors.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/28bbd705b18ecbcca838ed3763cf4bd229575e9e/backend-flask/lib/cors.py)
  - [cors.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/28bbd705b18ecbcca838ed3763cf4bd229575e9e/backend-flask/lib/honeycomb.py)
  - [rollbar.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/28bbd705b18ecbcca838ed3763cf4bd229575e9e/backend-flask/lib/rollbar.py)
  - [xray.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/28bbd705b18ecbcca838ed3763cf4bd229575e9e/backend-flask/lib/xray.py)
- Also, modified the [NotificationsFeedPage](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/28bbd705b18ecbcca838ed3763cf4bd229575e9e/frontend-react-js/src/pages/NotificationsFeedPage.js), added check auth logic.


### Refactoring the Backend
- Further decoupled app by striping down [app.py]() and moving similar logic to their respective files.
  - [helpers.py](): handling the return logic for the model
  - [rollbar.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/2ab47111e188b4fed75506a13ae4289911436d0e/backend-flask/lib/rollbar.py): for connecting to rollbar for error tracking
  - [activities.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/2ab47111e188b4fed75506a13ae4289911436d0e/backend-flask/routes/activities.py): for activities and routing of various activities
  - [general.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/2ab47111e188b4fed75506a13ae4289911436d0e/backend-flask/routes/general.py): handling health-check
  - [messages.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/2ab47111e188b4fed75506a13ae4289911436d0e/backend-flask/routes/messages.py): the logic for messaging
  - [users.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/2ab47111e188b4fed75506a13ae4289911436d0e/backend-flask/routes/users.py): for user data


### Replying to Posts
- Modified files:
  - [create_reply.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/6dfbde3698d217949fed5c05ba18da45a3fc8423/backend-flask/services/create_reply.py)
  - [home.sql](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/6dfbde3698d217949fed5c05ba18da45a3fc8423/backend-flask/db/sql/activities/home.sql)
  - [object.sql](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/6dfbde3698d217949fed5c05ba18da45a3fc8423/backend-flask/db/sql/activities/object.sql)
  - [reply.sql](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/6dfbde3698d217949fed5c05ba18da45a3fc8423/backend-flask/db/sql/activities/reply.sql)
  - [migrate.sql](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/6dfbde3698d217949fed5c05ba18da45a3fc8423/bin/db/migrate)
  - [migration](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/6dfbde3698d217949fed5c05ba18da45a3fc8423/bin/generate/migration)
  - [ActivityItem.css](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/6dfbde3698d217949fed5c05ba18da45a3fc8423/frontend-react-js/src/components/ActivityItem.css)
  - [ActivityItem.js](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/6dfbde3698d217949fed5c05ba18da45a3fc8423/frontend-react-js/src/components/ActivityItem.js)
  - [ReplyForm.js](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/6dfbde3698d217949fed5c05ba18da45a3fc8423/frontend-react-js/src/components/ReplyForm.js)
- Using our [migration]() script, ran the `./bin/generate/migration reply_to_activity_int_to_string` to generate a migration file for converting reply activity int to a string.
  - [16867130974077687_reply_to_activity_int_to_string.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/6dfbde3698d217949fed5c05ba18da45a3fc8423/backend-flask/db/migrations/16867130974077687_reply_to_activity_int_to_string.py) was generated
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/14ee9d188cf826352a085e957d392fa1d5c6390a/_docs/assets/WeekX_migration.png)
- Attempted reply to a post led to an error due to wrong data types
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/14ee9d188cf826352a085e957d392fa1d5c6390a/_docs/assets/WeekX_errorDataType.png)
- Might also get this error:
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/WeekX_replyError.png)
  - To resolve, manually set your `last_successful_run` to the string value from the file generated (16867130974077687) ... It's currently referring to the value for the `add_bio_column` which is incorrect. By running:
    ```sql
    UPDATE schema_information SET last_successful_run='16867130974077687';
    ```
  - Run `./bin/db/migrate` ▶️ kill connections using the [kill-all](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/bin/db/kill-all) script ▶️ [setup](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/bin/db/setup) db again
- Running `./bin/db/migrate` to perform the migration fixed the error ⬆️
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/WeekX_replyPost.png)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/14ee9d188cf826352a085e957d392fa1d5c6390a/_docs/assets/WeekX_repliesPostgres.png)


### UPDATING PROD
- ./bin/db/migrate prod: to get prod data to update the data type for `reply_to_activity_uuid` field from integer to uuid
- Reset the `CONNECTION_URL` before running migrate like so: `CONNECTION_URL=$PROD_CONNECTION_URL ./bin/db/migrate`
- Create a PR to update the `prod` branch with the most recent commits which will re-trigger a build and deploy with the most up-to-date version of the app
- Similarly, for the frontend, run the `./bin/frontend/static-build` ➡️ `./bin/frontend/sync` to get our frontend to the most recent version

##### Update DDB Table Name
- Previously, `ddb table_name` was hard-corded, modify this to pick up the `env var` set for it so maintenance in future can be much easier. This was achieved by updating the [ddb.py](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/722770aad84ec7336daee9c23a6929b05ba1965c/backend-flask/lib/ddb.py) file with this new field `table_name = os.getenv("DDB_MESSAGE_TABLE")`
- Update the service by running the script `./bin/cfn/service` which updates our backend-service stack in AWS

#### Creating a machine user for app access
- Create machine-user with permissions to write to read & write to DynamoDB
- Using the script [machineuser](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/722770aad84ec7336daee9c23a6929b05ba1965c/bin/cfn/machineuser), deploy the stack to CloudFormation using this [template](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/722770aad84ec7336daee9c23a6929b05ba1965c/aws/cfn/machine-user/template.yaml)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5e9815a735221a9071d995f40f321ca3a12a8c9c/_docs/assets/WeekX_cfnMachineUser.png)
- After machineuser is created by deploying the CFN stack, in IAM, create access key via ClickOps for the user and save in Parameter Store
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5e9815a735221a9071d995f40f321ca3a12a8c9c/_docs/assets/WeekX_parameterStore.png)

#### Testing
  - Messaging from user 1
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5e9815a735221a9071d995f40f321ca3a12a8c9c/_docs/assets/WeekX_messaging1.png)
  - Messaging from user 2
   - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5e9815a735221a9071d995f40f321ca3a12a8c9c/_docs/assets/WeekX_messaging2.png)
