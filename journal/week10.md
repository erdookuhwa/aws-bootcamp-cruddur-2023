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
 **Architecture Diagram**
 - _View in [Lucid](https://lucid.app/lucidchart/841c461f-d3f2-425d-9377-12e213a703ae/edit?viewport_loc=-1463%2C-232%2C3204%2C1662%2C0_0&invitationId=inv_fdceca6f-ee19-4f0b-9072-6d3488ebf139)_
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10-11_architecture_Network-Layer.png)

 - Exported the artifacts bucket into a variable and added this guide in the cfn [`README.md`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b2a8dad860147dccce1f6823e40755af8c02b928/aws/cfn/Readme.md)
 - Created a networking [`template.yaml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b2a8dad860147dccce1f6823e40755af8c02b928/aws/cfn/ecs/template.yaml) for network resources including VPC, IGW, Route Tables, Subnets, etc.
 - Created a bash script for deploying these network resources: [`network-deploy`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b2a8dad860147dccce1f6823e40755af8c02b928/bin/cfn/network-deploy)
 - After validating my template using:
  ```yml
    aws cloudformation validate-template --template-body file:///workspace/aws-bootcamp-cruddur-2023/aws/cfn/ecs/template.yaml
  ```
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/2a6b15b1a9519cf2db499ab4456589823ce3417f/_docs/assets/Week10-11_cfnValidateNetworking.png)
 - The template was deployed using the `network-deploy` script
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/2a6b15b1a9519cf2db499ab4456589823ce3417f/_docs/assets/Week10-11_cfnNetworkDeploy.png)
##### Resources Deployed
- CloudFormation Stack:
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/2a6b15b1a9519cf2db499ab4456589823ce3417f/_docs/assets/Week10-11_cfnNetworkStackCreating.png)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/2a6b15b1a9519cf2db499ab4456589823ce3417f/_docs/assets/Week10-11_cfnNetworkStack.png)
- VPC:
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/2a6b15b1a9519cf2db499ab4456589823ce3417f/_docs/assets/Week10-11_cfnVPC.png)
- Subnets:
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/2a6b15b1a9519cf2db499ab4456589823ce3417f/_docs/assets/Week10-11_cfnSubnets.png)
- Route Table:
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/2a6b15b1a9519cf2db499ab4456589823ce3417f/_docs/assets/Week10-11_cfnRouteTable.png)
- Template uploaded to S3 artifacts bucket:
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/2a6b15b1a9519cf2db499ab4456589823ce3417f/_docs/assets/Week10-11_cfnTemplateS3.png)


#### CFN Cluster _Detailed Build_
**Architecture Diagram**
- _View in [Lucid](https://lucid.app/lucidchart/841c461f-d3f2-425d-9377-12e213a703ae/edit?viewport_loc=-1463%2C-232%2C3204%2C1662%2C0_0&invitationId=inv_fdceca6f-ee19-4f0b-9072-6d3488ebf139)_
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10-11_architecture_Cluster-Layer.png)
- Updated the [`template.yaml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8d9ebbf431816116da34434514cc4624f6c4ee51/aws/cfn/ecs/template.yaml) for the ECS Cluster build adding more _Parameters and Resources_ to support the cluster.
- Before deploying, need to set the _Certificate_Arn_ which was done using `TOML`

##### CFN TOML
`cfn-toml` will read a file designed to be used with CloudFormation CLI commands within a bash script.
- Installed toml by running the command in terminal. Also added the line to [`gitpod.yml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8d9ebbf431816116da34434514cc4624f6c4ee51/.gitpod.yml) to persist it for use in GitPod
  ```sh
  gem install cfn-toml
  ```
##### CFN Files
- The template file for cfn-toml configurations can be found in the [`config.toml.example`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8d9ebbf431816116da34434514cc4624f6c4ee51/aws/cfn/networking/config.toml.example)
- To get the Certificate Arn for use in the Cluster (ECS) template.yaml, the [`config.toml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8d9ebbf431816116da34434514cc4624f6c4ee51/aws/cfn/ecs/config.toml) specifies the parameters for this
- Wrote a [`config.toml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8d9ebbf431816116da34434514cc4624f6c4ee51/aws/cfn/networking/config.toml) for the networking and updated the [`network-deploy`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8d9ebbf431816116da34434514cc4624f6c4ee51/bin/cfn/network-deploy) script
- Also updated the [`template.yaml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8d9ebbf431816116da34434514cc4624f6c4ee51/aws/cfn/networking/template.yaml) for the networking to reference the right Public & Private Subnets differently

