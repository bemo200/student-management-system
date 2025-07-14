
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./students.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE,
  name TEXT,
  email TEXT,
  phone TEXT,
  class TEXT,
  grade INTEGER,
  gender TEXT,
  status TEXT,
  created_at TEXT
)`);

// CRUD endpoints
app.get('/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) { res.status(400).json({error: err.message}); return;}
    res.json(rows);
  });
});

app.post('/students', (req, res) => {
  const {code, name, email, phone, class:cls, grade, gender, status} = req.body;
  const created_at = new Date().toISOString().split('T')[0];
  db.run(
    'INSERT INTO students (code, name, email, phone, class, grade, gender, status, created_at) VALUES (?,?,?,?,?,?,?,?,?)',
    [code, name, email, phone, cls, grade, gender, status, created_at],
    function(err){
      if(err){res.status(400).json({error: err.message}); return;}
      res.json({id:this.lastID});
    }
  );
});

app.put('/students/:id', (req,res)=>{
  const {id} = req.params;
  const {code, name, email, phone, class:cls, grade, gender, status} = req.body;
  db.run(
    `UPDATE students SET code=?, name=?, email=?, phone=?, class=?, grade=?, gender=?, status=? WHERE id=?`,
    [code, name, email, phone, cls, grade, gender, status, id],
    function(err){
      if(err){res.status(400).json({error:err.message});return;}
      res.json({updated: this.changes});
    }
  );
});

app.delete('/students/:id', (req,res)=>{
  const {id} = req.params;
  db.run('DELETE FROM students WHERE id=?',[id],function(err){
    if(err){res.status(400).json({error:err.message});return;}
    res.json({deleted: this.changes});
  });
});

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
