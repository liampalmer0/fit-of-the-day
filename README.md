# SeniorDesign

## Install

**Requires:** Git, npm/node.js

Run the following commands:

    git clone https://github.com/liampalmer0/SeniorDesign.git
 
    cd SeniorDesign
 
    npm install
    
## Run

Navigate to the SeniorDesign directory and run:

    npm start

or

    npm run debug

## Githooks

**Optional:** make

While in the project directory, run either:

    make 

or

    git config core.hooksPath .githooks

## Commit Guide

    <header>
    <BLANK LINE>
    <body>

Use header format `<type>: <short summary>` 

Where `<type>` is one of the following:

* **build**: Changes that affect the build system or external dependencies (for example: npm)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: A purely visual or CSS change
* **test**: Adding missing tests or correcting existing tests

Based on the Angular contribution guide: https://github.com/angular/angular/blob/master/CONTRIBUTING.md


