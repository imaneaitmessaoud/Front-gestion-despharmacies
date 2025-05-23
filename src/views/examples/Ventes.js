import React, { useEffect, useState } from "react";
import {
  Card, CardHeader, CardBody, Container, Row, Col, Table, Button
} from "reactstrap";
import api from "../../api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const Ventes = () => {
  const [ventes, setVentes] = useState([]);
  const navigate = useNavigate();

  const fetchVentes = async () => {
    try {
      const res = await api.get("/ventes/dto");
      setVentes(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des ventes :", err);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des ventes", 14, 15);

    const rows = ventes.map(v => [
      new Date(v.dateVente).toLocaleString(),
      v.medicamentNom || "-",
      v.quantiteVendue,
      v.utilisateurEmail || "-"
    ]);

    autoTable(doc, {
      head: [["Date", "Médicament", "Quantité", "Utilisateur"]],
      body: rows,
      startY: 20
    });

    doc.save("ventes.pdf");
  };

  const handleSupprimer = async (id) => {
    if (window.confirm("Confirmer la suppression de cette vente ?")) {
      try {
        await api.delete(`/ventes/delete/${id}`);
        toast.success("Vente supprimée avec succès.");
        fetchVentes();
      } catch (err) {
        toast.error("Erreur lors de la suppression.");
      }
    }
  };

  useEffect(() => {
    fetchVentes();
  }, []);

  return (
    <Container style={{ marginTop: "80px", paddingTop: "20px" }} fluid>
      <Row>
        <Col>
          <Card className="shadow">
            <CardHeader className="border-0 d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Liste des ventes</h3>
              <div>
                <Button color="secondary" onClick={fetchVentes} className="me-2">⟳ Actualiser</Button>
                <Button color="danger" onClick={exportPDF}>📄 Exporter PDF</Button>
              </div>
            </CardHeader>
            <CardBody>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th>Date</th>
                    <th>Médicament</th>
                    <th>Quantité</th>
                    <th>Utilisateur</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ventes.map((v) => (
                    <tr key={v.id}>
                      <td>{new Date(v.dateVente).toLocaleString()}</td>
                      <td>{v.medicamentNom || "-"}</td>
                      <td>{v.quantiteVendue}</td>
                      <td>{v.utilisateurEmail || "-"}</td>
                      <td>
                        <Button
    color="primary"
    size="sm"
    className="me-2"
    onClick={() => navigate(`/admin/ventes/modifier/${v.id}`)}
  >
    ✏️ Modifier
  </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleSupprimer(v.id)}
                        >
                          🗑 Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {ventes.length === 0 && (
                <div className="text-center mt-4">Aucune vente trouvée.</div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Ventes;
