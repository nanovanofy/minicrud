const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/*
Table PostgreSQL :

CREATE TABLE produits (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prix DECIMAL(10,2) NOT NULL
);
*/

// GET tous les produits
app.get("/api/produits", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM produits ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors du chargement des produits",
    });
  }
});

// GET produit par id
app.get("/api/produits/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM produits WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Produit introuvable",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
});

// POST ajouter produit
app.post("/api/produits", async (req, res) => {
  try {
    const { nom, prix } = req.body;

    const result = await pool.query(
      "INSERT INTO produits(nom, prix) VALUES($1, $2) RETURNING *",
      [nom, prix]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de l'ajout",
    });
  }
});

// PUT modifier produit
app.put("/api/produits/:id", async (req, res) => {
  try {
    const { nom, prix } = req.body;

    const result = await pool.query(
      `
      UPDATE produits
      SET nom = $1, prix = $2
      WHERE id = $3
      RETURNING *
      `,
      [nom, prix, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Produit introuvable",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la modification",
    });
  }
});

// DELETE produit
app.delete("/api/produits/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM produits WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Produit introuvable",
      });
    }

    res.json({
      message: "Produit supprimé avec succès",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la suppression",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré : http://localhost:${PORT}`);
});