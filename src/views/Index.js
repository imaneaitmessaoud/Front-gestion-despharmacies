/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

*/
import { useState, useEffect } from "react";

import {  Bar } from "react-chartjs-2";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  CardHeader,
  
} from "reactstrap";
import Header from "components/Headers/Header.js";
import api from "api";

const Index = () => {
  const [totalMedicaments, setTotalMedicaments] = useState(0);
  const [totalVentes, setTotalVentes] = useState(0);
  const [totalAlertes, setTotalAlertes] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [ventesParMois, setVentesParMois] = useState([]);
  const [alertesUrgentes, setAlertesUrgentes] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [medRes, venRes, alRes, catRes] = await Promise.all([
        api.get("/medicaments"),
        api.get("/ventes"),
        api.get("/alertes"),
        api.get("/categories")
      ]);

      setTotalMedicaments(medRes.data.length);
      setTotalVentes(venRes.data.length);
      setTotalAlertes(alRes.data.length);
      setTotalCategories(catRes.data.length);

      const ventesParMoisMap = {};
      venRes.data.forEach((v) => {
        const mois = new Date(v.dateVente).toLocaleString("default", { month: "short" });
        ventesParMoisMap[mois] = (ventesParMoisMap[mois] || 0) + 1;
      });
      setVentesParMois(ventesParMoisMap);

      const alertesUrg = alRes.data.filter(
        (a) => a.typeAlerte === "EXPIRATION_PROCHE" || a.typeAlerte === "STOCK_FAIBLE"
      );
      setAlertesUrgentes(alertesUrg);
    } catch (err) {
      console.error("Erreur chargement stats dashboard", err);
    }
  };

  const chartData = {
    labels: Object.keys(ventesParMois),
    datasets: [
      {
        label: "Ventes par mois",
        data: Object.values(ventesParMois),
        backgroundColor: "#5e72e4"
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };

  return (
    <>
      <Header
        totalMedicaments={totalMedicaments}
        totalVentes={totalVentes}
        totalAlertes={totalAlertes}
        totalCategories={totalCategories}
      />
      <Container className="mt--7" fluid>
        <Row>
          <Col xl="8">
            <Card className="shadow">
              <CardHeader>
                <h5 className="mb-0">Statistiques des ventes (par mois)</h5>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col xl="4">
            <Card className="shadow">
              <CardHeader>
                <h5 className="mb-0">Alertes urgentes</h5>
              </CardHeader>
              <CardBody>
                {alertesUrgentes.length === 0 ? (
                  <p className="text-muted">Aucune alerte urgente.</p>
                ) : (
                  <ul className="mb-0">
                    {alertesUrgentes.map((a, idx) => (
                      <li key={idx}>{a.message}</li>
                    ))}
                  </ul>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
