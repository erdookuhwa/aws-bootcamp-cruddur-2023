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
- I created the [`service-execution-policy.json`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/aws/policies/service-execution-policy.json) policy which grants AWS Systems Manager `ssm:GetParameters` & `ssm:GetParameter` access & the `GetAuthorizationToken` access to ECR on the `backend-flask` resource.
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
- Installed _Session Manager Plugin_ on Ubuntu using instructions from [here](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html):
  ```sh
  curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/ubuntu_64bit/session-manager-plugin.deb" -o "session-manager-plugin.deb" \
  sudo dpkg -i session-manager-plugin.deb
  ```
  - Tested it was correctly installed using: `session-manager-plugin`
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_seshMgrPlugin.png)

- Then I created a _Security Group_ for the ECS Cluster
  ```sh
  export CRUD_CLUSTER_SG=$(aws ec2 create-security-group \
    --group-name cruddur-ecs-cluster-sg \
    --description "Security group for Cruddur ECS ECS cluster" \
    --vpc-id $DEFAULT_VPC_ID \
    --query "GroupId" --output text)
  echo $CRUD_CLUSTER_SG
  ```
- This next script gets the `subnet ids` of the default VPC:
  ```sh
  export DEFAULT_SUBNET_IDS=$(aws ec2 describe-subnets  \
   --filters Name=vpc-id,Values=$DEFAULT_VPC_ID \
   --query 'Subnets[*].SubnetId' \
   --output json | jq -r 'join(",")')
  echo $DEFAULT_SUBNET_IDS
  ```

#### Register Task Defintion
- I created a Service in the ECS Cluster from AWS Console
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_ECSServiceCreated.png)
- I created a task-definition: [`backend-flask.json`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/aws/task-definitions/backend-flask.json) then Registered it by running:
  ```sh
  aws ecs register-task-definition --cli-input-json "file://aws/task-definitions/backend-flask.json"
  ```
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_taskDefinitionBE.png)
- Next, I created a Service in the ECS Cluster.
  - **Creating Security Group** for to be used for this service, I used the commands:
  - To get the `default VPC ID`, I used:
    ```sh
    export DEFAULT_VPC_ID=$(aws ec2 describe-vpcs \
    --filters "Name=isDefault, Values=true" \
    --query "Vpcs[0].VpcId" \
    --output text)
    echo $DEFAULT_VPC_ID
    ```
  - Then, I proceeded to create the _Security Group_ now that I had the VPC_ID:
    ```sh
    export CRUD_SERVICE_SG=$(aws ec2 create-security-group \
      --group-name "crud-srv-sg" \
      --description "Security group for Cruddur services on ECS" \
      --vpc-id $DEFAULT_VPC_ID \
      --query "GroupId" --output text)
    echo $CRUD_SERVICE_SG
    ```
  - Since the ECS Service has an option that allows communication over a Public IP, I exposed port 80 using:
    ```sh
    aws ec2 authorize-security-group-ingress \
      --group-id $CRUD_SERVICE_SG \
      --protocol tcp \
      --port 80 \
      --cidr 0.0.0.0/0
    ```
  - I ran the command to create a service:
    ```sh
    aws ecs create-service --cli-input-json "file://aws/json/service-backend-flask.json"
    ```
  - Connecting to the Container
    ```sh
    aws ecs execute-command  \
      --region $AWS_DEFAULT_REGION \
      --cluster cruddur \
      --task 7dd70843535f45f4b409f90a78602ca3 \
      --container backend-flask \
      --command "/bin/bash" \
      --interactive
    ```
  
  
