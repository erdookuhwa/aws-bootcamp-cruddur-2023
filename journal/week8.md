# Week 8 — Serverless Image Processing

- I started off by installing the `AWS CDK` library:
  ```sh
  npm i aws-cdk -g
  ```
- And then initialized it for `TypeScript`. Which creates a skeletal structure for building an app using typescript.
  ```sh
  cdk init app --language typescript
  ```
  - In my initialized app structure, I defined a function to create an S3 bucket resource and lambda function in [`thumbing-serverless-cdk-stack.ts`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/thumbing-serverless-cdk/lib/thumbing-serverless-cdk-stack.ts) and used `cdk synth` to view my execution (deploy) plan
- Before deploying, I bootstrapped my account:
  ```sh
  cdk bootstrap "aws//<my_account_id>/<region>"
  ```
 ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week8_CDKBootstrap.png)
- Then I deployed my resources using:
  ```sh
  cdk deploy
  ```
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week8_cdkDeploy.png)
- Since I am importing my env vars, I installed the `dotenv` package using `npm i dotenv`

- I persisted the installation of the cdk toolkit to my GitPod env by adding these lines in my [`gitpod.yml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/.gitpod.yml)
  ```yml
    - name: cdk
    before: |
      npm i aws-cdk -g
      cd thumbing-serverless-cdk
      npm i
  ```
  
- In the process images directoy, I initialized the `Node.js` project using:
  ```sh
  npm init -y
  ``` 
- Then I installed `sharp` for converting large images into smaller renditions [`build`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/bin/avatar/build) and also to the [`sharp`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/89a803ecc55517c00a09d6c247c5eb5a53784101/bin/avatar/sharp) file in the [`process-image`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/tree/89a803ecc55517c00a09d6c247c5eb5a53784101/aws/lambdas/process-images) directory
- To persist this sharp install for use whenever I launch my GitPod env, I added these lines into my [`gitpod.yml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/89a803ecc55517c00a09d6c247c5eb5a53784101/.gitpod.yml)
  ```yml
  cd $THEIA_WORKSPACE_ROOT/aws/lambdas/process-images
      npm i
      rm -rf node_modules/sharp
      SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install --arch=x64 --platform=linux --libc=glibc sharp
  ```
- Next, I installed the SDK for S3 from terminal using:
  ```sh
  npm i @aws-sdk/client-s3
  ```

- I used `cdk destroy` to tear down resources from the stack; then I created my assets S3 bucket outside of the stack so I can manage the resource separately from the rest of the stack. I achieved that using:
  ```sh
  aws s3api create-bucket --bucket assets.cloudconceptchecker.com --region us-east-1
  ```
- After creating this bucket out of the stack, I imported it to be viewable in the stack but not manageable.
- I added `SNS` topic, subscriptions, policies, and attached them to their respective roles in my [`thumbing-serverless-cdk-stack.ts`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/89a803ecc55517c00a09d6c247c5eb5a53784101/thumbing-serverless-cdk/lib/thumbing-serverless-cdk-stack.ts) 
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week8_S3EventNotifications.png)
- In _CloudWatch_, I was able to trace logs of my uploads
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week8_uploadImgScript.png)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week8_cloudWatchLogs.png)

#### Serving Avatars via CloudFront
- Taking advantage of AWS's CDN through CloudFront, I created a _distribution_ with origin from my S3 assets bucket, with appropriate Bucket Policy such that all images are routed via the CloudFront Distribution and not the S3 bucket
- I also created an A record in _Route53's Hosted Zone for my domain_ to point to the CloudFront origin.
  - Tested and was able to view the image at the CF URL
    ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week8_domainImgURL.png)
  - Tested and was able to view the image at my domain URL
    ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week8_cloudFrontImgURL.png)


#### Implementing My User's Profile Page
- As part of automating my process flow, I created the [`bootstrap`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/bin/bootstrap) script which authenticates my Docker client to ECR, and then generates my _frontend_ and _backend_ env files.
- Now that my env is set, I created the [`show.sql`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/sql/users/show.sql) query which selects certain user attributes from an activity where there is a matching _user_handle_. And then updated my [`user_activities.py`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/services/user_activities.py) to use the `show` query.
- On the frontend, I updated my [`UserFeedPage.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/src/pages/UserFeedPage.js) file to set the _activities_ and _profile_ from the _results_ after fetching from the backend.
  - I also added the _[`ActivityFeed.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/src/components/ActivityFeed.js)_ component to render the user's activities on this page.
  - I made a similar update to my _[`HomeFeedPage.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/src/pages/HomeFeedPage.js)_ page.
  ###### Editing Profile
  - I created the [`EditProfileButton.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/src/components/EditProfileButton.js) component to allow editing of the profile page when the _Edit Profile_ button is clicked.
