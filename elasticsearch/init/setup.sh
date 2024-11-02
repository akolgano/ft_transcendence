#!/bin/bash

echo "Setup script..."

#ilm policy
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
# create index patterns
curl -X POST "https://kibana:5601/api/saved_objects/index-pattern" -u elastic:$ELASTIC_PASSWORD \
  -H 'Content-Type: application/json' \
  -H 'kbn-xsrf: true' \
  -k \
  -d '
{
  "attributes": {
    "title": "nginx-logs-*",
    "timeFieldName": "timestamp"
  }
}
'
curl -X POST "https://kibana:5601/api/saved_objects/index-pattern" -u elastic:$ELASTIC_PASSWORD \
  -H 'Content-Type: application/json' \
  -H 'kbn-xsrf: true' \
  -k \
  -d '
{
  "attributes": {
    "title": "django-logs-*",
    "timeFieldName": "timestamp"
  }
}
'

# #attach to template
# curl -X PUT "http://elasticsearch:9200/_template/nginx-logs-template" -u elastic:$ELASTIC_PASSWORD -H 'Content-Type: application/json' -d '{
#   "index_patterns": ["nginx-logs-*"],
#   "template": {
#     "settings": {
#       "index.lifecycle.name": "logs_policy_new"
#     }
#   }
# }'
#link index to ilm policy 
curl -X PUT "http://elasticsearch:9200/nginx-logs-*/_settings" -u elastic:$ELASTIC_PASSWORD -H 'Content-Type: application/json' -d '{
  "index": {
    "lifecycle": {
      "name": "logs_policy_new"
    }
  }
}'
#link index to ilm policy 
curl -X PUT "http://elasticsearch:9200/django-logs-*/_settings" -u elastic:$ELASTIC_PASSWORD -H 'Content-Type: application/json' -d '{
  "index": {
    "lifecycle": {
      "name": "logs_policy_new"
    }
  }
}'

#create a snapshot repository
curl -X PUT "http://elasticsearch:9200/_snapshot/my_backup" -u elastic:$ELASTIC_PASSWORD -H 'Content-Type: application/json' -d '{
  "type": "fs",
  "settings": {
    "location": "/usr/share/elasticsearch/backup"
  }
}'

#create a snapshot for index
curl -X PUT "http://elasticsearch:9200/_snapshot/my_backup/snapshot_nginx_logs" -u elastic:$ELASTIC_PASSWORD -H 'Content-Type: application/json' -d '{
  "indices": "nginx-logs-*",
  "ignore_unavailable": true,
  "settings": {
    "location": "/usr/share/elasticsearch/backup"
  }
  "include_global_state": false
}'

echo "Setup completed."