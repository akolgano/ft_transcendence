#!/bin/sh

# Wait for the database to be ready
echo "Waiting for database..."
while ! nc -z $POSTGRES_HOST 5432; do
  sleep 1
done

# Apply migrations
echo "Applying migrations..."
python manage.py makemigrations
python manage.py migrate

# Start the Gunicorn server
exec gunicorn pong.wsgi:application --bind 0.0.0.0:8000
