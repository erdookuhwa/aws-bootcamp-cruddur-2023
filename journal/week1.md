# Week 1 — App Containerization

#### Containerizing the Backend
- From within the `backend-flask` directory, I did `pip3 install -r requirements.txt` to install app dependencies (`flask`, `flask-cors`)
- Within the `app.py` file, I've configured Environment Variables for `FRONTEND_URL` & `BACKEND_URL` so, when testing, I need to export these variables. I am setting my env vars from the terminal, within the `backend-flask` directory:
``` bash
export FRONTEND_URL="*"
export BACKEND_URL="*"
```
- Run `python3 -m flask run --host=0.0.0.0 --port=4567` to start the app. _Navigate to the URL to check_, you should get something similar to this:

![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/Week1_apiJSON.png)


#### Docker! 🐳
- I created the `Dockerfile` in the `backend-flask` directory and uploaded the following instructions to it:

``` Dockerfile
FROM python:3.10-slim-buster

WORKDIR /backend-flask

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ENV FLASK_ENV=development

EXPOSE ${PORT}
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=4567"]
```

#### Building the Container:👷‍♀️
- First, we have to clear our previously set env vars so they don't interfere with the next stages. Use `unset <var_name>`. i.e. 
``` bash
unset FRONTEND_URL
unset BACKEND_URL
```
- Use `docker build -t backend-flask ./backend-flask` to build the image based on the instructions in our `Dockerfile`, with the tag backend-flask & in the container's `backend-flask` directory. Upon successful build, you will get messages in your terminal. Also, use `docker images` to verify.

