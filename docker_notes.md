# Docker Notes
------------

Debian

Install docker compose:
sudo apt-get -y install python-pip
sudo pip install docker-compose

Dump database
su - postgres
pg_dump notes > /root/notes.sql

## Building the application

docker build  -t electrified/notes .

## Starting the application in a container

docker run --detach --read-only --volume /home/ed/dev/notes:/opt/notes/assets --publish 8080:3000 --add-host=database:192.168.25.2 --env DB_USER=ed --env DB_PASSWORD=password --env DB_DATABASE=nodeblog3 --env DB_HOST=database --env ASSETS_DIR=/opt/notes/assets electrified/notes

Starting bash inside the container

docker exec -it <container> bash
docker exec -i notes_database_1 psql -U notes < notes.sql
