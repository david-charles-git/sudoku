# Sudoku

`These instructions are for the MacOS operating system. If you are using a different operating system, you may need to make some changes to the instructions.`

## Description

This is a Sudoku game written in Typescript, SASS and HTML. This is a work in progress, so some user experience features are not yet implemented.

## Installation

This project uses the following technologies:

- Git - You can download it [here](https://git-scm.com/downloads).
- Node.js - You can download it [here](https://nodejs.org/en/).
- Yarn - You can download it [here](https://yarnpkg.com/).
- Docker Desktop - You can download it [here](https://www.docker.com/products/docker-desktop).
- Visual Studio Code (optional) - You can download it [here](https://code.visualstudio.com/).

Once Git is installed, you can clone the repository by running the following command in your terminal:

```bash
git clone https://github.com/david-charles-git/sudoku.git
```

Once Node.js and Yarn is installed, you can install the project dependencies by running the following command in your terminal:

```bash
yarn install
```

## Running the project

There are four scripts within the package.json file that can be used to run the project:

- `yarn start` - This will build (`yarn build`) the project and open the index.html file in your default browser.
- `yarn build` - This will build the project using the build.sh script and output the files to the dist folder.
- `yarn docker-build` - This will build (`yarn build`) the project and if you have Docker Desktop installed and running, this will build the project image using the Dockerfile.
- `yarn docker-run` - If you have Docker Desktop installed and running, his will run the project image on your local server at [localhost:8080](http://localhost:8080/).
- `yarn aws-push-to-ecr` - If you have Docker Desktop installed and running, this will push the project image to your AWS ECR repository. The file has not been include but an exmaple code snippet is below:

```bash
  # aws-push-to-ecr.sh

  aws_push_to_ecr () {
    ecr_id="123456789012"
    ecr_region="eu-west-1"
    ecr_uri="$ecr_id.dkr.ecr.$ecr_region.amazonaws.com"
    image_name="sudoku:latest"
    echo "Logging into AWS ECR"
    aws ecr get-login-password --region "$ecr_region" | docker login --username AWS --password-stdin "$ecr_uri"
    echo "Pushing image to AWS ECR"
    docker tag "$image_name" "$ecr_uri/$image_name"
    docker push "$ecr_uri/$image_name"
    echo "Image pushed to AWS ECR"
  }
  aws_push_to_ecr
```

## Project Structure

### Root files

- .dockerignore - This file tells Docker which files to ignore when building the project image.
- .gitignore - This file tells Git which files to ignore when pushing to the repository.
- Dockerfile - This file contains the instructions for building the project image.
- package.json - This file contains the project dependencies and scripts.
- README.md - This file contains the project documentation.
- tsconfig.json - This file contains the Typescript compiler options.
- yarn.lock - This file contains the project dependencies and their versions.

### .vscode folder

settings.json - This file contains the Visual Studio Code settings for the project.

### bash folder

- build.sh - This file contains the commands for building the project.

### dist folder

This folder is hidden in Visual Studio Code using the settings.json file in the .vscode folder. This folder contains the compiled project files.

### node_modules folder

This folder is hidden in Visual Studio Code using the settings.json file in the .vscode folder. This folder contains the project dependencies.

### src folder

- favicon.ico - This file contains the favicon for the project.
- index.html - This file contains the HTML for the project.
- robots.txt - This file contains the robots.txt for the project (this is just an example).
- sitemap.xml - This file contains the sitemap.xml for the project (this is just an example).
- assets folder - This folder contains the project assets such as images and fonts etc.
- scripts folder
  - app.ts - This file contains the main application logic.
  - types.d.ts - This file contains the Typescript type definitions.
- styles folder
  - app.scss - This file contains the main application styles.
  - library folder
    - _variables.scss - This file contains the SASS variables.
    - _mixins.scss - This file contains the SASS mixins.
