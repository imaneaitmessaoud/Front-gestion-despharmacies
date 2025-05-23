import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const AjouterVente = () => {
  const navigate = useNavigate();

  const [dateVente, setDateVente] = useState("");
  const [utilisateurId, setUtilisateurId] = useState("");
  const [lignes, setLignes] = useState([{ medicamentId: "", quantite: 1 }]);
  const [medicaments, setMedicaments] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medRes, userRes] = await Promise.all([
          api.get("/medicaments"),
          api.get("/utilisateurs"),
        ]);
        setMedicaments(medRes.data);
        setUtilisateurs(userRes.data);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLigneChange = (index, field, value) => {
    const updated = [...lignes];
    updated[index][field] = value;
    setLignes(updated);
  };

  const ajouterLigne = () => {
    setLignes([...lignes, { medicamentId: "", quantite: 1 }]);
  };

  const supprimerLigne = (index) => {
    const updated = lignes.filter((_, i) => i !== index);
    setLignes(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation de stock
    for (const ligne of lignes) {
      const medoc = medicaments.find(
        (m) => m.id === parseInt(ligne.medicamentId)
      );
      if (!medoc) {
        alert("Médicament introuvable.");
        return;
      }
      if (parseInt(ligne.quantite) > medoc.quantiteStock) {
        alert(
          `Stock insuffisant pour ${medoc.nom}. Disponible : ${medoc.quantiteStock}`
        );
        return;
      }
    }

    try {
      const dto = {
        dateVente,
        utilisateurId: parseInt(utilisateurId),
        lignes: lignes.map((l) => ({
          medicamentId: parseInt(l.medicamentId),
          quantite: parseInt(l.quantite),
        })),
      };

      await api.post("/ventes", dto);
      alert("Vente ajoutée avec succès !");
      navigate("/admin/ventes");
    } catch (err) {
      console.error("Erreur ajout vente", err);
      alert("Erreur lors de l'ajout.");
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner /> Chargement...
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card>
        <CardHeader>Nouvelle Vente</CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Date de vente</Label>
                  <Input
                    type="datetime-local"
                    value={dateVente}
                    onChange={(e) => setDateVente(e.target.value)}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Utilisateur</Label>
                  <Input
                    type="select"
                    value={utilisateurId}
                    onChange={(e) => setUtilisateurId(e.target.value)}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    {utilisateurs.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nom} {u.prenom}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            {lignes.map((ligne, index) => {
              const selectedMed = medicaments.find(
                (m) => m.id === parseInt(ligne.medicamentId)
              );

              return (
                <Row key={index}>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Médicament</Label>
                      <Input
                        type="select"
                        value={ligne.medicamentId}
                        onChange={(e) =>
                          handleLigneChange(index, "medicamentId", e.target.value)
                        }
                        required
                      >
                        <option value="">-- Sélectionner --</option>
                        {medicaments.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.nom}
                          </option>
                        ))}
                      </Input>
                      {selectedMed && (
                        <small className="text-muted">
                          Stock disponible : {selectedMed.quantiteStock}
                        </small>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Quantité</Label>
                      <Input
                        type="number"
                        min="1"
                        value={ligne.quantite}
                        onChange={(e) =>
                          handleLigneChange(index, "quantite", e.target.value)
                        }
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <Button
                      color="danger"
                      onClick={() => supprimerLigne(index)}
                      disabled={lignes.length === 1}
                    >
                      ✕
                    </Button>
                  </Col>
                </Row>
              );
            })}

            <Button
              color="secondary"
              type="button"
              onClick={ajouterLigne}
              className="mb-3"
            >
              + Ajouter un médicament
            </Button>

            <div>
              <Button type="submit" color="primary">
                💾 Enregistrer
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default AjouterVente;