#### Persisting Changes to my Environment
- I updated my [`gitpod.yml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/.gitpod.yml) to auto-install Session Manager Plugin whenever the workspace is launched. 

#### Testing in AWS Console
- I updated my `crud-srv-sg` Security Group to allow connections to the backend URL, then accessed the Public IP of the associated ENI, appended the `/api/health-check` and I was able to get back data
 ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_ecsSG.png)
 ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_ECSENIs.png)
 ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_healthCheckfromECS.png)
 
#### Accessing My RDS Instance
- To access my RDS instance, I updated the `inbound rules` of my Security Group to point to the `crud-srv-sg` 
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_updateSG.png)
  
#### Creating a Port Mapping Alias:
- I updated my [`service-backend-flask.json`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/aws/json/service-backend-flask.json) to include the _Service Configuration_ for the port mapping. i.e. instead of backend data being accessible over port 80, it should be accessible via port 4567. Then ran the `aws ecs create-service --cli-input-json "file://aws/json/service-backend-flask.json"` cmd to create the service with the updated configuration.
- 
 

## Homework Challenge: Provision ALB via AWS CLI
- To create an _Application Load Balancer_, I created a Security Group first using:
  ```sh
  aws ec2 create-security-group --group-name cruddur-alb-sg --description "Application Load Balancer Security Group"
  ```
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_ALBCreatedAWS.png)
  - I updated the security Group's inbound rules using:
    ```sh
    aws ec2 authorize-security-group-ingress --group-id sg-0c5c9eaec2d4b09f7 --protocol tcp --port 80 --cidr 0.0.0.0/0
    aws ec2 authorize-security-group-ingress --group-id sg-0c5c9eaec2d4b09f7 --protocol tcp --port 443 --cidr 0.0.0.0/0
    ```
    ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_updateSGInboundRule.png)
  - Next, I created the **Load Balancer** by running the command:
    ```sh
    aws elbv2 create-load-balancer --name cruddur-alb  \
    --subnets subnet-027f0133dbc135d78 subnet-080af8dc081fcbf57 subnet-022495abe43851817 --security-groups sg-0c5c9eaec2d4b09f7
    ```
    ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_createALBCLI.png)
- I updated the `crud-srv-sg` to allow incoming traffic only from the `cruddur-alb-sg`:
  ```sh
  aws ec2 authorize-security-group-ingress \
    --group-id sg-02cf170484012d671 \
    --protocol tcp \
    --port 4567 \
    --source-group sg-0c5c9eaec2d4b09f7
  ```
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_SGUpdateInboundRules.png)
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_SGInboundRuleUpdated.png)
- I created a target group
  
#### Testing
- I was able to view my data @ the Load Balancer's DNS name.
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_healthCheckALB.png)
  
- I created S3 bucket in my AWS Console and updated the bucket permissions:
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::127311923021:root"
            },
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::<my_bucket_name>/AWSLogs/<my_account_id>/*"
        }
    ]
  }
  ```
- Modified the Load Balancer's Monitor feature to get access to the S3 bucket for access logs. I updated my bucket's permissions like so:
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::<aws_elb_acct_id_for_my_region>:root"
            },
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::<my_bucket_name>/AWSLogs/<my_account_id>/*"
        }
    ]
  }
  ```
    
    
#### The frontend
- I created the [`Dockerfile.prod`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/Dockerfile.prod)
- Then added an [`nginx.conf`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/nginx.conf) configuration. Then in the `frontend-react-js` directory, ran the `npm run build`
- To build the image, I used:
  ```sh
  docker build \
  --build-arg REACT_APP_BACKEND_URL="http://cruddur-alb-1120480256.us-east-1.elb.amazonaws.com:4567" \
  --build-arg REACT_APP_AWS_PROJECT_REGION="$AWS_DEFAULT_REGION" \
  --build-arg REACT_APP_AWS_COGNITO_REGION="$AWS_DEFAULT_REGION" \
  --build-arg REACT_APP_AWS_USER_POOLS_ID="us-east-1_a2pQFVD9D" \
  --build-arg REACT_APP_CLIENT_ID="39tqubhvvkpq2li4ebajhu7ha" \
  -t frontend-react-js \
  -f Dockerfile.prod \
  .
  ```
- I created the frontend-repo using:
  ```sh
   aws ecr create-repository \
    --repository-name frontend-react-js \
    --image-tag-mutability MUTABLE
  ```
- Then exported the Frontend env var:
  ```sh
  export ECR_FRONTEND_REACT_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/frontend-react-js"
  gp env ECR_FRONTEND_REACT_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/cruddur-python"
  ```
- Having obtained the image URI, I updated the field in the [`frontend-react-js.json`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/aws/task-definitions/frontend-react-js.json) file.
- Then tagged the image:
  ```sh
  docker tag frontend-react-js:latest $ECR_FRONTEND_REACT_URL:latest
  ```
- Pushed the image:
  ```sh
  docker push $ECR_FRONTEND_REACT_URL:latest
  ```
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_dockerImagePushed.png)
- Run & tested the image:
  ```sh
  docker run --rm -p 3000:3000 -it frontend-react-js 
  ```
- I registered the task definition for the frontend [`frontend-react-js.json`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/aws/json/service-frontend-react-js.json) using:
  ```sh
  aws ecs register-task-definition --cli-input-json "file://aws/task-definitions/frontend-react-js.json"
  ```
- In the Networking section of the _frontend service_, I updated the security group to allow traffic to port 3000 from the ALB
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week6-7_LBHealthCheck.png)
- I created the Service using:
  ```sh
  aws ecs create-service --cli-input-json "file://aws/json/service-frontend-react-js.json"
  ```
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_ecsFrontendServiceCLI.png)
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_frontendServiceECS.png)
- View app via LB DNS name
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week6-7_cruddur%40ALB.png)


#### Registering the domain in Route53
- Using AWS DNS service, Route53, I registered a [domain](https://cloudconceptchecker.com/) and hosted zone.
- I used AWS Certificate Manager (ACM) to request a new certificate for my domain so I can interact with the domain via a Secured connection.
  - I validated my certificate by DNS Validation which added the records to my Route 53
- After my certificate was verified, in Route 53, I created records pointing my domain to my load balancer for efficient distribution of traffic. I also configured my LB's Target Group (for the frontend) with the appropriate rules for the listeners.
- In a similar fashion, after creating an A Record in my Hosted Zone for all Backend-related requested. i.e. via `api.cloudconceptchecker.com` to point to the LB, I configured my load balancer's Target Group for the backend with the appropriate rules for the listeners.
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week6-7_manageALBRules.png)
- Health check in hosted domain passes:
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week6-7_app%40HealthCheckSSL.png)

#### Posting Messages in Prod 
Navigating to my domain, I was able to access my app at [cloudconceptchecker.com](https://cloudconceptchecker.com/), sign in, view and post messages!
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week6-7_messages.png)