![image](https://user-images.githubusercontent.com/64602124/220900303-e42043e6-833d-409b-8313-ac427ffa2f73.png)

#### Run the Container: 🏃‍♀️
- Now that we have an image, it's time to run a container. To run, use: `docker run --rm -p 4567:4567 -it -e FRONTEND_URL='*' -e BACKEND_URL='*' backend-flask`
- Verify at the URL, appending `api/activities/home` to view the content (same as when we tested the app locally).

#### Containerize Frontend:
- In the `frontend-react-js` directory, `npm install` to install node modules.
- Create `Dockerfile` like so:
``` Dockerfile
FROM node:16.18

ENV PORT=3000

COPY . /frontend-react-js
WORKDIR /frontend-react-js
RUN npm install
EXPOSE ${PORT}
CMD ["npm", "start"]
```
- Build the frontend image using: `docker build -t frontend-react-js ./frontend-react-js`. Use `docker images` to verify the image was built:
![image](https://user-images.githubusercontent.com/64602124/220914694-b77cc7b5-447d-4b60-9cae-1bce9e90891e.png)
- Run the container using `docker run -d -p 3000:3000 frontend-react-js`. Verify at the URL, you should get this page:

![image](https://user-images.githubusercontent.com/64602124/220920137-7f8dd47f-1bea-4904-8367-55f9e3c76245.png)

- Use `docker ps` to view running container & get the `container_id` then stop and remove the container using: `docker stop <container_id> && docker rm <container_id>`


#### Docker Compose... _Running Multiple Containers_
- Create the `docker-compose.yml` file in the root directory and update it using:
``` yaml
version: "3.8"
services:
  backend-flask:
    environment:
      FRONTEND_URL: "https://3000-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
      BACKEND_URL: "https://4567-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
    build: ./backend-flask
    ports:
      - "4567:4567"
    volumes:
      - ./backend-flask:/backend-flask
  frontend-react-js:
    environment:
      REACT_APP_BACKEND_URL: "https://4567-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
    build: ./frontend-react-js
    ports:
      - "3000:3000"
    volumes:
      - ./frontend-react-js:/frontend-react-js

# the name flag is a hack to change the default prepend folder
# name when outputting the image names
networks: 
  internal-network:
    driver: bridge
    name: cruddur
```
- Run the `docker-compose.yml` file using `docker compose up -d` This builds both the frontend & backend in one go.

![image](https://user-images.githubusercontent.com/64602124/220921094-17aa6efd-c50f-40d3-844a-b84f2dd93d0c.png)

- Use `docker ps` to verify:

![image](https://user-images.githubusercontent.com/64602124/220921139-1c9d0601-aa00-4a85-8df6-4889c82424fb.png)
- Clean up using `docker stop <container_id 1> <container_id 2> && docker rm <container_id 1> <container_id 2>`

#### Creating the Notification Feature
##### The Backend
- I started the `frontend` and `backend` apps using `docker compose up`. And in the Ports section of my GitPod, I opened both the FE & BE to make them public. And I was able to access the app by clicking on the URL. I hit the Join Now button & put in my credentials to login.
- I added a new `OpenAPI` path for the notification feature and updated it like so:
``` yaml
  /api/activities/notifications:
    get:
      description: 'Return a feed of activity for people I follow'
      tags:
        - activities
      parameters: []
      responses:
        '200':
          description: Returns an array of activities
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Activity'
```
- I updated my `app.py` file, adding a route to the notifications:
``` python
@app.route("/api/activities/notifications", methods=['GET'])
def data_notifications():
  data = NotificationActivities.run()
  return data, 200
```
- I also updated my imports to make a call to the newly created notification service in `app.py`
``` python
from services.notifications_activities import *
```
- Next, in my `services`, I created the `notifications_activities.py` microservice and populated it like so:
``` python
from datetime import datetime, timedelta, timezone

class NotificationActivities:
    def run():
        now = datetime.now(timezone.utc).astimezone()
        results = [{
        'uuid': '68f126b0-1ceb-4a33-88be-d90fa7109eee',
        'handle':  'star',
        'message': 'Let your light shine!',
        'created_at': (now - timedelta(days=2)).isoformat(),
        'expires_at': (now + timedelta(days=5)).isoformat(),
        'likes_count': 5,
        'replies_count': 1,
        'reposts_count': 0,
        'replies': [{
            'uuid': '26e12864-1c26-5c3a-9658-97a10f8fea67',
            'reply_to_activity_uuid': '68f126b0-1ceb-4a33-88be-d90fa7109eee',
            'handle':  'Worth',
            'message': 'This post has honor!',
            'likes_count': 0,
            'replies_count': 0,
            'reposts_count': 0,
            'created_at': (now - timedelta(days=2)).isoformat()
        }],
        }]
        return results
```
- I tested by heading over to the BE URL and appending `/api/activities/notifications` to get the data:
![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week1_notificationData.png)

##### The Frontend
- I created the NotificationsPage as populated in ➡️ _[NotificationsFeedPage.js](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/src/pages/NotificationsFeedPage.js)_
- In the `src/App.js` I imported the page for the Notifications and add a path to it:
``` js
import NotificationsFeedPage from './pages/NotificationsFeedPage';
# ... existing code
{
    path: "/notifications",
    element: <NotificationsFeedPage />
}
```
- Upon testing, I was able to see my data at the `/notifications` endpoint:
![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week1_notificationFrontend.png)

#### Adding Volumes
After updating the `docker-compose.yml` files with the DynamoDB & Postgres services, I did `docker compose up` to get the apps and DBs running.
##### DynamoDB:
- I updated my `docker-compose.yml` file using the AWS provided [setup for DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html) for Docker.

###### Creating table to test with:
- I created a DynamoDB Table:
``` sh
aws dynamodb create-table \
    --endpoint-url http://localhost:8000 \
    --table-name Music \
    --attribute-definitions \
        AttributeName=Artist,AttributeType=S \
        AttributeName=SongTitle,AttributeType=S \
    --key-schema AttributeName=Artist,KeyType=HASH AttributeName=SongTitle,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --table-class STANDARD
```
- I created a table item:
``` sh
aws dynamodb put-item \
    --endpoint-url http://localhost:8000 \
    --table-name Music \
    --item \
        '{"Artist": {"S": "No One You Know"}, "SongTitle": {"S": "Call Me Today"}, "AlbumTitle": {"S": "Somewhat Famous"}}' \
    --return-consumed-capacity TOTAL  
```
- To view the table, I used: 
``` sh
aws dynamodb list-tables --endpoint-url http://localhost:8000
```
- Got table records using:
``` sh
aws dynamodb scan --table-name Music --query "Items" --endpoint-url http://localhost:8000
```
- I got records showing that interacting with the DynamoDB Local DB was successful
![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week1_ddb_local_results.png)

##### Postgres:
- I populated the `docker-compose.yml` by adding this code to the services section:
``` yml
services:
  db:
    image: postgres:13-alpine
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - '5432:5432'
    volumes: 
      - db:/var/lib/postgresql/data
volumes:
  db:
    driver: local
```
- Postgres requires a client to run. I added the task in `gitpod.yml` file to persist the postgres client installation everytime I start up GitPod.
``` yml
  - name: postgres
    init: |
      curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc|sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
      echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list
      sudo apt update
      sudo apt install -y postgresql-client-13 libpq-dev
```
- For now, within my terminal, I ran through the cmds individually to install them
- I checked if my client was running using ` psql -Upostgres -h localhost` and inputted the password to make a connection to my postgres db which was successful
![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week1_postgres_connected.png)












