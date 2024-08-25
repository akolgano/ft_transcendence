FROM python:3.12.2-slim-bullseye

ENV PYTHONBUFFERED=1
RUN useradd -m myuser
USER myuser

WORKDIR /app
COPY requirements.txt requirements.txt

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .


CMD ["gunicorn", "pong.wsgi:application", "--bind", "0.0.0.0:8000"]


#CMD ["python3", "tools/scripts/init.py"]

