import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// eslint-disable-next-line no-unused-vars
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Popup from "../components/Popup";
import SecondaryRegisterForm from "../components/SecondaryRegisterForm";


const InitialRegisterForm = ({ onSuccess }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		setError,
		clearErrors,
	} = useForm();

	const { existEmail, getExistEmail, errors: userErrors } = useAuth();
	const [emailChecked, setemailChecked] = useState(false);
	const [openPopup, setOpenPopup] = useState(false);
	const [InitialRegisterData, setInitialRegisterData] = useState(false);
	
	const handleClosePopup = () => {
		setOpenPopup(false);
	};

	const onSubmit = async (data) => {
		try {
			console.log(data.email)
			const emailExists = await getExistEmail(data);
			// console.log(emailExists);
			if (emailExists) {
				setError("email", { message: "El correo ya está en uso." });
				return;
			}
			setInitialRegisterData(data)
			setOpenPopup(true);
			setemailChecked(true)
		} catch {
			console.log("Error al verificar el correo.");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div>
				{userErrors.map((error, index) => (
					<div className="mt-4 text-red-500 font-semibold" key={index}>
						{error.message}
					</div>
				))}
			</div>
			<div className="mb-4 mt-8 text-black">
				<input
					className="w-full md:w-9/12 p-3 rounded-2xl h-12"
					type="text"
					{...register("fullName", {
						required: true,
						minLength: 10,
						maxLength: 50,
					})}
					placeholder="*Nombre completo"
				/>
				{errors.username && <p className="mb-2 mt-4 text-red-500 font-semibold">Hace falta un nombre</p>}
			</div>
			<div className="mb-4 text-black">
				<input
					className="w-full md:w-9/12 p-3 rounded-2xl h-12"
					type="email"
					{...register("email", {
						required: true,
						pattern: {
							value: /^[a-zA-Z0-9._%+-]+@(u-tad\.com|live\.u-tad\.com)$/i,
							message: "El correo tiene que ser de la U-Tad",
						},
						validated: () => !emailChecked,
					})}
					placeholder="*Correo de la U-Tad"
				/>
				{errors.email && <p className="mb-2 mt-4 text-red-500 font-semibold">{errors.email.message}</p>}
			</div>
			<div className="mb-8">
				<Link to="https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran" className="underline">
					<p className="text-xs">Creando una cuenta aceptas los Términos de Uso y la Política de Privacidad.</p>
				</Link>
			</div>
			<div className="mb-4">
				<button type="submit" onClick={onSubmit} className="rounded-md bg-black/20 px-4 py-24 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
					Open SecondaryRegisterForm
				</button>
				<Popup title="CREAR TU USUARIO" openPopup={openPopup} closePopup={handleClosePopup}>
					<SecondaryRegisterForm closePopup={handleClosePopup} initialRegistrationData={InitialRegisterData}/>
				</Popup>
			</div>
		</form>
	);
};

export default InitialRegisterForm;
