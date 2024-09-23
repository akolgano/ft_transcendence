FROM python:3.12.2-slim-bullseye

ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    python -m pip install django-cors-headers && \
    pip install psycopg2-binary

# Copy the rest of the application code
COPY . .

# Install netcat for waiting for the database
RUN apt-get update && \
    apt-get install -y netcat && \
    rm -rf /var/lib/apt/lists/*

# Make the entrypoint script executable
RUN chmod +x entrypoint.sh

# Command to wait for the database, run migrations, and start the server
CMD ["sh", "-c", "\
    echo 'Waiting for database...' && \
    while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do sleep 1; done && \
    echo 'Applying migrations...' && \
    python manage.py migrate && \
    echo 'Running fill_db.py...' && \
    python fill_db.py && \
    echo 'Starting Gunicorn server...' && \
    exec gunicorn pong.wsgi:application --bind 0.0.0.0:8000"]
