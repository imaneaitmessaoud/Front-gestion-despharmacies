import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Table,
  Spinner,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { toast } from "react-toastify";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const ListeUtilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchUtilisateurs = async () => {
    try {
      const res = await api.get("/utilisateurs");
      setUtilisateurs(res.data);
    } catch (err) {
      console.error("Erreur chargement utilisateurs :", err);
      toast.error("Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  };

  const handleSupprimer = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      try {
        await api.delete(`/utilisateurs/${id}`);
        toast.success("Utilisateur supprimé avec succès");
        fetchUtilisateurs();
      } catch (err) {
        toast.error("Erreur lors de la suppression.");
      }
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const utilisateursFiltres = utilisateurs.filter((u) => {
    const fullName = `${u.nom || ""} ${u.prenom || ""}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Container className="mt-5" fluid>
      <Row>
        <Col>
          <Card className="shadow">
           <CardHeader className="border-0">
  <Row className="align-items-center">
    {/* Colonne de la barre de recherche */}
    <Col xs="12" md="6" className="mb-2 mb-md-0">
      <InputGroup style={{ maxWidth: "100%", width: "400px" }}>
        <InputGroupText>
          <i className="fas fa-search" />
        </InputGroupText>
        <Input
          placeholder="Rechercher par nom ou email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
    </Col>

    {/* Colonne du bouton actualiser */}
    <Col xs="12" md="6" className="text-md-end">
      <Button color="secondary" onClick={fetchUtilisateurs}>
        <i className="fas fa-sync-alt me-1" /> Actualiser
      </Button>
    </Col>
  </Row>
</CardHeader>

            <CardBody>
              {loading ? (
                <div className="text-center">
                  <Spinner />
                </div>
              ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Email</th>
                      <th>Rôle</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {utilisateursFiltres.map((u) => (
                      <tr key={u.id}>
                        <td>{u.nom || "-"}</td>
                        <td>{u.prenom || "-"}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td className="d-flex gap-2">
                          <Button
    color="primary"
    size="sm"
    className="me-2"
    onClick={() => navigate(`/admin/utilisateurs/modifier/${u.id}`)}
  >
    ✏ Modifier
  </Button>
  <Button
    color="danger"
    size="sm"
    onClick={() => handleSupprimer(u.id)}
  >
    🗑 Supprimer
  </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              {utilisateursFiltres.length === 0 && !loading && (
                <div className="text-center mt-4">Aucun utilisateur trouvé.</div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ListeUtilisateurs;
