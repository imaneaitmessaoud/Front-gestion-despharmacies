import React, { useEffect, useRef } from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "reactstrap";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import PrivateRoute from "components/PrivateRoute.js"; 
import routes from "routes.js";
import "assets/scss/argon-dashboard-react.scss";
const Admin = (props) => {
  const mainContent = useRef(null);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  // Génère les routes avec protection
  const getRoutes = (routes) => {
    return routes.map((route, index) => {
      if (route.layout === "/admin") {
        return (
          <Route
            path={route.path}
            key={index}
            element={<PrivateRoute>{route.component}</PrivateRoute>}
          />
        );
      }
      return null;
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        path.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Tableau de bord";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/argon-react.png"),
          imgAlt: "Argon Logo",
        }}
      />
    <div className="main-content" ref={mainContent} style={{ paddingTop: "80px" }}>

        <AdminNavbar
          {...props}
          brandText={getBrandText(location.pathname)}
        />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
