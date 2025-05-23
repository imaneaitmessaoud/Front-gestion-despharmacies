import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Col
} from "reactstrap";
import api from "../../api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    role: "PHARMACIEN",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Créer l'utilisateur
      await api.post("/utilisateurs", formData);

      // 2. Redirection simple vers /auth/login
      navigate("/auth/login", {
        state: { successMessage: "Compte créé avec succès. Connectez-vous." },
      });
    } catch (error) {
      if (
        error.response &&
        error.response.status === 500 &&
        error.response.data?.message?.includes("email")
      ) {
        alert("Cet email est déjà utilisé.");
      } else {
        alert("Erreur lors de l'inscription.");
      }
    }
  };

  return (
    <Col lg="5" md="7">
      <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5">
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Input
                placeholder="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                placeholder="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                placeholder="Mot de passe"
                type="password"
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="select"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="PHARMACIEN">Pharmacien</option>
                <option value="ADMIN">Admin</option>
              </Input>
            </FormGroup>
            <Button color="primary" type="submit">
              S'inscrire
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Col>
  );
};

export default Register;
