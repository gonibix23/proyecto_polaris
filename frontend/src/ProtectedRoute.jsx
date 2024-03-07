import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

// Voy a meter la navbar aqui, solo se renderiza cuando esta logeado
import NavBarAuth from "./components/NavBarAuth";
import NavBarNoAuth from "./components/NavBarNoAuth";

function ProtectedRoute() {
	const { loading, isAuthenticated, isEmailVerified } = useAuth();

	if (loading) {
		return <h1>Loading...</h1>;
	}

	if (!loading && !isAuthenticated) {
		console.log("Redirecting to login");
		return <Navigate to="/" replace />;
	}

	// TODO: ESTO NO FUNCIONA Y HACE QUE SE SE VEA EN BLANCO
	if (!loading && isAuthenticated && !isEmailVerified) {
		// console.log(loading, isAuthenticated, isEmailVerified);
		console.log("Redirecting to verify email");
		return <Navigate to="/verify-email" replace />;
	}

	return (
		<>
			{isAuthenticated ? <NavBarAuth /> : <NavBarNoAuth />}
			<Outlet />
		</>
	);
}

export default ProtectedRoute;
