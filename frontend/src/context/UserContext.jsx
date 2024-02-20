import { createContext, useState, useContext, useEffect } from "react";
import { getEmailRequest, getProfileRequest } from "../api/user";
import Cookies from "js-cookie";

export const UserContext = createContext();

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within an UserProvider");
	}
	return context;
};

export const UserProvider = ({ children }) => {
	const [email, setEmail] = useState(null);
	const [perfil, setProfile] = useState(null);
	const [errors, setErrors] = useState([]);

	const getEmail = async (email) => {
		try {
			if(email){
				const response = await getEmailRequest(email);
				response==200 ? setEmail(true) : setEmail(false)
			}
		} catch (error) {
			if (Array.isArray(error.response.data)) {
				setErrors(error.response.data);
			} else {
				setErrors([error.response.data]);
			}
		}
	};

	const getProfile = async () => {
		try {
			const response = await getProfileRequest();
			setProfile(response.data)
		} catch (error) {
			if (Array.isArray(error.response.data)) {
				setErrors(error.response.data);
			} else {
				setErrors([error.response.data]);
			}
		}
	};

	useEffect(() => {
		if (errors.length > 0) {
			const timer = setTimeout(() => {
				setErrors([]);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [errors]);

	return <UserContext.Provider value={{ email, getEmail, perfil, getProfile, errors }}>{children}</UserContext.Provider>;
};
