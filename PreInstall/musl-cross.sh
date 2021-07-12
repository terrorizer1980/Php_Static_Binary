#!/bin/bash
set -ex
#
git clone https://github.com/pmmp/musl-cross-make.git /tmp/musl-cross-make 
cd /tmp/musl-cross-make
echo "TARGET = aarch64-linux-musl
OUTPUT = /usr/local" > config.mak
make > /dev/null
make install -j$(nproc)