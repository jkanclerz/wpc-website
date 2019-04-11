#!/bin/bash

npm run build; echo "Hello"

aws s3 cp ./dist/ \
    s3://$1 \
    --recursive \
    --acl=public-read
