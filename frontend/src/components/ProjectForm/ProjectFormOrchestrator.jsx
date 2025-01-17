import React from "react";

import { useState } from "react";
import ProjectFormStep1 from "./ProjectFormStep1.jsx";
import ProjectFormStep2 from "./ProjectFormStep2.jsx";
import ProjectFormStep3 from "./ProjectFormStep3.jsx";
import ProjectFormStep4 from "./ProjectFormStep4.jsx";
import PopupUploadProject from "../Dialogs/PopupUploadProject.jsx";
import Stepper from "../Helpers/Stepper.jsx";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// El problema esta, guardo los estados de los componentes hijos en estados individuales o en un estado global?
// Voy a optar por la segunda opcion, ya que me parece mas limpio y ordenado

// OJO, una vez sales del popup el step deberia resetearse ya que se supone que el usuario desecha el proyecto
const ProjectFormOrchestrator = ({ openPopup, closePopup }) => {
	// Estado para saber en que paso del formulario se encuentra el usuario
	const [step, setStep] = useState(1);

	// Estado para saber si se esta editando un proyecto
	// De hecho no necesitamos este estado en todos los hijos, solo en el padre
	// Ya que lo unico que va a cambiar es el texto del boton y la request
	// Para que puedas ir atras y adelante en el formulario y se mantengan los datos, vamos a estar checkeando si ya existen
	// en el estado global y eso es lo mismo que se haria en el update.
	const [editing, setEditing] = useState(false);

	// Estado para guardar los datos del proyecto
	// Si estamos editando un proyecto, estos datos se van a cargar en el estado global
	// Aqui los cargaremos tal cual los leen los inputs etc, que quizas no es la forma en la que los guardaremos
	const [projectData, setProjectData] = useState({
		step1: {
			title: "",
			description: "",
			differentialFactor: "",
			keywords: [],
		},
		step2: {
			impliedStudents: [{ student: "" }],
			impliedProfessors: [],
		},
		step3: {
			degree: {},
			personalProject: false,
			subject: {},
			// Aqui hay que conseguir el ultimo año para que no este hardcodeado
			academicCourse: "2023/2024",
			externalLinks: [],
			awards: [],
			thumbnail: [],
			summary: [],
			projectFiles: [],
		},
	});

	const updateProjectData = (step, data) => {
		setProjectData((prev) => ({ ...prev, [step]: data }));
	};

	const resetForm = () => {
		setStep(1);
		setProjectData({
			step1: {
				title: "",
				description: "",
				differentialFactor: "",
				keywords: [],
			},
			step2: {
				impliedStudents: [{ student: "" }],
				impliedProfessors: [],
			},
			step3: {
				degree: {
					value: "Elige el grado",
					label: "Elige el grado",
				},
				personalProject: false,
				subject: {
					value: "Elige la asignatura",
					label: "Elige la asignatura",
				},
				academicCourse: "2023/2024",
				externalLinks: [],
				awards: [],
				thumbnail: [],
				summary: [],
				projectFiles: [],
			},
		});
	};

	const resetFormAndClose = () => {
		resetForm();
		closePopup();
	};

	const goToNext = () => {

        if (step === 3) {
            const isProjectDataComplete = checkProjectData(projectData);
    
            if (isProjectDataComplete) {
                setStep((prevStep) => prevStep + 1);
            } else {
                toast.error('Por favor, completa todos los datos antes de avanzar al siguiente paso.', {
                    position: 'top-center',
                    autoClose: 3000, // El toast se cerrará automáticamente después de 3 segundos
                });
            }
        } else {
            setStep((prevStep) => prevStep + 1);
        }
    };

    const checkProjectData = (projectData) => {
        const step1Completed = projectData.step1.title && projectData.step1.description && projectData.step1.differentialFactor;
        const step2Completed = projectData.step2.impliedStudents.length > 0;
        const step3Completed = projectData.step3.degree && projectData.step3.subject && projectData.step3.academicCourse;
    
        return step1Completed && step2Completed && step3Completed;
    };

	const goToPrevious = () => setStep((prevStep) => prevStep - 1);

	const renderStep = () => {
		switch (step) {
			case 1:
				return <ProjectFormStep1 advanceStep={goToNext} currentStep={step} updateProjectData={updateProjectData} projectData={projectData} />;
			case 2:
				return <ProjectFormStep2 advanceStep={goToNext} returnStep={goToPrevious} currentStep={step} updateProjectData={updateProjectData} projectData={projectData} />;
			case 3:
				return <ProjectFormStep3 advanceStep={goToNext} returnStep={goToPrevious} currentStep={step} updateProjectData={updateProjectData} projectData={projectData} />;
			case 4:
				return <ProjectFormStep4 returnStep={goToPrevious} currentStep={step} editing={editing} projectData={projectData} closePopup={closePopup} />;
			default:
				return null;
		}
	};

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                style={{ zIndex: 9999, position:"fixed" }}
            />
            <PopupUploadProject title="Subir Proyecto" openPopup={openPopup} onClose={resetFormAndClose} renderStep={renderStep} />
        </>
    );
};

export default ProjectFormOrchestrator;
