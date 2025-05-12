// src/views/examples/Medicaments.js
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Table,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import api from '../../api';

const Medicaments = () => {
  const [medicaments, setMedicaments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nom: '',
    code: '',
    quantite: '',
    prix: '',
    dateExpiration: '',
    seuilAlerte: '',
    categorieId: ''
  });

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      setFormData({ id: null, nom: '', code: '', quantite: '', prix: '', dateExpiration: '', seuilAlerte: '', categorieId: '' });
    }
  };

  const loadMedicaments = () => {
    api.get("/medicaments")
      .then(res => setMedicaments(res.data))
      .catch(err => console.error("Erreur chargement médicaments:", err));
  };

  const loadCategories = () => {
    api.get("/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Erreur chargement catégories:", err));
  };

  useEffect(() => {
    loadMedicaments();
    loadCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/medicaments/${formData.id}`, formData);
      } else {
        await api.post("/medicaments", formData);
      }
      toggleModal();
      loadMedicaments();
    } catch (error) {
      alert("Erreur: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (med) => {
    setFormData({
      id: med.id,
      nom: med.nom,
      code: med.code,
      quantite: med.quantite,
      prix: med.prix,
      dateExpiration: med.dateExpiration,
      seuilAlerte: med.seuilAlerte,
      categorieId: med.categorie?.id || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      console.log("TOKEN ENVOYÉ POUR DELETE:", localStorage.getItem("accessToken"));
      await api.delete(`/medicaments/${id}`);
      loadMedicaments();
    } catch (error) {
      alert("Erreur de suppression: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container style={{ marginTop: "80px", paddingTop: "20px" }} fluid>
      <Row className="align-items-center mb-4 mt-3">
        <Col>
          <h2 className="text-dark font-weight-bold">Liste des Médicaments</h2>
        </Col>
        
      </Row>
      <Row>
        <Col>
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Tableau des Médicaments</h3>
               <Col className="text-right">
    <Button color="primary" onClick={toggleModal}>
      + Ajouter Médicament
    </Button>
  </Col>
            </CardHeader>
            <CardBody>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th>Nom</th>
                    <th>Code</th>
                    <th>Quantité</th>
                    <th>Prix (€)</th>
                    <th>Date d'expiration</th>
                    <th>Catégorie</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicaments.map((med) => (
                    <tr key={med.id}>
                      <td>{med.nom}</td>
                      <td>{med.code}</td>
                      <td>{med.quantite}</td>
                      <td>{med.prix}</td>
                      <td>{med.dateExpiration}</td>
                      <td>{med.categorie?.nom || "-"}</td>
                      <td>
                       
                       
                        <Button size="sm" color="warning" onClick={() => handleEdit(med)}>Modifier</Button>{" "}
                        <Button size="sm" color="danger" onClick={() => handleDelete(med.id)}>Supprimer</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {medicaments.length === 0 && (
                <div className="text-center mt-4">Aucun médicament trouvé.</div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modal Formulaire */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Formulaire Médicament</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Nom</Label>
              <Input name="nom" value={formData.nom} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Code</Label>
              <Input name="code" value={formData.code} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Quantité</Label>
              <Input type="number" name="quantite" value={formData.quantite} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Prix (€)</Label>
              <Input type="number" name="prix" value={formData.prix} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Date d'expiration</Label>
              <Input type="date" name="dateExpiration" value={formData.dateExpiration} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Seuil Alerte</Label>
              <Input type="number" name="seuilAlerte" value={formData.seuilAlerte} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Catégorie</Label>
              <Input type="select" name="categorieId" value={formData.categorieId} onChange={handleChange} required>
                <option value="">-- Choisir une catégorie --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nom}</option>
                ))}
              </Input>
            </FormGroup>
            <Button color="primary" type="submit">{formData.id ? "Enregistrer" : "Ajouter"}</Button>
          </Form>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default Medicaments;
