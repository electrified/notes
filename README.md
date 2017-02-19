# Notes - a node.js blog engine

Yet another blog engine

[![CircleCI](https://circleci.com/gh/electrified/notes.svg?style=svg)](https://circleci.com/gh/electrified/notes)

## Prerequisites
* Node.js
* PostgreSQL
* Docker (optional)

## Installation with docker (Recommended)
1. Fetch docker-compose.* files from repository
2. `Copy docker-compose.example.yml` to `docker-compose.prod.yml` Adjust database passwords and config as necessary
3. Start the containers `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
4. Run database migrations `docker exec notes_web npm run migrate`
5. Add an admin user `docker exec -i notes_web npm run createUser`

### Dumping the database
`docker exec notes_database pg_dump -U notes notes > db.sql`
### Restoring the database
`docker exec -i notes_database psql -U notes notes < db.sql`
### Querying the database
`docker exec -it notes_database psql -U notes notes`

## Installation without using Docker
1. Clone this repo into e.g. `/srv/http/notes/`
1. Install dependencies `npm install --python=/usr/bin/python2`
2. Symlink systemd service file
`ln -s /srv/http/notes/notes.service /etc/systemd/system`
3. Install postgres and initdb
`su - postgres -c "initdb --locale en_GB.UTF-8 -D '/var/lib/postgres/data'"``
4. Create postgres database
~~~~
su - postgres
createuser notes -P
createdb -O notes notes
~~~~
5. configure connection strings in
`config.(development|production).json`
6. Run db migration to create schema
`npm run migrate`
7. Create an admin user
~~~~
export NODE_ENV=production
npm run createUser
~~~~
8. Enable the service `systemctl enable notes`
9. Start the service `systemctl start notes`
## Running

Supported environment variables
* DB_USER
* DB_PASSWORD
* DB_DATABASE
* DB_HOST
* ASSETS_DIR

Log into admin area
`/admin`
Create first post!

## TODO

* Improve 404 & 500 pages
* Check all promises usage, use promises instead of callbacks
* write tests
* check dependency versions
* Darker UI?
* Express error handling middleware to remove more boilerplate
* Stop using Facebook's fixed-data-tables as they are unmaintained?
* Fix window title on admin pages, make it use configured site title
* Cache invalidation when changing published status
* Fix HMR
* Fix `Warning: connect.session() MemoryStore is not designed for a production environment, as it will leak memory, and will not scale past a single process.`
* Precompile webpack
* Init db with GB locale
* Standardise log format output
* How to perform clean shutdown
