FROM kibana:7.17.0

USER root

RUN apt-get update && apt-get install -y openssl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/share/kibana/config/ssl

RUN openssl req -x509 -newkey rsa:2048 -keyout /usr/share/kibana/config/ssl/cert.key \
    -out /usr/share/kibana/config/ssl/cert.pem -days 365 -nodes \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"

RUN chmod 600 /usr/share/kibana/config/ssl/cert.key && \
    chmod 644 /usr/share/kibana/config/ssl/cert.pem && \
    chown kibana:kibana /usr/share/kibana/config/ssl/cert.key && \
    chown kibana:kibana /usr/share/kibana/config/ssl/cert.pem

COPY kibana.yml /usr/share/kibana/config/kibana.yml


USER kibana

EXPOSE 5601

CMD ["kibana"]
