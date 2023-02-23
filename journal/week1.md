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

#### Building the Container:
- First, we have to clear our previously set env vars so they don't interfere with the next stages. Use `unset <var_name>`. i.e. 
``` bash
unset FRONTEND_URL
unset BACKEND_URL
```
