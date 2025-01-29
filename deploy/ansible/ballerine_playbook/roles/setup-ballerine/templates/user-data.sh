#!/bin/bash

default_user_name="admin@admin.com"
default_user_password=admin

echo "${default_user_name}:${default_user_password}" > /home/ballerine/ballerine/credential

echo -e "\n***************************************************\n*     Default username : $default_user_name     *\n*     Default password : $default_user_password            *\n***************************************************\n" >/dev/console
