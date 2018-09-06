#!/bin/bash

# develop
if [ "$TRAVIS_BRANCH" = "develop" ]; then 
    ENV=dev npm run build && ENV=dev npm run zip && ssh -i $encrypted_e7d9ab5b8337_key -o "StrictHostKeyChecking no" root@$HOST 'rm dist-dev.zip'  && scp -i $encrypted_e7d9ab5b8337_key dist-dev.zip root@$HOST:/root && ssh -i $encrypted_e7d9ab5b8337_key -o "StrictHostKeyChecking no" root@$HOST 'unzip -o dist-dev.zip';
fi
# master
if [ "$TRAVIS_BRANCH" = "master" ]; then
    ENV=prod npm run build && ENV=prod npm run zip && ssh -i $encrypted_e7d9ab5b8337_key -o "StrictHostKeyChecking no" root@$HOST 'rm dist-prod.zip'  && scp -i $encrypted_e7d9ab5b8337_key dist-prod.zip root@$HOST:/root && ssh -i $encrypted_e7d9ab5b8337_key -o "StrictHostKeyChecking no" root@$HOST 'unzip -o dist-prod.zip';
fi