- Next, I created the [`ProfileHeading.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/src/components/ProfileHeading.js) component to handle display of user's profile related data.
- ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week8_profile.png)

#### Implementing User Profile's Form
- I started off by creating this [`jsconfig.json`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/jsconfig.json) file so I can have _absolute imports_ rather than the previous _relative imports_ we have been using. So, any file I'm importing within my `src` directory can now be referenced at the root level.
- The [`ProfileForm.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/src/components/ProfileForm.js) allows a user modify their info when the _Edit Profile_ button is clicked.
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week8_profileForm.png)
- In [`app.py`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/app.py), I added the endpoint for the profile update `/api/profile/update` and the function responsible for making the update to db.
  - Added the [`update_profile`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/services/update_profile.py) service on which inserts the user's updates to the databse.
  - The [`update.sql`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/sql/users/update.sql) query updates the user's table with this new info. 
  ##### Migrations
  Since updates will require multiple triggers to db, we setup _migrations_ (and _rollback_) files so we can better manage revisions to the db.
  - The [`migration.py`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/bin/generate/migration) generates a template for file to be used for the migration.
  - Similarly, the [`migrate.py`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/bin/db/migrate) performs the migration based on files generated by the _`migration.py`_ and [`rollback.py`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/bin/db/rollback) rolls back by one and updates db with the time of the `last_successful_run`.
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/1c41b05e48db9ac004d5efa853e96c488d78e425/_docs/assets/Week8_migrate.png)
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/1c41b05e48db9ac004d5efa853e96c488d78e425/_docs/assets/Week8_rollback.png)
  - Lastly, I updated the [`schema.sql`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/schema.sql) to factor in this new changes.
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/1c41b05e48db9ac004d5efa853e96c488d78e425/_docs/assets/Week8_schema_info_table.png)
  - 

#### Presigned URL for Avatar Upload
So, users of the app should have the ability to upload their avatar (_profile picture_); to achieve this, a presigned URL to my _uploads bucket_ is generated when user attaches a file for upload.
- I began by creating the Lamba function, [`function.rb`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/ae4a0157355f23c9ddc1670a0c4f9a6d8d6157ea/aws/lambdas/cruddur-upload-avatar/function.rb) which when run generates a _presigned URL_ that can be used.
  - In my terminal, I exported my `UPLOADS_BUCKET_NAME` and added the _ENVIRONMENT VARIABLE_ in the lambda function on the AWS Console
  - And generate [`Gemfile`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/ae4a0157355f23c9ddc1670a0c4f9a6d8d6157ea/aws/lambdas/cruddur-upload-avatar/Gemfile) using `bundle init` which sources ruby repo & installed `aws-sdk-s3` & `ox` (a bundle parser)
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5050be2ca2afa79eb774c64ba2a6d3fa0e9086e0/_docs/assets/Week8_Gemfile_generate.png)
  - I used `bundle install` to install the packages in the `Gemfile`
- To run my function in terminal for testing, I used `bundle exec ruby function.rb`
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5050be2ca2afa79eb774c64ba2a6d3fa0e9086e0/_docs/assets/Week8_generatedURL.png)
- In the _Role_, I added permission to **S3** 
  - [`s3-upload-avatar-presigned-url-policy.json`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/ae4a0157355f23c9ddc1670a0c4f9a6d8d6157ea/aws/policies/s3-upload-avatar-presigned-url-policy.json) - contains the policy statement


- For the **Lambda Authorizer**, this function [`index.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/ae4a0157355f23c9ddc1670a0c4f9a6d8d6157ea/aws/lambdas/lambda-authorizer/index.js) 
  - In terminal, I did a `npm i aws-jwt-verify --save` in my lambda-authorizer directory. 
  - Then zip the contents of this folder. To zip, I used the following command which saves my new zipped file as _lambda_authorizer.zip_ 
    ```sh
    zip -r lambda_authorizer.zip index.js node_modules/ package.json package-lock.json 
    ```
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5050be2ca2afa79eb774c64ba2a6d3fa0e9086e0/_docs/assets/Week8_zipLambdaAuthorizer.png)
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5050be2ca2afa79eb774c64ba2a6d3fa0e9086e0/_docs/assets/Week8_zippedLambda.png)
- In the AWS Mgt Console, we then created by uploading the zipped file from above.
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5050be2ca2afa79eb774c64ba2a6d3fa0e9086e0/_docs/assets/Week8_uploadZipFiletoLambda.png)

###### API Testing within VScode (Similar to _Postman_)
- I installed **_Thunder Client_** from Market place to test the presigned link generated by `function.rb`


- **_Creating the API Gateway_**
  - Building from _HTTP API_, we opted in for _Integrations_ and selected our earlier lambda function which creates a presigned URL for uploads to the avatar bucket.
  - I accepted default for _stages_, _configured the routes_ to point to the bucket folder: _`/avatars/key_upload`_, etc
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5050be2ca2afa79eb774c64ba2a6d3fa0e9086e0/_docs/assets/Week8_configureRoutes.png)
  - Added _Authorization_ for the Lambda function and attached it.
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5050be2ca2afa79eb774c64ba2a6d3fa0e9086e0/_docs/assets/Week8_configureIntegrations.png)
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5050be2ca2afa79eb774c64ba2a6d3fa0e9086e0/_docs/assets/Week8_attachAuthorizer.png)
  - Configure **CORS** _GET_ and _OPTIONS_ methods. Access to *.gitpod.io
- In [`ProfileForm.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/ae4a0157355f23c9ddc1670a0c4f9a6d8d6157ea/frontend-react-js/src/components/ProfileForm.js), I have added the function to make a call to the upload route.














💻 🚧
