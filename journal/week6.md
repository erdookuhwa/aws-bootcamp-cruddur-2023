# Week 6 — Deploying Containers

#### Testing RDS Connection
I began by creating a script that tests a connection to my `Postgres` database is successful. [`test-db-connection`]()
- ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_testDBConnectionScript.png)

Next, to do a *__health check__* for my app, I added an endpoint to the flask app. [`app.py`]() and created a script for the [`health-check`]() which accesses the backend-flask server at the endpoint `api/health-check` and returns a success if `StatusCode = 200` or a failure if not.
- ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_health-check%40URL.png)
- ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week6_health-check%40Script.png)

Then I created a *__CloudWatch Log Group__* and set retention to 1 day using these commands:
```sh
aws logs create-log-group --log-group-name cruddur
aws logs put-retention-policy --log-group-name cruddur --retention-in-days 1
```


💻 UNDER CONSTRUCTION... 🚧
