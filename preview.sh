#!/usr/bin/env bash

set -e

sphinx-build -b html -d build/doctrees source build/html

cd build/html
open http://localhost:8000
python -m SimpleHTTPServer

