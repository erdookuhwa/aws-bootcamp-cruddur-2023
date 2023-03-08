# Week 2 — Distributed Tracing

#### Instrumenting using Honeycomb
I signed up for a [Honeycomb account](https://ui.honeycomb.io/login) and automatically had an environment created. Using the `API_KEY` from that environment, I instrumented my app (the backend) by setting env values:
```bash
export HONEYCOMB_API_KEY="<my_api_key>"
export HONEYCOMB_SERVICE_NAME="Cruddur"
```
And, persisting those values for use next time in my `GitPod` environment, I used:
```bash
gp env HONEYCOMB_API_KEY="<my_api_key>"
gp env HONEYCOMB_SERVICE_NAME="Cruddur"
```
- I updated my `docker-compose.yml` file by adding to the backend service, new Python env variables for OTEL (OpenTelemetry). Instructions for various languages can be found at [Honeycomb docs](https://docs.honeycomb.io/quickstart/#step-3-instrument-your-application-to-send-telemetry-data-to-honeycomb):
``` sh
OTEL_SERVICE_NAME: "${HONEYCOMB_SERVICE_NAME}"
OTEL_EXPORTER_OTLP_ENDPOINT: "https://api.honeycomb.io"
OTEL_EXPORTER_OTLP_HEADERS: "x-honeycomb-team=${HONEYCOMB_API_KEY}"
```
- Next, I installed the dependencies for my app to work with OpenTelemetry by adding the required packages to my `requirements.txt` file and then running:
```python
pip install -r requirements.txt
```
![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week2_opentelemetryDependencies.png)

- I added the following imports to my `app.py` file:
![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week2_honeycombImports.png)

- Still within my `app.py` file, I initialized tracing and exporter for Honeycomb and initialized auto instrumentation with Flask. My `app.py` file now looks like this:
![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week2_honeycombInstrumentationInApp.png)

- Testing this works... within my `frontend-react-js` directory, I did an `npm install` then cd'd one level back and then `docker compose up` to start both the frontend & backend apps.

###### Running Traces in Honeycomb
- I hit the backend endpoint by visiting the `backend-url/api/activities/home` which returned data as shown in my Honeycomb app:
![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week2_spanInHoneyComb.png)
- Acquiring a tracer: I set up spans as instructed in the honeycomb docs and added a tracer in my `api/activities/home` endpoint, in my corresponding backend service. Please see changes in [`home_activities.py`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/services/home_activities.py) file.
- Image of the trace in honeycomb:
![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week2_tracesInHoneyComb.png)

###### Adding Attributes to a Span
- Added attribute for honeycomb, the updated code can be seen in [`home_activities.py`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/services/home_activities.py) file.

#### Instrumenting AWS X-Ray
- I installed the x-ray sdk by adding `aws-xray-sdk` to my `requirements.txt` file in the backend-flask app and then running 
```python
pip install -r requirements.txt
```
within the backend directory.
- I added to `app.py` config for aws x-ray sdk as seen in the image:
![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week2_addXRaytoApp.png)
###### Setting up AWS X-Ray Resources
- I created an [`xray.json`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/aws/json/xray.json) file.
- Next, from my terminal, I ran the command to create an x-ray group:
```sh
aws xray create-group \
   --group-name "Cruddur" \
   --filter-expression "service(\"backend-service\")"
```
- I created a sampling rule using:
```sh
aws xray create-sampling-rule --cli-input-json file://aws/json/xray.json
```
Sampling in my AWS Management Console:

##### Installing X-Ray Daemon
- I added the config in my [`docker-compose.yml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/docker-compose.yml) for both the env variables and the xray daemon image from DockerHub.
- Next, I tested using `docker compose up` then visited my backend-URL which returned data.

##### Observing Data in AWS Management Console
- Sampling:
![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week2_SamplingInAWSPortal.png)
- X-Ray Service Map
![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week2_xrayServiceMap.png)
- X-Ray Traces:
![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week2_xrayTraces.png)

#### Logging with CloudWatch
- I began by installing `watchtower` which is a log handler for Amazon CloudWatch Logs. To achieve this, I simply added watchtower to my `requirements.txt` file and then ran `pip install -r requirements.txt`

![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week2_watchtowerInstall.png)

- In `app.py`, I made the necessary imports to support using watchtower. I added configuration for the logger to use CloudWatch Logs and created the log_group `cruddur` and also added logging for errors after each request.

![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week2_cruddurLogGroup.png)
- In my `home_activities.py` file, I added some custom logging by importing logging and capturing a message via the `LOGGER.info("bootcamp home activities logs")` in the run function.

- Next, in my `docker-compose.yml` file, I added env variables for `Region, Access_Key_ID, Secret_Access_key` and then `docker compose up` to get everything running; verified by hitting my backend URL that data was being returned.

- In my AWS Management Console > CloudWatch > CloudWatch Log groups, I can see cruddur which I recently created and then drilling in, I'm able to view the log events.
![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week2_loggerEvents.png)




























