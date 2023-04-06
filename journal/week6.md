# Week 6 — Deploying Containers

#### Testing RDS Connection 
I began by creating a script that tests a connection to my `Postgres` database is successful. [`test-db-connection`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/db/test-connection)
- ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_testDBConnectionScript.png)

#### Health Check 
Next, to do a *__health check__* for my app, I added an endpoint to the flask app. [`app.py`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/app.py) and created a script for the [`health-check`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/flask/health-check) which accesses the backend-flask server at the endpoint `api/health-check` and returns a success if `StatusCode = 200` or a failure if not.
- ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_health-check%40URL.png)
- ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_health-check%40Script.png)

Then I created a *__CloudWatch Log Group__* and set retention to 1 day using these commands:
```sh
aws logs create-log-group --log-group-name cruddur
aws logs put-retention-policy --log-group-name cruddur --retention-in-days 1
```
I used the command below to create an __ECS Cluster__ in AWS:
```sh
aws ecs create-cluster \
--cluster-name cruddur \
--service-connect-defaults namespace=cruddur
```
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_ecsCluster.png)

### ECR Repo & Image 
1. I created an __Elastic Container Registry__ repo in my AWS account for the *Python Image* & set the --image-tag-mutability to `mutable` so I can update the image tag in future:
  ```sh
  aws ecr create-repository \
    --repository-name cruddur-python \
    --image-tag-mutability MUTABLE
  ```
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_ecrRepo.png)
- I then used the `Push command` provided with the created repo to authenticate __ECR Login__. An alternative way to authenticate would be using the env vars:
  ```sh
  aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"
  ```
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_ecrLogin.png)
- Next, I set the env var for the ecr URL using:
  ```sh
  export ECR_PYTHON_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/cruddur-python"
  gp env ECR_PYTHON_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/cruddur-python"
  ```
##### Docker Image
- I pulled the img from `docker`: 
  ```sh
  docker pull python:3.10-slim-buster
  ```
- Then tagged the image with my `ecr URL`
  ```sh
  docker tag python:3.10-slim-buster $ECR_PYTHON_URL:3.10-slim-buster
  ```
- And I pushed it to my `ECR` repo:
  ```sh
  docker push $ECR_PYTHON_URL:3.10-slim-buster
  ```
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_imgPushedToECR.png)
- In my [`Dockerfile`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/Dockerfile), I updated the image source to point to the img in my `ECR` instead of getting it from `Docker Hub`. I confirmed it worked by running a `docker compose up` & hitting the `backend URL/api/health-check` and it returned a 200

2. I created another repo for the `backend-flask`:
  ```sh
  aws ecr create-repository \
  --repository-name backend-flask \
  --image-tag-mutability MUTABLE
  ```
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_backendRepo.png)
  - Then, set the URL using:
    ```sh
    export ECR_BACKEND_FLASK_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/backend-flask"
    gp env ECR_BACKEND_FLASK_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/backend-flask"
    ```
  - After authenticating, I built the image using: 
    ```sh
    docker build -t backend-flask .
    ```
  - Next, I tagged the image:
    ```sh
    docker tag backend-flask:latest $ECR_BACKEND_FLASK_URL:latest
    ```
  - Then pushed the image using:
    ```sh
    docker push $ECR_BACKEND_FLASK_URL:latest
    ```
    ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_backendImg.png)
  
#### Creating Task Definition in ECS
- I began by storing the parameters in _Parameter Store_ in the terminal like so:
  ```sh
  aws ssm put-parameter --type "SecureString" --name "/cruddur/backend-flask/AWS_ACCESS_KEY_ID" --value $AWS_ACCESS_KEY_ID
  aws ssm put-parameter --type "SecureString" --name "/cruddur/backend-flask/AWS_SECRET_ACCESS_KEY" --value $AWS_SECRET_ACCESS_KEY
  aws ssm put-parameter --type "SecureString" --name "/cruddur/backend-flask/CONNECTION_URL" --value $PROD_CONNECTION_URL
  aws ssm put-parameter --type "SecureString" --name "/cruddur/backend-flask/ROLLBAR_ACCESS_TOKEN" --value $ROLLBAR_ACCESS_TOKEN
  aws ssm put-parameter --type "SecureString" --name "/cruddur/backend-flask/OTEL_EXPORTER_OTLP_HEADERS" --value "x-honeycomb-team=$HONEYCOMB_API_KEY"
  ```
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_ParameterStore.png)
- I created the [`service-execution-policy.json`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/aws/policies/service-execution-policy.json) policy which grants AWS Systems Manager `ssm:GetParameters` & `ssm:GetParameter` access to the `backend-flask` resource.
- I created the Execution Role using: 
  ```sh
  aws iam create-role \
    --role-name CruddurServiceExecutionRole \
    --assume-role-policy-document "file://aws/policies/service-assume-role-execution-policy.json"
  ```
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_CruddurServiceExecutionRole.png)
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_CruddurServiceExecutionPolicy.png)
- And then the IAM Policy, by running the command:
  ```sh
  aws iam put-role-policy \
    --policy-name CruddurServiceExecutionPolicy \
    --role-name CruddurServiceExecutionRole \
    --policy-document "file://aws/policies/service-execution-policy.json"
  ```
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_createIAMRole.png)
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_CruddurServiceExecutionRoleInAWS.png)
- I created a TaskRole as specified in [Andrew Brown's instructions](https://github.com/omenking/aws-bootcamp-cruddur-2023/blob/week-6-fargate/journal/week6.md#create-taskrole)
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_cruddurCreateTask.png)




















💻 UNDER CONSTRUCTION... 🚧
