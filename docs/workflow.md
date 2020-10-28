# Commit Workflow

The basic path every change follows is :

1. Create Issue
2. Code & Test
3. Commit & Push
4. Pull Request
5. Merge to Master

---

## Helpful Git Commands

`git pull` - pull from remote repository

`git push` - push to remote repository

`git log` - see commit history

`git status` - see what's staged for commit

`git branch` - see what branch you're on

`git merge <branch name>` - merge a branch into the one you're on

`git switch <branch name>` - switch to branch

`git branch <branch name>` - create new branch

`git push -u origin <branch name>` - push branch to remote

---

## Creating Issues

Use GitHub Issues tab to create a new issue.  Include any important information or issue details in the description.

**Be sure to include Labels and Project**

---

## Coding & Testing

Write code and mocha/nightwatch tests

Then run all tests to validate

### Run Mocha Unit Tests

`npm test`

### Run Nightwatch Browser Tests (Chrome)
*Note: Local server must be running for browser tests*

Linux/MacOS:

`npm run nw`

Windows:

`npm run nww`

---

## Committing and Pushing 

Once you finish and test the changes :
- Make sure you're on your own branch (not master)

- Stage your changes
  
  `git add <filename>` 
  
  or
  
  `git add -A` to add all changed files

- Commit to your local branch

  `git commit -m "feat: improve cat assistant" -m "Add longer whiskers" -m "Fix #857"`

  Creates the commit message: 
      
      feat: improve cat assistant

      Add longer whiskers

      Fix #857

- `git fetch` to make sure you have the most recent code from master

- Rebase your branch onto origin/master
  
  `git rebase origin/master`

- Solve any conflicts from the rebase and restage the changes

- Continue the rebase with `git rebase --continue`

- Push to your remote branch

  `git push`

---

## Pull Requests

Once you push the code to your remote branch : 

1. Go to the pull request tab in GitHub
2. Click "new pull request" button
3. Select your branch as the compare branch and master as base
4. Then click "create pull request"
5. Title the pull request with the related issue title and number
  
    E.g. My Issue #51

6. Add a description of the changes made
7. **Make sure to add**
    - Liam as Reviewer 
    - Yourself as Assignee
    - The associated Project
    - A closing keyword ("fix", "close", or "resolve") and the issue number to link the request to the issue

      E.g. Fix #1357
