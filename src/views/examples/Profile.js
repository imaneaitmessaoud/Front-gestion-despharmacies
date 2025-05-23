import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Badge
} from "reactstrap";
import api from "../../api";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        const email = res.data.email;
        const userRes = await api.get(`/utilisateurs`);
        const utilisateur = userRes.data.find(u => u.email === email);
        setUser(utilisateur);
        setFormData({
          nom: utilisateur.nom,
          prenom: utilisateur.prenom,
          email: utilisateur.email,
          motDePasse: "",
          confirmPassword: ""
        });
      } catch (err) {
        toast.error("Erreur lors du chargement du profil");
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Étape 1 : mettre à jour infos générales
    await api.put(`/utilisateurs/${user.id}`, {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email
    });

    // Étape 2 : changer mot de passe uniquement si présent
    if (formData.motDePasse) {
      if (formData.motDePasse !== formData.confirmPassword) {
        return toast.error("Les mots de passe ne correspondent pas");
      }
      await api.put(`/utilisateurs/password/${user.id}`, {
        newPassword: formData.motDePasse
      });
    }

    toast.success("Profil mis à jour !");
    setEditMode(false);
    setFormData({ ...formData, motDePasse: "", confirmPassword: "" });
  } catch (err) {
    toast.error("Erreur lors de la mise à jour");
  }
};

  return (
    <Container className="mt-5">
      <Row>
        <Col md={4}>
          <Card className="text-center shadow">
            <CardBody>
              <img
                src={require("../../assets/img/theme/team-4-800x800.jpg")}
                alt="avatar"
                className="rounded-circle img-fluid"
                style={{ width: "120px", height: "120px" }}
              />
              <h3 className="mt-3">{user.prenom} {user.nom}</h3>
              <p>{user.email}</p>
              <Badge color={user.role === "ADMIN" ? "success" : "info"}>
                {user.role}
              </Badge>
              <div className="mt-3">
                <Button color="primary" size="sm" onClick={() => setEditMode(!editMode)}>
                  {editMode ? "Annuler" : "Modifier mes infos"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md={8}>
          {editMode && (
            <Card className="shadow">
              <CardHeader>Modifier mes informations</CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Prénom</Label>
                        <Input name="prenom" value={formData.prenom} onChange={handleChange} required />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Nom</Label>
                        <Input name="nom" value={formData.nom} onChange={handleChange} required />
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <Label>Email</Label>
                    <Input type="email" name="email" value={formData.email} disabled />
                  </FormGroup>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Nouveau mot de passe</Label>
                        <Input type="password" name="motDePasse" onChange={handleChange} />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Confirmation</Label>
                        <Input type="password" name="confirmPassword" onChange={handleChange} />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button color="success" type="submit">Enregistrer</Button>
                </Form>
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
