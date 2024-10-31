#!/bin/bash

echo "Setup script..."


# Wait for Elasticsearch to be healthy
# until curl -s -u elastic:$ELASTIC_PASSWORD http://localhost:9200/_cluster/health | grep -q '"status":"green\|"status":"yellow"'; do
#   echo "Waiting for Elasticsearch to be healthy..."
#   sleep 5
# done

# Set built-in user passwords
#curl -X POST "http://localhost:9200/_security/user/elastic/_password" -u elastic:$ELASTIC_PASSWORD -d "$ELASTIC_PASSWORD"
#curl -X POST "http://localhost:9200/_security/user/logstash_system/_password" -u elastic:$ELASTIC_PASSWORD -d "$ELASTIC_PASSWORD"
#curl -X POST "http://localhost:9200/_security/user/kibana_system/_password" -u elastic:$ELASTIC_PASSWORD -d "$ELASTIC_PASSWORD"

curl -X PUT "http://elasticsearch:9200/_ilm/policy/logs_policy_new" -u elastic:$ELASTIC_PASSWORD -H 'Content-Type: application/json' -d '{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_age": "30d",
            "max_size": "50gb"
          }
        }
      },
      "warm": {
        "actions": {
          "shrink": {
            "number_of_shards": 1
          },
          "forcemerge": {
            "max_num_segments": 1
          }
        }
      },
      "cold": {
        "actions": {
          "freeze": {}
        }
      },
      "delete": {
        "min_age": "365d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}'
# Create Snapshot Repository
curl -X PUT "http://elasticsearch:9200/_snapshot/my_backup" -u elastic:$ELASTIC_PASSWORD -H 'Content-Type: application/json' -d '{
  "type": "fs",
  "settings": {
    "location": "/usr/share/elasticsearch/backup"
  }
}'

# Wait for the initialization to complete
echo "Setup completed."