import logging
import requests
import json
from datetime import datetime
import time
import socket

class LogstashHandler(logging.Handler):
    def __init__(self, host, port, retries=15, retry_delay=30):
        super().__init__()
        self.host = host
        self.port = port
        self.retries = retries
        self.retry_delay = retry_delay

    def emit(self, record):
        log_entry = {
            'timestamp': self.formatTime(record),
            'level': record.levelname,
            'message': record.getMessage(),
            'logger': record.name,
        }
        
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                sock.connect((self.host, self.port))
                sock.sendall(json.dumps(log_entry).encode('utf-8') + b'\n')
        except Exception as e:
            print(f"Failed to send log to Logstash: {e}")
    def format(self, record):
        log_record = {
            'timestamp': self.formatTime(record),
            'level': record.levelname,
            'message': record.getMessage(),
            'logger': record.name,
        }
        return log_record

    def formatTime(self, record, datefmt=None):
        if datefmt:
            return datetime.fromtimestamp(record.created).strftime(datefmt)
        return self.default_time_format(record)

    def default_time_format(self, record):
        return datetime.fromtimestamp(record.created).isoformat()