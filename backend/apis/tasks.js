const express = require('express');
const db = require('../db');
const router = express.Router();


router.post('/tasks/addTask', (req, res) => {
    const { title, creation_date, validation_date, description, completed } = req.body;

    db.query(
        "INSERT INTO tasks (title, creation_date, validation_date, description, completed) VALUES (?, ?, ?, ?, ?)",
        [title, creation_date, validation_date, description, completed],
        (err,result) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
               const newTask = {
              id: result.insertId, // get the newly inserted ID
              title,
              creation_date,
              validation_date,
              description,
              completed,
            };

            // Emit new task to all connected clients
            req.io.emit('task:added', newTask);

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
//delete Task

router.delete("/tasks/deleteTask/:id", async (req, res) => {
  const taskId = req.params.id;

  const sql = "DELETE FROM tasks WHERE id = ?";
  
  db.query(sql, [taskId], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  });
});

router.put('/tasks/updateTask/:id', (req, res) => {
  const taskId = req.params.id;
  const { title, description } = req.body;

  db.query(
    "UPDATE tasks SET title = ?, description = ? WHERE id = ?",
    [title, description, taskId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      if (results.affectedRows === 0) {
        return res.status(404).send({ message: "Task not found" });
      }

      // Fetch the updated task details to emit full info
      db.query("SELECT * FROM tasks WHERE id = ?", [taskId], (err2, updatedResults) => {
        if (err2) {
          console.error(err2);
          return res.status(500).send(err2);
        }
        if (updatedResults.length === 0) {
          return res.status(404).send({ message: "Task not found after update" });
        }

        // Emit updated task to all connected clients
        req.io.emit('task:updated', updatedResults[0]);

        res.status(200).send({ message: "Task updated successfully", task: updatedResults[0] });
      });
    }
  );
});
module.exports = router;