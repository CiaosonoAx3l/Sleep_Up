import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname per ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Apri database (file dentro server/db/sleepdata.db)
const dbPath = path.join(__dirname, "db", "sleepdata.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Errore apertura database:", err.message);
  } else {
    console.log("Database aperto con successo.");
  }
});

// Endpoint login (semplice check email+password)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM sleep_data WHERE email = ? AND password = ? LIMIT 1`;
  db.get(query, [email, password], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Errore server" });
    }
    if (row) {
      res.json({ success: true, email: row.email });
    } else {
      res.status(401).json({ success: false, message: "Credenziali errate" });
    }
  });
});

// Endpoint dati filtrati per utente e data singola (YYYY-MM-DD)
app.get("/api/data/:user/:date", (req, res) => {
  const user = req.params.user;
  const date = req.params.date; // formato YYYY-MM-DD
  const query = `
    SELECT * FROM sleep_data
    WHERE email = ?
    AND date(timestamp) = ?
    ORDER BY timestamp
  `;
  db.all(query, [user, date], (err, rows) => {
    if (err) {
      console.error("Errore nella query:", err.message);
      res.status(500).json({ error: "Errore nella query al database" });
    } else {
      res.json(rows);
    }
  });
});

// Nuovo endpoint dati per utente e intervallo di date (start e end in formato YYYY-MM-DD)
app.get("/api/sleep", (req, res) => {
  const { user, start, end } = req.query;

  if (!user || !start || !end) {
    return res.status(400).json({ error: "Parametri user, start e end richiesti" });
  }

  const query = `
    SELECT * FROM sleep_data
    WHERE email = ?
      AND date(timestamp) BETWEEN ? AND ?
    ORDER BY timestamp
  `;

  db.all(query, [user, start, end], (err, rows) => {
    if (err) {
      console.error("Errore nella query:", err.message);
      return res.status(500).json({ error: "Errore nella query al database" });
    }
    res.json(rows);
  });
});
// ... il resto del codice come prima ...

// Nuovo endpoint per upload dati sleep via CSV parsato
app.post("/api/upload-sleep", (req, res) => {
  const { records } = req.body;
  if (!Array.isArray(records)) {
    return res.status(400).json({ error: "Formato dati errato, records deve essere un array" });
  }

  const insertQuery = `INSERT INTO sleep_data (email, timestamp, stage) VALUES (?, ?, ?)`;
  const stmt = db.prepare(insertQuery);

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    for (const rec of records) {
      // Controllo base per sicurezza (opzionale)
      if (!rec.email || !rec.timestamp || !rec.stage) {
        continue; // salta record incompleti
      }
      stmt.run([rec.email, rec.timestamp, rec.stage]);
    }
    db.run("COMMIT", (err) => {
      if (err) {
        console.error("Errore inserimento dati:", err);
        return res.status(500).json({ error: "Errore inserimento dati nel database" });
      }
      res.json({ success: true, message: "Dati inseriti con successo" });
    });
  });
});

// Avvio server
app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
});
