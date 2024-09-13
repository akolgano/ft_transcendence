# How to run

## Backend


```
cd srcs
docker-compose down
docker-compose build --no-cache
docker-compose up
```

The Makefile is currently not working

## Migrations

docker exec -it django python3 manage.py makemigrations
docker exec -it django python3 manage.py migrate

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
Currently, you can only navigate using links, do not type the full url yourself.
Example: http://localhost:3000/login will not work, but clicking on the login button will work.

## Check the database for tests

You can go to localhost:8000/admin to manage the database.
User and password: admin

## Translations
When adding some text to the html, add the attribute data-i18n with a key.
Then add that key to the English dictionary (i18n folder), and I will add the translations later for other languages

Example:
- HTML:
```
<h1 data-i18n="navbar.friends"></h1>
```
- In en.json:
```
"navbar" : {
	"friends": "Friends"
},
```
