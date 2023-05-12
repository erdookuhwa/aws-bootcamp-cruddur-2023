# Week 10 — CloudFormation Part 1

#### CFN Cluster
- Defined an ECS Cluster in [`template.yaml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b2a8dad860147dccce1f6823e40755af8c02b928/aws/cfn/ecs/template.yaml)
```yml
  AWSTemplateFormatVersion: 2010-09-09
  Description: |
    Setup ECS Cluster
  Resources:
    ECSCluster: #LogicalName
      Type: 'AWS::ECS::Cluster'
      Properties:
        ClusterName: My-CFN-Cluster
        CapacityProviders:
          - FARGATE
```
###### Validating Your Template
- Using _cfn-lint_; installed from terminal:
  ```sh
  pip install cfn-lint
  ```
- To run, use `cfn-lint <path_to_template>`
- Using aws cli; run the command from terminal.
  ```sh
  aws cloudformation validate-template --template-body file:///workspace/aws-bootcamp-cruddur-2023/aws/cfn/ecs/template.yaml
  ```
  - No errors were found:
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10_validateCFNTemplate.png)
  
- Made a script to deploy the cloudformation stack [`ecs-deploy`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b2a8dad860147dccce1f6823e40755af8c02b928/bin/cfn/ecs-deploy)
```sh
  #! /usr/bin/env bash
  set -e # stop the execution of the script if it fails

  CFN_PATH="/workspace/aws-bootcamp-cruddur-2023/aws/cfn/template.yaml"
  echo $CFN_PATH

  cfn-lint $CFN_PATH

  aws cloudformation deploy \
    --stack-name "my-cluster-cfn-stack" \
    --s3-bucket "ek-cfn-artifacts" \
    --template-file "$CFN_PATH" \
    --no-execute-changeset \
    --capabilities CAPABILITY_NAMED_IAM
```
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10_cfnDeploy.png)
  - Before running the script, I manually created my _ek-cfn-artifacts_ bucket in s3
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10_cfnBucket.png)

 
 - After deploying, in the console > CloudFormation stacks, since the option for execute change set was not enabled, this was manually executed
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10_cfnECSClusterCreating.png)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10_cfnExecuteChangeSet.png)
- The Cluster in ECS
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/14aa6ec9af2edef89f46fde3d7085de5177eff46/_docs/assets/Week10-11_ECSClusterCFN.png)
- The ECS template gets uploaded in the s3 bucket
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10_templateInS3.png)
 #### Persist to GitPod
 - Persisted the install of `cfn-lint` and `cfn-guard` to my [`gitpod.yml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/49a423d37bd879818006158efd05772e8dd7e71a/.gitpod.yml) env by adding in the following lines:
 ```yml
   - name: cfn
    before: |
      pip install cfn-lint
      cargo install cfn-guard
  ```
  
#### Policy as Code
- Using `cargo install cfn-guard` from terminal, _cfn-guard_ was installed
- This enforces security and compliance in the _Cluster_. [`task-definition.guard`]()
  - To run generate a guard file from this template, this command was run from terminal:
    ```sh
    cfn-guard rulegen --template <path_to_template.yaml>
    ```
    ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10_cfnGuard.png)
  - It generated the following rule in [`ecs-cluster.guard`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b2a8dad860147dccce1f6823e40755af8c02b928/aws/cfn/ecs/ecs-cluster.guard)
    ```json
      let aws_ecs_cluster_resources = Resources.*[ Type == 'AWS::ECS::Cluster' ]
      rule aws_ecs_cluster when %aws_ecs_cluster_resources !empty {
        %aws_ecs_cluster_resources.Properties.CapacityProviders == ["FARGATE"]
        %aws_ecs_cluster_resources.Properties.ClusterName == "My-CFN-Cluster"
      }
    ```
  
 #### CFN Networking
 - Exported the artifacts bucket into a variable and added this guide in the cfn [`README.md`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b2a8dad860147dccce1f6823e40755af8c02b928/aws/cfn/Readme.md)
 - Created a networking [`template.yaml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b2a8dad860147dccce1f6823e40755af8c02b928/aws/cfn/ecs/template.yaml) for network resources including VPC, IGW, Route Tables, Subnets, etc.
 - Created a bash script for deploying these network resources: [`network-deploy`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b2a8dad860147dccce1f6823e40755af8c02b928/bin/cfn/network-deploy)
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 💻🚧👷‍♀️
