# How to run

## Backend


```
cd srcs
docker-compose down
docker-compose build --no-cache
docker-compose up
```

The Makefile is currently not working


## Frontend

### Go to frontend folder

```
cd frontend
```

### Run server on port 3000

```
python3 -m http.server 3000
```

### Go to http://localhost:3000/


## Check the database for tests

You can go to localhost:8000/admin to manage the database.
User and password: admin
