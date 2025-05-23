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
  Spinner,
  Row,
  Col,
} from "reactstrap";
import api from "../../api";
import { toast } from "react-toastify";

const ModifierUtilisateur = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "PHARMACIEN",
  });

  useEffect(() => {
    const fetchUtilisateur = async () => {
      try {
        const res = await api.get(`/utilisateurs/${id}`);
        setFormData({
          nom: res.data.nom || "",
          prenom: res.data.prenom || "",
          email: res.data.email || "",
          role: res.data.role || "PHARMACIEN",
        });
      } catch (err) {
        toast.error("Erreur de chargement de l'utilisateur.");
      } finally {
        setLoading(false);
      }
    };
    fetchUtilisateur();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/utilisateurs/${id}`, formData);
      toast.success("Utilisateur modifié avec succès.");
      navigate("/admin/utilisateurs");
    } catch (err) {
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
        <CardHeader>Modifier Utilisateur</CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Nom</Label>
                  <Input
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Prénom</Label>
                  <Input
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Rôle</Label>
                  <Input
                    type="select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="PHARMACIEN">Pharmacien</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Button type="submit" color="primary">
              💾 Enregistrer
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ModifierUtilisateur;
