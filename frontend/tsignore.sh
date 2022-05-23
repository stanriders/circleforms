#!/bin/sh
cd openapi
find . -name "*.ts" -exec sh -c 'echo -e "// @ts-nocheck\n$(cat $0)" > $0' {} \;