FROM python:3.12.2-slim-bullseye

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY docker/requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install django-cors-headers psycopg2-binary

COPY . .

RUN apt-get update && \
    apt-get install -y netcat && \
    rm -rf /var/lib/apt/lists/*

RUN chmod +x /app/docker/entrypoint.sh

ENTRYPOINT ["/app/docker/entrypoint.sh"]