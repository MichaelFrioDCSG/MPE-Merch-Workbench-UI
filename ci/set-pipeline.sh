#!/usr/bin/env bash

CONCOURSE_TARGET="merchandise-planning-and-execution"
PIPELINE_NAME="mpe-merch-workbench"
PIPELINE_CONFIG_FILE="pipeline.yml"
VARS_FILE="vars.yml"

# set pipeline
fly --target $CONCOURSE_TARGET set-pipeline \
    --config $PIPELINE_CONFIG_FILE \
    --pipeline $PIPELINE_NAME \
    --load-vars-from $VARS_FILE \
    ${*}

# notify concourse of a pipeline update
fly -t $CONCOURSE_TARGET up --pipeline $PIPELINE_NAME