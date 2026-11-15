# Pharmacy Management Dashboard

A React-based dashboard for managing pharmacy operations. This repository contains the frontend application and connects to a separate Spring Boot backend.

## Features

- Dashboard interface
- User authentication pages (login and registration)
- Medication management
- Category management
- Sales management, including adding and editing sales
- Alerts interface
- User profile page

## Technology stack

- **Frontend:** React 18, React Router
- **UI:** Reactstrap, Bootstrap, Argon Dashboard React UI template
- **HTTP client:** Axios
- **Notifications:** React Toastify
- **Charts:** Chart.js
- **Backend:** Spring Boot REST API (separate repository)
- **Database:** MySQL (managed by the backend)

## Project structure

```text
src/
├── components/
├── context/          # Authentication context
├── layouts/          # Admin and authentication layouts
├── views/
│   └── examples/     # Application pages
├── routes.js
└── index.js
```

## Getting started

### Prerequisites

- Node.js and npm
- Access to the Spring Boot backend
- MySQL configured for the backend

### Installation

```bash
git clone https://github.com/imaneaitmessaoud/Front-gestion-despharmacies.git
cd Front-gestion-despharmacies
npm install
npm start
```

The React development server starts locally. Configure the API base URL in the frontend configuration to match the backend address used in your environment.

## Backend

The backend API is maintained in a separate repository:

[Pharmacy Management Backend – Spring Boot](https://github.com/imaneaitmessaoud/gestiondespharmacies-backend)

## Notes

- This project uses Argon Dashboard React as its initial dashboard UI template. The template's original license and attribution notices are retained in the source.
- Do not commit passwords, API keys, database credentials, or local environment files.
- Update the API URL for your own local or deployment environment.

## Author

**Imane Ait Messaoud**  
[GitHub](https://github.com/imaneaitmessaoud) · [LinkedIn](https://www.linkedin.com/in/imane-aitmessaoud-756666391/)
