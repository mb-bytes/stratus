import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from './contexts/AuthContext.jsx'
import ProjectRoutes from './Routes.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { sileo, Toaster } from "sileo";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeroUIProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-center" />
          <ProjectRoutes />
        </Router>
      </AuthProvider>
    </HeroUIProvider>
  </StrictMode>,
)
