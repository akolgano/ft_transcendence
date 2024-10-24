# How to run

## Backend


```
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## Migrations

```
docker exec -it django python3 manage.py makemigrations
docker exec -it django python3 manage.py migrate
```

If there were any migrations, you have to stop the container (CONTROL-C) and start it again (docker-compose up).

## Frontend

```
Just go to https://localhost
```

Example: https://localhost/login

## Check the database for tests

You can go to https://localhost/api/admin/ to manage the database.
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
