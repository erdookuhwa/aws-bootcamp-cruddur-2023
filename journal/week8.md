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
- Then I installed `sharp` for rendering images [`build`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/bin/serverless/build) 
- Next installed the SDK for S3 from terminal using:
  ```sh
  npm i @aws-sdk/client-s3
  ```

- I used `cdk destroy` to tear down resources from the stack; then I created my assets S3 bucket outside of the stack so I can manage the resource separately from the rest of the stack. I achieved that using:
  ```sh
  aws s3api create-bucket --bucket assets.cloudconceptchecker.com --region us-east-1
  ```
- After creating this bucket out of the stack, I imported it to be viewable in the stack but not manageable.




















💻 🚧
