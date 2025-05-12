// src/views/examples/Categories.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Button,
  Table,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import api from "../../api";
import { toast } from "react-toastify";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, nom: "", description: "" });

  const fetchCategories = async (nom = "") => {
    try {
      const res = await api.get("/categories/search", { params: { nom } });
      setCategories(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des catégories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCategories(search);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      setFormData({ id: null, nom: "", description: "" });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/categories/${formData.id}`, formData);
      } else {
        await api.post("/categories", formData);
      }
      toggleModal();
      fetchCategories();
    } catch (error) {
      toast.error("Erreur d'enregistrement.");
    }
  };

  const handleEdit = (cat) => {
    setFormData({ id: cat.id, nom: cat.nom, description: cat.description });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      toast.error("Erreur de suppression");
    }
  };

  return (
    
    <Container style={{ marginTop: "80px", paddingTop: "20px" }} fluid>
      <Row className="mb-3">
        <Col md="6">
          <Input
            type="text"
            placeholder="🔍 Rechercher par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col className="text-right">
          <Button color="primary" onClick={toggleModal}>
            + Ajouter Catégorie
          </Button>
        </Col>
      </Row>
      <Card className="shadow">
        <CardHeader>
          <h3 className="mb-0">Liste des catégories</h3>
        </CardHeader>
        <CardBody>
          <Table responsive className="align-items-center table-flush">
            <thead className="thead-light">
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.nom}</td>
                  <td>{cat.description}</td>
                  <td>
                    <Button size="sm" color="warning" onClick={() => handleEdit(cat)}>Modifier</Button>{" "}
                    <Button size="sm" color="danger" onClick={() => handleDelete(cat.id)}>Supprimer</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {categories.length === 0 && <div className="text-center mt-4">Aucune catégorie trouvée.</div>}
        </CardBody>
      </Card>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Formulaire Catégorie</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Nom</Label>
              <Input name="nom" value={formData.nom} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input name="description" value={formData.description} onChange={handleChange} required />
            </FormGroup>
            <Button type="submit" color="primary">
              {formData.id ? "Enregistrer" : "Ajouter"}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default Categories;
