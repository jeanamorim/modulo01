const express = require("express");

const server = express();

server.use(express.json());

const users = ["Yuri", "José", "Felipe"];

//Middlewares

const checkUserExists = (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "User not found on request body" });
  }
  return next();
};

const checkUserInArray = (req, res, next) => {
  const user = users[req.params.id];
  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  req.user = user;
  return next();
};

// Rotas

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:id", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);

  return res.json(users);
});

server.put("/users/:id", checkUserInArray, checkUserExists, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  users[id] = name;

  return res.json(users);
});

server.delete("/users/:id", checkUserInArray, (req, res) => {
  const { id } = req.params;

  users.splice(id, 1);

  return res.json(users);
});

// Server
server.listen(3333);
