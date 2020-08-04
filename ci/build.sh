#!/bin/bash
echo "Inside build.sh "

set -xe
# There is still an issue/bug with this. Should 
# be able to use ci as value - https://github.com/angular/angular-cli/blob/master/docs/design/analytics.md
#export NG_CLI_ANALYTICS=ci
export NG_CLI_ANALYTICS="false"

echo "NG_CLI_ANALYTICS="$NG_CLI_ANALYTICS

chmod -R 777 project
cd project
chmod -R 777 ./*
npm install --unsafe-perm --verbose
chmod -R 777 ./*
./node_modules/@angular/cli/bin/ng build --output-hashing=bundles --index=${INDEX_ARGUMENT}
cp Staticfile dist
cp ci/manifest.yml dist
cp -r dist ../build-output