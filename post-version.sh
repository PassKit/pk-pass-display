#!/bin/bash
#push dist branch and tags
echo "pushing dist branch"
git push -q
echo "pushing tags"
git push --tags -q

#publish new version
echo "publishing version"
npm publish

#go back to master branch
git checkout -q master
#replace master version with new version
echo "updating master branch to version "$npm_package_version
#this perl snippet matches "version": "1.0.0" (with either " or ' quotes and any version number) and replaces it with current version number
perl -pi -e 's/(?:'\''version'\''|"version")\s*:\s*(?:"[0-9\.]*"|'\''[0-9\.]*'\'')/"version": "'$npm_package_version'"/' package.json
#commit version change
git add -A
git commit -q -m "$npm_package_version"
git push -q
echo "all versioning finished"
