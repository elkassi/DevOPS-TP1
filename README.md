# Daily Tasks

A small task tracker built with plain HTML, CSS, and JavaScript. Tasks are saved in your browser's local storage.

## Run

Open `index.html` in a browser. No installation or server is required.

## Run with Docker

With Docker Desktop running, build the image and start a container:

```sh
docker build -t daily-tasks:local .
docker run --name daily-tasks -d -p 8080:80 daily-tasks:local
```

Visit <http://localhost:8080>. Stop and remove the container with:

```sh
docker stop daily-tasks
docker rm daily-tasks
```

## Features

- Add tasks with Enter or the Add button.
- Mark tasks complete, delete them, and filter by All, Active, or Completed.
- Clear completed tasks.
- Keep tasks after refreshing the page.
- See a live progress bar showing how many tasks are complete.
