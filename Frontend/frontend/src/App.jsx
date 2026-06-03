import { useEffect, useState } from "react";
import API from "./services/api";

function App() {
  const [produits, setProduits] = useState([]);
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");

  // Charger les produits
  const chargerProduits = async () => {
    try {
      const res = await API.get("/produits");
      setProduits(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  };

  // Exécuté au démarrage
 useEffect(() => {
  const fetchProduits = async () => {
    try {
      const res = await API.get("/produits");
      setProduits(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchProduits();
}, []); 
 // Ajouter un produit
  const ajouterProduit = async () => {
    try {
      await API.post("/produits", {
        nom,
        prix,
      });

      setNom("");
      setPrix("");

      chargerProduits();
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  // Supprimer un produit
  const supprimerProduit = async (id) => {
    try {
      await API.delete(`/produits/${id}`);
      chargerProduits();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  // Modifier un produit
  const modifierProduit = async (id) => {
    try {
      await API.put(`/produits/${id}`, {
        nom: "Produit Modifié",
        prix: 999,
      });

      chargerProduits();
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
    }
  };

  return (
    <div>
      <h1>Gestion des Produits</h1>

      <div>
        <input
          type="text"
          placeholder="Nom du produit"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

        <input
          type="number"
          placeholder="Prix"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
        />

        <button onClick={ajouterProduit}>
          Ajouter
        </button>
      </div>

      <hr />

      <h2>Liste des Produits</h2>

      <ul>
        {produits.map((p) => (
          <li key={p.id}>
            <strong>{p.nom}</strong> - {p.prix} Ar

            <button
              onClick={() => modifierProduit(p.id)}
              style={{ marginLeft: "10px" }}
            >
              Modifier
            </button>

            <button
              onClick={() => supprimerProduit(p.id)}
              style={{ marginLeft: "10px" }}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;