###### Deployed
- Cluster and Network stacks deployed successfully:
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10-11_cfnCluster%26NetworkStacks.png)
- ALB and listeners provisioned from CF stack:
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10-11_cfnClusterALB.png)
 

#### CFN RDS
**Architecture Diagram**
- _View in [Lucid](https://lucid.app/lucidchart/841c461f-d3f2-425d-9377-12e213a703ae/edit?viewport_loc=-1463%2C-232%2C3204%2C1662%2C0_0&invitationId=inv_fdceca6f-ee19-4f0b-9072-6d3488ebf139)_
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10-11_architecture_Service-RDS-Layer.png)
- For deploying the RDS instance, used this [`template.yaml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/aws/cfn/db/template.yaml) using the [`config.toml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/aws/cfn/db/config.toml)
- Modified the template.yaml for the cluster to create a Service SG which can allow access to the RDS SG
  ```yaml
    ...
    # We have to create this SG before the service so we can pass it to database SG
    ServiceSG:
      # https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-security-group.html
      Type: AWS::EC2::SecurityGroup
      Properties:
        GroupName: !Sub "${AWS::StackName}ServSG"
        GroupDescription: Security Group for Fargate Services for Cruddur
        VpcId:
          Fn::ImportValue:
            !Sub ${NetworkingStack}VpcId
        SecurityGroupIngress:
          - IpProtocol: tcp
            SourceSecurityGroupId: !GetAtt ALBSG.GroupId
            FromPort: 80
            ToPort: 80
            Description: ALB HTTP
    ...
    ...
    ServiceSecurityGroupId:
    Value: !GetAtt ServiceSG.GroupId
    Export:
      Name: !Sub "${AWS::StackName}ServiceSecurityGroupId"
    ...
  ```
##### Deployed
- Deployed the cluster stack to add the new SG
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10-11_cfnClusterStackAddSG.png)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10-11_cfnClusterServSG.png)
- Deployed the DB stack using the [`db-deploy`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/bin/cfn/db-deploy) script
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10-11_cfnDBDeploy.png)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10-11_cfnDBStack.png)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10-11_cfnRDSInstance.png)
- In AWS Console, modified the _Connection_URL_ in Parameter Store (Systems Manager) to point to the newly provisioned RDS' endpoint.
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10-11_DBParameterStoreConnModified.png)
 
 
 
 #### CFN DynamoDB
**Architecture Diagram**
- _View in [Lucid](https://lucid.app/lucidchart/841c461f-d3f2-425d-9377-12e213a703ae/edit?viewport_loc=-1463%2C-232%2C3204%2C1662%2C0_0&invitationId=inv_fdceca6f-ee19-4f0b-9072-6d3488ebf139)_
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10-11_architecture_DynamoDB-Layer.png)
 
 
  #### CFN CI/CD
**Architecture Diagram**
- _View in [Lucid](https://lucid.app/lucidchart/841c461f-d3f2-425d-9377-12e213a703ae/edit?viewport_loc=-1463%2C-232%2C3204%2C1662%2C0_0&invitationId=inv_fdceca6f-ee19-4f0b-9072-6d3488ebf139)_
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10-11_architecture_CICD-Layer.png)
 
 #### CFN Static Frontend
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week10-11_architecture_StaticFrontend-Layer.png)


 
 
 
 
 
 
 
 
 
 
 💻🚧👷‍♀️
