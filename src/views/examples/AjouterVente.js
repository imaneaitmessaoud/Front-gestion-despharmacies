import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";
import api from "../../api";

const AjouterVente = () => {
  const [medicaments, setMedicaments] = useState([]);
  const [lignes, setLignes] = useState([{ medicamentId: "", quantite: 1, id: Date.now() }]);
  const [utilisateurId, setUtilisateurId] = useState("");
  const [dateVente, setDateVente] = useState("");

  useEffect(() => {
    api.get("/medicaments")
      .then(res => setMedicaments(res.data))
      .catch(err => console.error("Erreur chargement médicaments", err));
  }, []);

  const handleLigneChange = (index, field, value) => {
    const updated = [...lignes];
    updated[index][field] = value;
    setLignes(updated);
  };

  const ajouterLigne = () => {
    setLignes([...lignes, { medicamentId: "", quantite: 1, id: Date.now() }]);
  };

  const supprimerLigne = (index) => {
    setLignes(lignes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dto = {
        utilisateurId: utilisateurId || null,
        dateVente: dateVente || null,
        lignes: lignes.map(({ medicamentId, quantite }) => ({
          medicamentId: parseInt(medicamentId),
          quantite: parseInt(quantite)
        }))
      };
      await api.post("/ventes", dto);
      alert("Vente ajoutée avec succès !");
      setLignes([{ medicamentId: "", quantite: 1, id: Date.now() }]);
    } catch (err) {
      console.error("Erreur ajout vente", err);
      alert("Erreur lors de l'ajout.");
    }
  };

  return (
    <Container className="mt-5">
      <Card>
        <CardHeader>Nouvelle Vente</CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Date de vente</Label>
                  <Input
                    type="datetime-local"
                    value={dateVente}
                    onChange={(e) => setDateVente(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label>Utilisateur (ID)</Label>
                  <Input
                    type="number"
                    placeholder="ID utilisateur"
                    value={utilisateurId}
                    onChange={(e) => setUtilisateurId(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>

            {lignes.map((ligne, index) => (
              <Row key={ligne.id}>
                <Col md="6">
                  <FormGroup>
                    <Label>Médicament</Label>
                    <Input
                      type="select"
                      value={ligne.medicamentId}
                      onChange={(e) => handleLigneChange(index, "medicamentId", e.target.value)}
                      required
                    >
                      <option value="">-- Choisir --</option>
                      {medicaments.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nom}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Quantité</Label>
                    <Input
                      type="number"
                      min="1"
                      value={ligne.quantite}
                      onChange={(e) => handleLigneChange(index, "quantite", e.target.value)}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md="2" className="d-flex align-items-end">
                  <Button
                    color="danger"
                    onClick={() => supprimerLigne(index)}
                    disabled={lignes.length === 1}
                  >
                    ✕
                  </Button>
                </Col>
              </Row>
            ))}

            <Button
              color="secondary"
              type="button"
              onClick={ajouterLigne}
              className="mb-3"
            >
              + Ajouter un médicament
            </Button>

            <div>
              <Button color="primary" type="submit">
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
