import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Col,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Alert } from "reactstrap";
const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // 🔑 Pour mettre à jour le contexte utilisateur
const location = useLocation();
const successMessage = location.state?.successMessage;

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      const { accessToken, refreshToken } = response.data;

      localStorage.clear();
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("email", credentials.email);
      localStorage.setItem("id", response.data.id);

      //  Mise à jour du contexte utilisateur
      setUser({ email: credentials.email, token: accessToken });

      alert("Connexion réussie !");
      navigate("/admin/index");
    } catch (error) {
      alert("Échec de connexion. Vérifiez vos identifiants.");
      console.error("Erreur de login :", error);
    }
  };

  return (
    <Col lg="5" md="7">
      <Card className="bg-secondary shadow border-0">
        <CardHeader className="bg-transparent pb-5">
          <div className="text-muted text-center mt-2 mb-3">
            <small>Connectez-vous avec vos identifiants</small>
          </div>
        </CardHeader>
        <CardBody className="px-lg-5 py-lg-5">
          <Form role="form" onSubmit={handleLogin}>
            {successMessage && (
  <Alert color="success" className="text-center">
    {successMessage}
  </Alert>
)}

            <FormGroup className="mb-3">
              <Input
                placeholder="Email"
                type="email"
                name="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                placeholder="Mot de passe"
                type="password"
                name="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
              />
            </FormGroup>
            <div className="custom-control custom-control-alternative custom-checkbox">
              <input
                className="custom-control-input"
                id="customCheckLogin"
                type="checkbox"
              />
              <label
                className="custom-control-label"
                htmlFor="customCheckLogin"
              >
                <span className="text-muted">Se souvenir de moi</span>
              </label>
            </div>
            <div className="text-center">
              <Button className="my-4" color="primary" type="submit">
                Se connecter
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
      <div className="mt-3 d-flex justify-content-between">
        <Link className="text-light" to="/auth/forgot-password">
          <small>Mot de passe oublié ?</small>
        </Link>
        <Link className="text-light" to="/auth/register">
          <small>Créer un compte</small>
        </Link>
      </div>
    </Col>
  );
};

export default Login;
