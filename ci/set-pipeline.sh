#!/usr/bin/env bash

# set pipeline
fly --target merchandise-planning-and-execution set-pipeline --config pipeline.yml --pipeline mpe-merch-workbench \
    ${*}

# notify concourse of a pipeline update
fly -t merchandise-planning-and-execution up --pipeline mpe-merch-workbench
