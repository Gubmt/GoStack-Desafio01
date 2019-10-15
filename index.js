const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let contReq = 0;

server.use((req, res, next) => {
  contReq++;
  console.log(`Requisições: ${contReq}`);
  return next();
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(pos => pos.id == id);

  if (!project) {
    return res.status(400).json("Esse projeto não existe");
  }
  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const newProject = {
    id,
    title,
    tasks: []
  };

  projects.push(newProject);

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const newProject = projects.find(pos => pos.id == id);

  newProject.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(pos => pos.id == id);

  projects.splice(index, 1);

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(pos => pos.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
