#!/usr/bin/env bash

if [ "$TRAVIS_BRANCH" != "master" ]
then
  echo "This commit was made against the $TRAVIS_BRANCH and not the master! No deploy!"
  exit 0
fi

if [ "$TRAVIS_PULL_REQUEST" != "false" ]
then
  echo "This Pull Request ($TRAVIS_PULL_REQUEST) will not be auto-deployed!"
  exit 0
fi

# Set up "identity"
git config --global user.email "ben@benmvp.com"
git config --global user.name "Travis CI Auto-Deployer"

# Run gh-pages script
./node_modules/.bin/gh-pages \
  --repo https://$GITHUB_TOKEN@github.com/benmvp/bart-salmon.git \
  --dist web/public \
  --message 'Auto deploy from Travis CI'
