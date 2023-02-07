#!/bin/bash

git pull

gradle war

sudo docker stop d107

sudo docker rm d107

sudo docker build -t d107 ../d107

sudo docker run --name=d107 -it -d -p 8081:8080 d107
