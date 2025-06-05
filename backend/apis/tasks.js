const express = require('express');
const db = require('../db');
const router = express.Router();


router.post('/tasks/addTask', (req, res) => {
    const { title, creation_date, validation_date, description, completed } = req.body;

    db.query(
        "INSERT INTO tasks (title, creation_date, validation_date, description, completed) VALUES (?, ?, ?, ?, ?)",
        [title, creation_date, validation_date, description, completed],
        (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            res.status(200).send({ message: 'added successfully' });
        }
    );
});

router.get('/tasks/getTask', (req, res) => {
  db.query("SELECT * FROM tasks ORDER BY creation_date DESC", (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

router.put("/tasks/complete/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE tasks SET completed = 1, validation_date = NOW() WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error updating task:", err);
        return res.status(500).json({ error: "Error updating task" });
      }

      res.status(200).json({ message: "Task marked as complete and validated" });
    }
  );
});

// Update description for a task
router.put('/tasks/updateDescription/:id', (req, res) => {
  const taskId = req.params.id;
  const { description } = req.body;

  db.query(
    "UPDATE tasks SET description = ? WHERE id = ?",
    [description, taskId],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      if (results.affectedRows === 0) {
        return res.status(404).send({ message: "Task not found" });
      }
      res.status(200).send({ message: "Description updated successfully" });
    }
  );
});

module.exports = router;