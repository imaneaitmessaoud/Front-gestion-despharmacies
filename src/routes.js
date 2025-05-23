/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Medicaments from "views/examples/Medicaments.js";
import Alertes from "views/examples/Alertes.js";
import Ventes from "views/examples/Ventes.js";
import AjouterVente from "views/examples/AjouterVente.js"; 
import ModifierVente from "views/examples/ModifierVente.js";
import Categories from "views/examples/Categories.js"; 
import ListeUtilisateurs from "views/examples/ListeUtilisateurs.js";
import ModifierUtilisateur from "views/examples/ModifierUtilisateur.js"; 


var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/medicaments",
    name: "Médicaments",
    icon: "ni ni-caps-small text-blue",
    component: <Medicaments />,
    layout: "/admin",
  },
  {
    path: "/alertes",
    name: "Alertes",
    icon: "ni ni-bell-55 text-orange",
    component: <Alertes />,
    layout: "/admin",
  },
  {
    path: "/ventes",
    name: "Ventes",
    icon: "ni ni-cart text-green",
    component: <Ventes />,
    layout: "/admin",
  },
  {
    path: "/ventes/ajouter",
    name: "Ajouter Vente",
    icon: "ni ni-fat-add text-info", // tu peux changer l’icône
    component: <AjouterVente />,
    layout: "/admin",
  },
  {
  path: "/ventes/modifier/:id", //  utiliser :id 
  name: "Modifier Vente",
  icon: "ni ni-settings",
  component: <ModifierVente />,
  layout: "/admin"
},
{
  path: "/categories",
  name: "Catégories",
  icon: "ni ni-tag text-info", // ou tout autre icône FontAwesome/Nucleo
  component: <Categories />,
  layout: "/admin"
},

{
  path: "/login",
  name: "Login",
  icon: "ni ni-key-25 text-info",
  component: <Login />,
  layout: "/auth",
},
{
  path: "/register",
  name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
  {
  path: "/utilisateurs",
  name: "Utilisateurs",
  icon: "ni ni-single-02 text-info",
  component: <ListeUtilisateurs />,
  layout: "/admin", 
},

{
  path: "/utilisateurs/modifier/:id",
  name: "Modifier Utilisateur",
  icon: "fa fa-user-edit",
  component: <ModifierUtilisateur />,
  layout: "/admin",
}
];
export default routes;
