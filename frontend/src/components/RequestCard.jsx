import React from "react";

function RequestCard({ request }) {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <img className="w-full" src={"http://localhost:5173/full-logo-utad.webp"} alt={request.projectTitle} />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{request.projectTitle}</div>
                <p className="text-gray-700 text-base">{request.description}</p>
            </div>
            <div className="px-6 pt-4 pb-2">
                {/* Si esperas tener 'studentsInvolved' pero no está en tus datos, asegúrate de incluir una lógica condicional o un valor predeterminado */}
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Estado: {request.status || "No especificado"}</span>
                {/* Asegúrate de acceder a la propiedad 'name' del objeto 'degree' si existe, de lo contrario muestra un mensaje o valor predeterminado */}
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Año Academico: {request.academicCourse || "No especificado"}</span>
            </div>
        </div>
    );
}

export default RequestCard;
