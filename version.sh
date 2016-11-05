#!/bin/bash
#exit on any error
set -e
#check that the current git branch is master, otherwise exit script
branch_name=$(git symbolic-ref -q HEAD)
branch_name=${branch_name##refs/heads/}
branch_name=${branch_name:-HEAD}
if [ $branch_name != "master" ]; then
    echo "Only run versioning from master branch"
    exit 1
fi

#switch branch to distribution branch and merge latest changes from master
git checkout dist
git merge master -q --no-edit --log --no-commit
#build the distribution files and then finish merge
gulp
git add -A
git commit --no-edit
