# Week 1 — App Containerization

#### Containerizing the Backend
- From within the `backend-flask` dir, and run `pip3 install -r requirements.txt` to install app dependencies (`flask`, `flask-cors`)
- Within the `app.py` file, we've configured Environment Variables for `FRONTEND_URL` & `BACKEND_URL` so, when testing, we need to export these variables. For now, it's easy to use an `*` as a catch-all. So, from the terminal, within the `backend-flask` directory:
``` bash
export FRONTEND_URL="*"
export BACKEND_URL="*"
```
- Run `python3 -m flask run --host=0.0.0.0 --port=4567` to start the app. _Navigate to the URL to check_, you should get something similar to this:

![image](https://user-images.githubusercontent.com/64602124/220790797-89ea42a8-87c9-4e1c-8a69-02f1de721af6.png)


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
![image](https://user-images.githubusercontent.com/64602124/220915336-1581eda5-1a30-4325-b6c4-6f56014daba7.png)


#### Docker Compose... _Running Multiple Containers_






