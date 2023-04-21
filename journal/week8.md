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


















💻 🚧
