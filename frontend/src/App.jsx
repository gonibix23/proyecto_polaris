import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AreasProvider } from "./context/AreasContext";
import { UserProvider } from "./context/UserContext";

import NavBar from "./components/Navbar";

import LandingPageLogin from "./pages/LandingPageLogin";
import LandingPageRegister from "./pages/LandingPageRegister";
import HomePageRegisterDetails from "./pages/LandingPageRegisterDetails";
import ForgotPassword from "./pages/ForgotPassword";

import HomePage from "./pages/HomePage";

import ProfilePage from "./pages/ProfilePage";
import ProjectsFormPage from "./pages/ProjectsFormPage";
import ProjectsHomePage from "./pages/ProjectsHomePage";
import ProjectsDetailPage from "./pages/ProjectsDetailPage";

import AdminDashboardPage from "./pages/AdminDashboardPage";

import ProtectedRoute from "./ProtectedRoute";

function App() {
	return (
		<AuthProvider>
			{/* Una vez acabado el testing areas provider debe moverse dentro del protectedroute */}
			<AreasProvider>
				<UserProvider>
					<Router>
						<main>
							<Routes>
								{/* Home page sin logearse, sale el formulario de login */}
								<Route path="/" element={<LandingPageLogin />} />
								{/* Pagina de recuperar contraseña */}
								<Route path="/forgot-password" element={<ForgotPassword />} />
								{/* Pagina de registro, solo pide dos datos inciales */}
								<Route path="/register" element={<LandingPageRegister />} />
								{/* Pagina de registro secundaria, termina el registro */}
								<Route path="/register/details" element={<HomePageRegisterDetails />} />
								{/* Dejo la pagina de añadir proyectos fuera de la ruta protegida para poder probarla */}
								<Route path="/projects/new" element={<ProjectsFormPage />} />
								<Route element={<ProtectedRoute />} />
								{/* Pagina home pero que salen proyectos y noticias una vez estas logeado */}
								<Route path="/home" element={<HomePage />} />
								{/* Pagina perfil donde se veran las peticiones */}
								<Route path="/profile" element={<ProfilePage />} />
								{/* Pagina de proyectos para buscarlos */}
								<Route path="/projects" element={<ProjectsHomePage />} />
								{/* Pagina para el formulario de proyectos nuevos */}
								<Route path="/projects/new" element={<ProjectsFormPage />} />
								{/* Pagina para ver un proyecto en detalle */}
								<Route path="/projects/:id" element={<ProjectsDetailPage />} />
								{/* Pagina para editar un proyecto, es el mismo formulario pero populating */}
								<Route path="/projects/:id/edit" element={<ProjectsFormPage />} />
								{/* Posible admin dashboard, puede que OoS (MOsCoW) */}
								<Route path="/admin" element={<AdminDashboardPage />} />
								<Route />
							</Routes>
						</main>
					</Router>
				</UserProvider>
			</AreasProvider>
		</AuthProvider>
	);
}

export default App;
