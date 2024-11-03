FROM docker.elastic.co/elasticsearch/elasticsearch:7.17.0

USER elasticsearch
# backup directory
RUN mkdir -p /usr/share/elasticsearch/backup && \
    chown -R elasticsearch:elasticsearch /usr/share/elasticsearch/backup

#chown -R elasticsearch:elasticsearch /usr/share/elasticsearch/backup
