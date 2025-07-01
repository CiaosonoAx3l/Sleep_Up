import React, { useState } from "react";

function CsvUploader({ userEmail }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Parse CSV semplice (assume: prima riga header, separatore ,)
  const parseCsv = (text) => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim());
    const rows = lines.slice(1);

    return rows.map(line => {
      const values = line.split(",").map(v => v.trim());
      let obj = {};
      headers.forEach((header, i) => {
        obj[header] = values[i];
      });
      return obj;
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = () => {
    if (!file) {
      setMessage("Seleziona un file CSV.");
      return;
    }
    if (!userEmail) {
      setMessage("Utente non autenticato.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csvText = e.target.result;
        const data = parseCsv(csvText);

        // Aggiungi userEmail a ogni record
        const records = data.map(({ timestamp, stage }) => ({
          email: userEmail,
          timestamp,
          stage,
        }));

        setUploading(true);
        setMessage("");

        const response = await fetch("http://localhost:3001/api/upload-sleep", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ records }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Errore upload dati");
        }

        setMessage("File caricato con successo!");
      } catch (error) {
        setMessage(`Errore: ${error.message}`);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Carica file CSV dati sonno</h2>

      <input type="file" accept=".csv" onChange={handleFileChange} />
      
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {uploading ? "Caricamento..." : "Carica"}
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}

export default CsvUploader;
