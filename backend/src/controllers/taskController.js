const prisma = require("../config/db");

// GET all
exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { id: "desc" }
    });
    res.json(tasks);
  } catch (e) {
    res.json([]);
  }
};

// CREATE
exports.createTask = async (req, res) => {
  const { title } = req.body;

  if (!title) return res.status(400).json({ error: "Title required" });

  const task = await prisma.task.create({
    data: { title }
  });

  res.json(task);
};

// UPDATE
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const task = await prisma.task.update({
    where: { id: Number(id) },
    data: { title }
  });

  res.json(task);
};

// DELETE
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  await prisma.task.delete({
    where: { id: Number(id) }
  });

  res.json({ success: true });
};
