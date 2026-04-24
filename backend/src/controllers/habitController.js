const prisma = require("../config/db");

// GET habits
exports.getHabits = async (req, res) => {
  const habits = await prisma.habit.findMany({
    where: { userId: req.user.userId },
    include: { logs: true },
    orderBy: { id: "desc" }
  });
  res.json(habits);
};

// CREATE habit
exports.createHabit = async (req, res) => {
  const { title } = req.body;

  const habit = await prisma.habit.create({
    data: {
      title,
      userId: req.user.userId
    }
  });

  res.json(habit);
};

// CHECK (daily mark)
exports.checkHabit = async (req, res) => {
  const { id } = req.params;

  const today = new Date();
  today.setHours(0,0,0,0);

  const log = await prisma.habitLog.create({
    data: {
      habitId: Number(id),
      date: today
    }
  });

  res.json(log);
};

// DELETE habit
exports.deleteHabit = async (req, res) => {
  const { id } = req.params;

  await prisma.habit.delete({
    where: { id: Number(id) }
  });

  res.json({ success: true });
};
