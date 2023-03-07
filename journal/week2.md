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


















