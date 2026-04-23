const express = require("express");
const router = express.Router();
const prisma = require("../config/db");

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (e) {
    console.log(e);
    res.json([]);
  }
});

// CREATE task
router.post("/", async (req, res) => {
  const { title } = req.body;

  const task = await prisma.task.create({
    data: { title }
  });

  res.json(task);
});

// DELETE task
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.task.delete({
    where: { id: Number(id) }
  });

  res.json({ success: true });
});

module.exports = router;
