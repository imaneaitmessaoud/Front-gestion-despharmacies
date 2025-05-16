import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Table,
  Button,
  Badge,
  Spinner
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import api from "../../api";

const Alertes = () => {
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAlertes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/alertes");
      setAlertes(res.data);
      toast.success("Alertes mises à jour !");
    } catch (err) {
      console.error("Erreur lors du chargement des alertes :", err);
      toast.error("Erreur lors du chargement des alertes !");
    } finally {
      setLoading(false);
    }
  };

  const marquerCommeLue = async (id) => {
    try {
      await api.put(`/alertes/${id}/lue`);
      fetchAlertes();
      toast.info("Alerte marquée comme lue.");     
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  const marquerToutCommeLue = async () => {
    try {
      await api.put("/alertes/toutes-lues");
      fetchAlertes();
      toast.success("Toutes les alertes ont été marquées comme lues.");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour globale.");
    }
  };

  const supprimerAlertesLues = async () => {
    try {
      await api.delete("/alertes/lues");
      fetchAlertes();
      toast.success("Alertes lues supprimées !");
    } catch (err) {
      toast.error("Erreur lors de la suppression.");
    }
  };

  useEffect(() => {
    fetchAlertes();
  }, []);

  return (
    <Container style={{ marginTop: "80px", paddingTop: "20px" }} fluid>
      <ToastContainer position="top-right" autoClose={3000} />
      <Row>
        <Col>
          <Card className="shadow">
            <CardHeader className="border-0 d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Alertes Médicaments</h3>
              <div className="d-flex gap-2">
                <Button color="secondary" onClick={fetchAlertes} disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "⟳ Actualiser"}
                </Button>
                <Button color="success" onClick={marquerToutCommeLue} disabled={loading}>
                  ✅ Tout marquer comme lues
                </Button>
                <Button color="danger" onClick={supprimerAlertesLues} disabled={loading}>
                  🗑 Supprimer les lues
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th>Type</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Médicament</th>
                    <th>Statut</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {alertes.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <Badge color={a.type === "STOCK_FAIBLE" ? "warning" : "danger"}>
                          {a.type}
                        </Badge>
                      </td>
                      <td>{a.message}</td>
                      <td>{new Date(a.dateCreation).toLocaleString()}</td>
                      <td>{a.medicament?.nom || "-"}</td>
                      <td>
                        <Badge color={a.estLue ? "success" : "info"}>
                          {a.estLue ? "Lue" : "Non lue"}
                        </Badge>
                      </td>
                      <td>
                        {!a.estLue && (
                          <Button size="sm" color="primary" onClick={() => marquerCommeLue(a.id)}>
                            Marquer comme lue
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {!loading && alertes.length === 0 && (
                <div className="text-center mt-4">Aucune alerte trouvée.</div>
              )}
              {loading && (
                <div className="text-center mt-4">
                  <Spinner /> Chargement...
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Alertes;
