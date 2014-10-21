#!/bin/bash

git clone -b static-site git@github.com:luis-kaufmann-silva/templates.git static-site-temp && mv static-site-temp/static-site ./ && rm -rf ./static-site-temp;
