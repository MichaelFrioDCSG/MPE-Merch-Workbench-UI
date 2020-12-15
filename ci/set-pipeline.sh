#!/usr/bin/env bash

PROJECT="${1}"
ENV="${2}"
shift 2

# notify concourse of a pipeline update
fly -t $CONCOURSE_TARGET up --pipeline $PIPELINE_NAME

CONCOURSE_TARGET="merchandise-planning-and-execution"
PIPELINE_ENV="${ENV:=dev}"
PIPELINE_NAME="${PROJECT}-${PIPELINE_ENV}"
PIPELINE_CONFIG_FILE="projects/${PROJECT}/pipeline.yml"
VARS_FILE="projects/${PROJECT}/vars/${PIPELINE_ENV}.yml"

# set pipeline
fly --target $CONCOURSE_TARGET set-pipeline \
    --config $PIPELINE_CONFIG_FILE \
    --pipeline $PIPELINE_NAME \
    --load-vars-from $VARS_FILE \
    ${*}

# notify concourse of a pipeline update
fly -t $CONCOURSE_TARGET up --pipeline $PIPELINE_NAME
