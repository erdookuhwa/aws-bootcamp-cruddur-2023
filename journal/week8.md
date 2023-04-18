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























💻 🚧
