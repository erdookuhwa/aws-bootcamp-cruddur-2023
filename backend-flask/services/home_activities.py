from datetime import datetime, timedelta, timezone
from opentelemetry import trace
import logging
from lib.db import db

# tracer = trace.get_tracer("home.activities")

class HomeActivities:
  def run(cognito_user_id=None):
    # logger.info("bootcamp home activities logs")
    sql = db.template('activities','home')
    results = db.query_array_json(sql)
    return results