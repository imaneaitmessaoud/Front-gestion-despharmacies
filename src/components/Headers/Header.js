import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [stats, setStats] = useState({ medicaments: 0, ventes: 0, alertes: 0, categories: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [medicaments, ventes, alertes, categories] = await Promise.all([
          api.get("/medicaments"),
          api.get("/ventes"),
          api.get("/alertes"),
          api.get("/categories")
        ]);
        setStats({
          medicaments: medicaments.data.length,
          ventes: ventes.data.length,
          alertes: alertes.data.length,
          categories: categories.data.length
        });
      } catch (err) {
        console.error("Erreur chargement statistiques", err);
      }
    };
    fetchCounts();
  }, []);

  const cards = [
    {
      label: "Médicaments",
      value: stats.medicaments,
      icon: "fas fa-pills",
      bg: "bg-danger",
      route: "/admin/medicaments"
    },
    {
      label: "Ventes",
      value: stats.ventes,
      icon: "fas fa-shopping-cart",
      bg: "bg-warning",
      route: "/admin/ventes"
    },
    {
      label: "Alertes",
      value: stats.alertes,
      icon: "fas fa-bell",
      bg: "bg-yellow",
      route: "/admin/alertes"
    },
    {
      label: "Catégories",
      value: stats.categories,
      icon: "fas fa-tags",
      bg: "bg-info",
      route: "/admin/categories",
    }
  ];

  return (
    <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      <Container fluid>
        <div className="header-body">
          <Row>
            {cards.map((card, idx) => (
              <Col key={idx} lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0" onClick={() => navigate(card.route)} style={{ cursor: "pointer" }}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          {card.label}
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{card.value}</span>
                      </div>
                      <Col className="col-auto">
                        <div className={`icon icon-shape ${card.bg} text-white rounded-circle shadow`}>
                          <i className={card.icon} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Header;
