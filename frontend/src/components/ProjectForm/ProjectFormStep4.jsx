import React from "react";
import { useEffect, useState } from "react";
import { useAreas } from "../../context/AreasContext.jsx";
import { pdfjs } from "react-pdf";
import { PdfComp } from "../Helpers/PdfComp.jsx";
import Stepper from "../Helpers/Stepper.jsx";
import { useProjects } from "../../context/ProjectsContext.jsx";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).toString();
import { Link } from 'react-router-dom';

const ProjectFormStep4 = ({ returnStep, currentStep, editing, projectData, closePopup }) => {

	// No se si pasandole asi el estado si cambia se renderiza de nuevo
	const [isComplete, setIsComplete] = React.useState(false);
    const { project, createProject } = useProjects();
	const { degrees, getDegrees, awards, getAwards, subjects, getSubjects } = useAreas();
	const [loading, setLoading] = useState(true);
	const [formDataObj, setFormDataObj] = useState({});
	const [degree, setDegree] = useState({});
	const [award, setAward] = useState({});
	const [subject, setSubject] = useState({});

    const prepareFormData = (projectData) => {
        const formData = new FormData();

        if (projectData.step3.personalProject === true) {
            delete projectData.step3.subject;
        }

        // Añadir thumbnail con nombre personalizado
        if (projectData.step3.thumbnail && projectData.step3.thumbnail.length > 0) {
            formData.append('files', projectData.step3.thumbnail[0], 'thumbnail.' + projectData.step3.thumbnail[0].name.split('.').pop());
        }
        // Añadir summary con nombre personalizado
        if (projectData.step3.summary && projectData.step3.summary.length > 0) {
            formData.append('files', projectData.step3.summary[0], 'summary.'+projectData.step3.summary[0].name.split('.').pop());
        }

        if (Array.isArray(projectData.step3.projectFiles)) {
            projectData.step3.projectFiles.forEach((file) => {
                formData.append('files', file);
            });
        } else if (projectData.step3.projectFiles) {
            // Si solo hay un archivo, no necesitas iterar sobre él
            formData.append('files', projectData.step3.projectFiles);
        }

        delete projectData.step3.thumbnail;
        delete projectData.step3.summary;
        delete projectData.step3.projectFiles;

        const flattenedData = Object.values(projectData).reduce((acc, step) => ({ ...acc, ...step }), {});
    
        for (const key in flattenedData) {
            if (Object.hasOwnProperty.call(flattenedData, key)) {
                const value = flattenedData[key];
                if (value !== undefined) {
                    if (Array.isArray(value)) {
                        value.forEach((item) => {
                            if (typeof item === 'object') {
                                formData.append(key, JSON.stringify(item));
                            } else {
                                formData.append(key, item);
                            }
                        });
                    } else if (typeof value === 'object') {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                }
            }
        }

        return formData;
    };

	const handleSubmit = async () => {
		const formData = prepareFormData(projectData);

		try {
			createProject(formData);

			setTimeout(() => closePopup(), 1)
		} catch (error) {
			console.error('Error al enviar el formulario', error);
			// Manejar el feedback de error al usuario
		}
	};

	useEffect(() => {
		const formDataO = {};
		for (let [name, value] of prepareFormData(projectData)) {
			formDataO[name] = value;
		}
		setFormDataObj(formDataO)
		Promise.all([ getDegrees(), getAwards(), getSubjects()]).then(() => setLoading(false));
	}, []);

	useEffect(() => {
		const selectedAwards = awards.find(c => c.id === formDataObj.awards);
		console.log(formDataObj,formDataObj.awards)
		if (selectedAwards) {
			setAward(selectedAwards);
		}
		const selectedDegree = degrees.find(r => r.id === formDataObj.degree);
		if (selectedDegree) {
			setDegree(selectedDegree);
		}
		const selectedSubject = subjects.find(d => d.id === formDataObj.subject);
		if (selectedSubject) {
			setDegree(selectedSubject);
		}
	}, [loading]);

	return (
		<>
			<Stepper currentStep={currentStep} isComplete={isComplete} />
			<div>Previsualización</div>

			<div className="container mx-auto p-0">
				<div className="container p-0 relative">
					<img src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800" alt={projectData.step1.title} className="w-full rounded-2xl" style={{ filter: 'brightness(0.9)' }} />
					<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
					<h1 className="text-3xl font-bold absolute p-6 bottom-0 left-0 text-white">{projectData.step1.title}</h1>
				</div>

				<div className="grid grid-cols-1 gap-4 pt-6 pl-6 pr-6">

					{/* <div className="grid grid-cols-4">
						<div className="relative flex items-center col-span-2">
							<div className="rounded bg-blue-200 p-2 flex items-center justify-center">
								<p className="text-sm font-bold p-1">{project.degree.name}</p>
							</div>
							<div className="h-10 flex items-center justify-center">
								<div className="w-1 h-10 bg-blue-500 mx-4"></div>
							</div>
						</div>

						<div className="relative flex items-center col-span-1">
							<p className="text-sm font-bold text-cente w-full">{project.academicCourse}</p>
						</div>

						<div className="relative flex items-center col-span-1">
							<div className="h-10 justify-center">
								<div className="w-1 h-10 bg-blue-500 mx-4"></div>
							</div>
							<div className="flex ml-4">
								<p className="text-sm font-bold">
									{project.personalProject ? "Proyecto personal" : project.subject.name}
								</p>
							</div>
						</div>
					</div> */}


					<div className="relative flex items-center">
						<div className="rounded bg-blue-200 p-2 flex items-center justify-center">
							<p className="text-sm font-bold p-1">{degree.name}</p>
						</div>

						<div className="h-10 flex items-center justify-center">
							<div className="w-1 h-10 bg-blue-500 mx-4"></div>
						</div>
						

						<p className="text-sm font-bold">{projectData.step3.academicCourse}</p>

						<div className="h-10 justify-center">
							<div className="w-1 h-10 bg-blue-500 mx-4"></div>
						</div>

						<div className="flex ml-4">
							<p className="text-sm font-bold">
								{projectData.step3.personalProject ? "Proyecto personal" : projectData.step3.subject.name}
							</p>
						</div>
					</div>
				</div>

				<div className="text-black p-5" style={{ zIndex: '1' }}>
					<p className="text-xl font-bold mb-2">Alumnos implicados</p>
					{projectData.step2.impliedStudentsIDs ? (
						<div>
						{projectData.step2.impliedStudentsIDs.map(studentID => (
							<div key={studentID}>
								<Link
									to="/profile"
									state={{ email: studentID }}
								>
									{studentID}
								</Link><a>, </a>
							</div>
						))}
						</div>
					) : (
						<p>No hay alumnos implicados</p>
					)}
				</div>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 pr-6 pb-6">
					<div>
						<div className="mt-4">
							<p className="text-xl font-bold mb-2">Premios:</p>
				
							{award && award.length > 0 ? (
								<ul className="flex flex-wrap">
									{award.map((award, index) => (
										<li key={index} className="text-white gap-2 bg-blue-900 rounded-lg p-4">{award.name}</li>
									))}
								</ul>
							) : (
								<p className="text-black">Sin premios</p>
							)}
						</div>

						<h2 className="text-xl font-bold mb-2 mt-4">Descripcion:</h2>
						<p className="text-gray-700">{projectData.step1.description}</p>
					</div>
					
					<div>
						{projectData.step1.keywords && projectData.step1.keywords.length > 0 && (
							<div className="mt-4">
								<p className="text-xl font-bold mb-2">Palabras clave:</p>

								<ul className="flex flex-wrap">
									{projectData.step1.keywords.map((keyword, index) => (
										<li key={index} className="text-blue-900 bg-blue-200 rounded-full py-1 px-4 m-1">{keyword}</li>
									))}
								</ul>
							</div>
						)}

					</div>
				</div>

				<PdfComp pdfFile={""}/>
			</div>

			<div className="flex justify-end gap-4">
				<button
					className="h-8 px-3 bg-blue-600 hover:bg-blue-400 text-white font-bold text-sm"
					onClick={() => {
						console.log("Guardar borrador");
					}}
				>
					GUARDAR BORRADOR
				</button>
				<button
					className="h-8 px-3 bg-blue-600 hover:bg-blue-400 text-white font-bold text-sm"
					onClick={() => {
						handleSubmit()
						returnStep();
					}}
				>
					ANTERIOR
				</button>
				{/* Este boton debe ir dentro de un form y que sea de tipo submit o quizas simplemente podemos hacerlo sin el form */}
				<button
					className="h-8 px-3 bg-blue-600 hover:bg-blue-400 text-white font-bold text-sm"
					onClick={() => {
						handleSubmit();
						// Una vez que se suba, hay que poner el estilo del ultimo boton en complete y mostrar la animacion de tick
						setIsComplete(true);
					}}
				>
					SUBIR PROYECTO
				</button>
			</div>
		</>
	);
};

export default ProjectFormStep4;
