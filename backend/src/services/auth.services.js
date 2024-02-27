import prisma from "../config/prisma.client.js";
import { createResetPasswordToken } from "../libs/jwt.js";

export const handleForgotPassword = async (req, res, email) => {
	try {
		// Viene del middleware del token
		const { email } = req.body;
		console.log(email);

		const userFound = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		// Ya hemos comprobado que el usuario existe antes
		// Creamos un token de reset
		// TODO: Le metemos el email solamente
		const resetToken = await createResetPasswordToken({ email: req.body.email });

		// Le metemos el token al usuario
		const updatedUser = await prisma.user.update({
			where: {
				email,
			},
			data: {
				resetPasswordToken: resetToken,
			},
		});

		if (!updatedUser) return res.status(500).json({ message: "Error updating user." });

		// Send email with reset link to user
		console.log(`http://localhost:5173/reset-password?resetToken=${resetToken}`);
		// const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
		return true;
	} catch (error) {
		console.log(error);
		// return res.status(500).json({ message: error.message });
		return false;
	}
};
