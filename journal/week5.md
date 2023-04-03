# Week 5 — DynamoDB and Serverless Caching

I started off by installing `boto3`, an AWS SDK for Python used to interact with my AWS services/resources. I achieved this by adding `boto3` to my [`requirements.txt`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/requirements.txt) file and running the command from terminal:
```py
pip install -r requirements.txt
```
##### Scripts
- I did some cleanup/restructuring for my previous bash scripts using `psql`
  - They all now be found in [`db folder`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/tree/main/backend-flask/bin/db)
    - Also, updated the paths in my [`setup`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/db/setup) script to reflect same
- I also created scripts for manipulating DynamoDB (DDB) and granted them executable access (`chmod u+x <name_of_file>`):
  - [`schema-load`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/schema-load): this creates a table in my `dynamodb-local db`
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_schemaCreateTableDDBLocal.png)
    - [`list-tables`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/list-tables): after loading my schema, I wrote a script to list my tables
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_listTables.png)
  - [`seed`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/seed): add items to ddb table
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_seedDDBTable.png)
  - [`drop`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/drop): successfully deletes a ddb table when you provide the file name
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_droppingDDBTable.png)
  - [`scan`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/scan): to scan (_return all items in table_) the ddb table
  - [`get-conversations`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/patterns/get-conversations): will show user's conversations
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_getConversations.png)
  - [`list-conversations`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/patterns/list-conversations): shows user's conversation
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_listConversations.png)
  - 

  #### Patterns
  ###### Pattern A _List all messages in Message Group_
  - I started off by creating a [`ddb.py`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/lib/ddb.py) object.
  - [`list_users`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/cognito/list-users): this script lists the users in my Cognito User Pool rather than hardcoding the users. 
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_cognitoListUsers.png)
    - I exported my user_pool_id as an environment variable and updated my [`docker-compose.yml`]() to pick up the value from the env var.
    ```sh
    export AWS_COGNITO_USER_POOL_ID <my_cognito_user_pool_id>
    gp env AWS_COGNITO_USER_POOL_ID <my_cognito_user_pool_id>
    ```
- Now that I can list my users, this script [`update-cognito-user-ids`]() updates the cognito_user_id field in the db.
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_updateCognitoUUIDs.png)
  - I also updated the [`setup`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/db/setup) script so that after table is seeded, the cognito_user_id is updated from the `MOCK` value to the actual user's uuid.
- A temp fix for the token error causing the app not to display any messages is due to the message token. I added the this line for the header to the [`MessageGroupsPage.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/src/pages/MessageGroupsPage.js), [`MessageGroupPage.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/src/pages/MessageGroupPage.js), and the [`MessageForm.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/src/components/MessageForm.js)
```js
headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
```
- [`uuid_from_cognito_user_id`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/sql/users/uuid_from_cognito_user_id.sql) a sql that gets the `uuid` of the cognito user.



#### DynamoDB Stream
- I created a table in my AWS account from terminal in `GitPod` by running the command to load the ddb schema to prod:
  ```sh
  ./bin/ddb/schema-load prod
  ```
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_createDDBTableProd.png)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_ddbTableCreatingAWS.png)
- I enabled DynamoDB Streams with the _New Image_ attribute
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_enableDDBStream.png)
- Then I created a VPC Endpoint, permitted the DynamoDB service with Full Access in the same region & VPC as my DDB table.
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_vpcEndpoint.png)
- I granted `Query, PutItem, DeleteItem` access for DynamoDB and the `AWSLambdaInvocation-DynamoDB` access to my lambda function.
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_lambdaPermissions.png)
- I created the lambda function [`cruddur-messaging-stream.py`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/aws/lambdas/cruddur-messaging-stream.py) to trigger a stream and enabled VPC.
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_lambdaFunction.png)
- On my DDB table, I added a lambda trigger
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_lambdaTrigger.png)
###### Testing
I commented the AWS_ENDPOINT_URL in my [`docker-compose.yml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/docker-compose.yml) file so that it can use the VPC Endpoint I created. After importing my data (loading the schema), at my frontend url's `/new/janedoe`, I was able to successfully post a message.
- ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_postJaneDoe.png)
- In my AWS account, I confirmed by checking the Monitor tab of my Lambda function then viewed the CloudWatch logs and the event was triggered
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_ddbStreamLogs.png)





















💻 Under Construction... 🚧
