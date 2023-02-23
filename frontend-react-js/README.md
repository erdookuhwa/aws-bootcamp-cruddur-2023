## Frontend React JS

#### Building the Frontend:
- In the `frontend-react-js` directory, `npm install` to install node modules.
- I created the `Dockerfile` with the following content:
``` Dockerfile
FROM node:16.18

ENV PORT=3000

COPY . /frontend-react-js
WORKDIR /frontend-react-js
RUN npm install
EXPOSE ${PORT}
CMD ["npm", "start"]
```
- Built the frontend image using: `docker build -t frontend-react-js ./frontend-react-js`. 
- I used `docker images` to verify the image was built:
![image](https://user-images.githubusercontent.com/64602124/220914694-b77cc7b5-447d-4b60-9cae-1bce9e90891e.png)
- Run the container using `docker run -d -p 3000:3000 frontend-react-js` and verified at the URL:

![image](https://user-images.githubusercontent.com/64602124/220920137-7f8dd47f-1bea-4904-8367-55f9e3c76245.png)

- Back in the terminal, I used `docker ps` to view running container & get the `container_id` then stop and remove the container using: `docker stop <container_id> && docker rm <container_id>`
