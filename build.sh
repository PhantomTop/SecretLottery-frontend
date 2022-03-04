#!/bin/sh
yarn build
yarn export
sudo rm -rf /var/www/html
sudo cp -r out /var/www/html