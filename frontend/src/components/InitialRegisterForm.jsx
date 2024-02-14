import { useState } from 'react';
import { useForm } from "react-hook-form";
// eslint-disable-next-line no-unused-vars
import { Link, useNavigate } from "react-router-dom";

const InitialRegisterForm = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    // eslint-disable-next-line no-unused-vars
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
  
    const onSubmit = (data) => {
        // Actualiza el estado del email
        setEmail(data.email);
        
        navigate(`/registerSecond`, { state: { email: data.email } });
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4 text-black">
                    <input
                        className="w-5/12 p-4 rounded-2xl"
                        type="text" {
                        ...register("username", {
                            required: true,
                            minLength: 3,
                            maxLength: 20
                        })}
                        placeholder="Nombre"
                    />
                    {
                        errors.username && (
                            <p className="mb-2 text-white">Hace falta un nombre de usuario</p>
                        )
                    }
                </div>
                <div className="mb-4 text-black">
                    <input 
                        className="w-5/12 p-4 rounded-2xl"
                        type="email" {
                        ...register("email", {
                            required: true,
                            pattern: /^\S+@\S+$/i
                        })}
                        placeholder="Correo de la Utad"
                    />
                    {
                        errors.email && (
                            <p className="mb-2 text-white">Hace falta un email</p>
                        )
                    }
                </div>
                <div className="mb-8">
                    <p className="text-xs">Creando una cuenta aceptas los Términos de Uso y la Política de Privacidad.</p>
                </div>
                <div className="mb-4">
                    <button
                        type="submit"
                        className="w-5/12 p-4 rounded-xl bg-[#333333] text-white"
                        >
                        Registrarse 2
                    </button>
                </div>
            </form>

        </div>
    )
}

export default InitialRegisterForm;