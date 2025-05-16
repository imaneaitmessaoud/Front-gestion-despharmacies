import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Spinner
} from "reactstrap";
import api from "../../api";
import { toast } from "react-toastify";

const ModifierVente = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dateVente, setDateVente] = useState("");
  const [utilisateurId, setUtilisateurId] = useState("");
  const [lignes, setLignes] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/ventes/${id}`);
        const vente = res.data;
        setDateVente(vente.dateVente?.slice(0, 16));
        setUtilisateurId(vente.utilisateur?.id || "");

        const lignesConverties = vente.lignesDeVente?.map((l) => ({
          medicamentId: l.medicament.id,
          quantite: l.quantite,
        })) || [];

        setLignes(lignesConverties);

        const utilisateursRes = await api.get("/utilisateurs");
        console.log("Utilisateurs:", utilisateursRes.data);
        setUtilisateurs(utilisateursRes.data);
      } catch (error) {
        console.error("Erreur de chargement :", error);
        toast.error("Erreur lors du chargement de la vente.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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

    try {
      const dto = {
        dateVente,
        utilisateurId: utilisateurId || null,
        lignes: lignes.map((l) => ({
          medicamentId: parseInt(l.medicamentId),
          quantite: parseInt(l.quantite)
        }))
      };

      await api.put(`/ventes/${id}`, dto);
      toast.success("Vente modifiée avec succès !");
      navigate("/admin/ventes");
    } catch (err) {
      console.error("Erreur modification :", err);
      toast.error("Erreur lors de la modification.");
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
        <CardHeader>Modifier Vente</CardHeader>
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

            {lignes.map((ligne, index) => (
              <Row key={index}>
                <Col md={6}>
                  <FormGroup>
                    <Label>ID Médicament</Label>
                    <Input
                      type="number"
                      value={ligne.medicamentId}
                      onChange={(e) =>
                        handleLigneChange(index, "medicamentId", e.target.value)
                      }
                      required
                    />
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
              <Button type="submit" color="primary">
                💾 Sauvegarder
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ModifierVente;
