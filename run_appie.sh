#!/bin/bash
PYTHONPATH="$HOME/src/appie/:`pwd`" ~/src/appie/bin/appie -w \
  -s ./site_src -t ./build \
  -f appie.AppiePNGParser appie.AppieJPGParser appie.AppieMarkdownParser \
#  -d appie_parsers.dirparser.AppieJinjaDirParser
