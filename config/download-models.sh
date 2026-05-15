#!/bin/bash

mkdir -p models/mobilenet_v2
git clone https://github.com/infinitered/nsfwjs.git temp
cp -r temp/models/* models/mobilenet_v2/
rm -rf temp