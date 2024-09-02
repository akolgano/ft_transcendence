FROM python:3.12.2-slim-bullseye

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt \
	&& python -m pip install django-cors-headers

COPY . .

RUN apt-get update \
    && apt-get install -y netcat \
    && rm -rf /var/lib/apt/lists/*



RUN chmod +x entrypoint.sh


#ENTRYPOINT ["sh", "entrypoint.sh"]

#CMD ["gunicorn", "pong.wsgi:application", "--bind", "0.0.0.0:8000"]


CMD ["sh", "-c", "\
    echo 'Waiting for database...' && \
    while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do sleep 1; done && \
    echo 'Applying migrations...' && \
    python manage.py migrate && \
    echo 'Starting Gunicorn server...' && \
    exec gunicorn pong.wsgi:application --bind 0.0.0.0:8000"]
