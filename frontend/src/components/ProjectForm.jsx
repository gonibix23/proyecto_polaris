import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray, get, set } from "react-hook-form";
import Select from "react-select";
import { useAreas } from "../context/AreasContext";
import { useProjects } from "../context/ProjectsContext";
import DropzoneComponent from "./DropzoneComponent";

const courseOptions = [
	{ value: "1", label: "1º" },
	{ value: "2", label: "2º" },
	{ value: "3", label: "3º" },
	{ value: "4", label: "4º" },
	{ value: "5", label: "5º" },
];
const letterOptions = [
	{ value: "A", label: "A" },
	{ value: "B", label: "B" },
	{ value: "C", label: "C" },
];

const ProjectForm = () => {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
	} = useForm();

	const { requestedProject, getProject, createProject, updateProject, errors: projectsContextErrors } = useProjects();

	const navigate = useNavigate();

	const { id: projectId } = useParams();

	const { degrees, getDegrees, errors: areasContextErrors } = useAreas();

	const [uploadedFiles, setUploadedFiles] = useState([]);

	const {
		fields: linkFields,
		append: appendLink,
		remove: removeLink,
		update: updateLink,
	} = useFieldArray({
		control,
		name: "links",
	});

	const {
		fields: studentFields,
		append: appendStudent,
		remove: removeStudent,
		update: updateStudent,
	} = useFieldArray({
		control,
		name: "students",
	});

	const {
		fields: teacherFields,
		append: appendTeacher,
		remove: removeTeacher,
		update: updateTeacher,
	} = useFieldArray({
		control,
		name: "teachers",
	});

	const {
		fields: awardFields,
		append: appendAward,
		remove: removeAward,
		update: updateAward,
	} = useFieldArray({
		control,
		name: "obteinedAwards",
	});

	const degreeOptions = useRef([]);
	const [selectedCourseOption, setSelectedCourseOption] = useState("");
	const [selectedLetterOption, setSelectedLetterOption] = useState("");
	const [selectedDegreeOption, setSelectedDegreeOption] = useState("");

	// No se como hacer que solo salga un estudiante
	useEffect(() => {
		console.log("useEffect");
		console.log(projectId);
		getDegrees();
		if (projectId) getProject(projectId);

		if (studentFields.length === 0) {
			updateStudent(0, "");
		}
	}, []);

	useEffect(() => {
		if (degrees) {
			degrees.map((degree) => {
				const newDegree = { value: degree.id, label: degree.name };
				const isInDegreeOptions = degreeOptions.current.some((degreeOption) => {
					return JSON.stringify(degreeOption) === JSON.stringify(newDegree);
				});
				if (!isInDegreeOptions) {
					degreeOptions.current.push(newDegree);
				}
			});
		}
	}, [degrees]);

	useEffect(() => {
		if (degreeOptions.current.length > 0 && requestedProject) {
			console.log(requestedProject);
			setValue("title", requestedProject.title);
			setValue("description", requestedProject.description);
			setValue("subject", requestedProject.subject);
			setValue("academicCourse", requestedProject.academicCourse);

			setValue("course", requestedProject.course);
			setSelectedCourseOption(courseOptions.filter(({ value }) => value === requestedProject.course));
			setValue("letter", requestedProject.letter);
			setSelectedLetterOption(letterOptions.filter(({ value }) => value === requestedProject.letter));
			setValue("degree", requestedProject.degreeId);
			setSelectedDegreeOption(degreeOptions.current.filter(({ value }) => value === requestedProject.degreeId));

			requestedProject.externalLinks.map((value, index) => {
				updateLink(index, value);
				setValue(`externalLinks.${index}`, value);
			});
			requestedProject.impliedStudentsIDs.map((value, index) => {
				updateStudent(index, value);
				setValue(`impliedStudents.${index}`, value);
			});
			requestedProject.impliedProfessorsIDs.map((value, index) => {
				updateTeacher(index, value);
				setValue(`impliedTeachers.${index}`, value);
			});
			requestedProject.awardsId.map((value, index) => {
				updateAward(index, value);
				setValue(`awards.${index}`, value);
			});
		}
	}, [degreeOptions, requestedProject]);

	useEffect(() => {
		setValue("files", uploadedFiles);
		console.log(uploadedFiles);
	}, [uploadedFiles]);

	const onSubmit = async (data) => {
		const formData = new FormData();

		// Agrega los datos simples del proyecto a FormData
		formData.append("title", data.title);
		formData.append("description", data.description);
		//formData.append("personalProject", false);
		formData.append("subject", data.subject);
		formData.append("academicCourse", data.academicCourse);
		formData.append("course", data.course);
		formData.append("letter", data.letter);
		formData.append("degreeId", data.degree);

		// Agrega los datos de tipo array del proyecto a FormData

		const externalLinks = data.externalLinks ? data.externalLinks.filter((value) => value.trim().length !== 0) : [];
		formData.append("externalLinks", JSON.stringify(externalLinks));

		const impliedStudents = data.impliedStudents ? data.impliedStudents.filter((value) => value.trim().length !== 0) : [];
		formData.append("impliedStudentsIDs", JSON.stringify(impliedStudents));

		const impliedTeachers = data.impliedTeachers ? data.impliedTeachers.filter((value) => value.trim().length !== 0) : [];
		formData.append("impliedTeachersIDs", JSON.stringify(impliedTeachers));

		const awards = data.awards ? data.awards.filter((value) => value.trim().length !== 0) : [];
		formData.append("awards", JSON.stringify(awards));

		const keywords = data.keywords ? data.keywords.filter((value) => value.trim().length !== 0) : [];
		formData.append("keywords", JSON.stringify(keywords));

		// Agrega los archivos del proyecto a FormData
		data.files.forEach((file, index) => {
			formData.append("files", file);
		});

		console.log(data);

		if (projectId) {
			updateProject(projectId, formData);
		} else {
			createProject(formData);
		}

		navigate("/home");
	};

	return (
		<div className="flex items-center justify-center min-h-screen">
			<form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<div className="mb-4">
					<h3 className="block text-gray-700 text-sm font-bold mb-2">Título</h3>
					<input
						type="text"
						{...register("title", {
							required: true,
						})}
						placeholder="Título del proyecto"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>

				<div className="mb-4">
					<h3 className="block text-gray-700 text-sm font-bold mb-2">Grado</h3>
					<Select
						options={degreeOptions.current}
						onChange={(selectedDegree) => {
							setValue("degree", selectedDegree.value);
							setSelectedDegreeOption(selectedDegree);
						}}
						value={selectedDegreeOption}
						className="w-full  border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>

				<div className="mb-4">
					<h3 className="block text-gray-700 text-sm font-bold mb-2">Curso</h3>
					<Select
						options={courseOptions}
						onChange={(selectedCourse) => {
							setValue("course", selectedCourse.value);
							setSelectedCourseOption(selectedCourse);
						}}
						value={selectedCourseOption}
						className="w-full  border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>

				<div className="mb-4">
					<h3 className="block text-gray-700 text-sm font-bold mb-2">Clase</h3>
					<Select
						options={letterOptions}
						onChange={(selectedLetter) => {
							setValue("letter", selectedLetter.value);
							setSelectedLetterOption(selectedLetter);
						}}
						value={selectedLetterOption}
						className="w-full  border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>

				<div className="mb-4">
					<h3 className="block text-gray-700 text-sm font-bold mb-2">Curso académico</h3>
					<input
						type="text"
						{...register("academicCourse", {
							required: true,
							pattern: {
								value: /\d{4}\/\d{4}/,
								message: "Formato no válido. Utiliza el formato: XXXX/XXXX",
							},
						})}
						placeholder="XXXX/XXXX"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>

				<div className="mb-4">
					<h3 className="block text-gray-700 text-sm font-bold mb-2">Asignatura</h3>
					<input
						type="text"
						{...register("subject", {
							required: true,
						})}
						placeholder="Asignatura"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>

				<div className="mb-4">
					<h3 className="block text-gray-700 text-sm font-bold mb-2">Archivos del proyecto</h3>
					<DropzoneComponent uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
				</div>

				{/* <div>
                <h3>Memoria del proyecto</h3>
                <input
                    type="file"
                    {...register("projectMemory", {
                        required : false
                    })}
                />
            </div> */}

				<div className="mb-4">
					<h3 className="block text-gray-700 text-sm font-bold mb-2">Enlace a recursos externos</h3>
					{linkFields.map((field, index) => (
						<div key={field.id} className="flex items-center gap-2">
							<input
								type="url"
								{...register(`externalLinks.${index}`)}
								placeholder="URL"
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							/>
							<button
								type="button"
								onClick={() => {
									removeLink(index);
									setValue(`externalLinks.${index}`, "");
								}}
								className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
							>
								Eliminar
							</button>
						</div>
					))}
					<div className="flex justify-center mt-4">
						<button
							type="button"
							onClick={() => appendLink({ externalLink: "" })}
							className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						>
							Añadir recurso externo
						</button>
					</div>
				</div>

				<div className="mb-4">
					<h3 className="block text-gray-700 text-sm font-bold mb-2">Descripción del proyecto</h3>
					<textarea
						{...register("description", {
							required: true,
						})}
						placeholder="Descripción del proyecto"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					></textarea>
				</div>

				<div className="mb-4">
					<h3 className="block text-gray-700 text-sm font-bold mb-2">Estudiantes implicados</h3>
					{studentFields.map((field, index) => (
						<div key={field.id} className="flex items-center gap-2">
							<input
								type="email"
								{...register(`impliedStudents.${index}`, {
									required: index === 0,
								})}
								placeholder="Estudiante implicado"
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							/>
							{index > 0 && (
								<button
									type="button"
									onClick={() => {
										removeStudent(index);
										setValue(`impliedStudents.${index}`, "");
									}}
									className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
								>
									Eliminar
								</button>
							)}
						</div>
					))}
					<div className="flex justify-center mt-4">
						<button
							type="button"
							onClick={() => appendStudent({ impliedStudent: "" })}
							className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						>
							Añadir estudiante
						</button>
					</div>
				</div>

				<div className="mb-4">
					<h3 className="block text-gray-700 text-sm font-bold mb-2">Profesores implicados</h3>
					{teacherFields.map((field, index) => (
						<div key={field.id} className="flex items-center gap-2">
							<input
								type="email"
								{...register(`impliedTeachers.${index}`)}
								placeholder="Profesor implicado"
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							/>
							<button
								type="button"
								onClick={() => {
									removeTeacher(index);
									setValue(`impliedTeachers.${index}`, "");
								}}
								className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
							>
								Eliminar
							</button>
						</div>
					))}
					<div className="flex justify-center mt-4">
						<button
							type="button"
							onClick={() => appendTeacher({ impliedTeacher: "" })}
							className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						>
							Añadir profesor
						</button>
					</div>
				</div>

				<div className="mb-4">
					<h3 className="block text-gray-700 text-sm font-bold mb-2">Premios</h3>
					{awardFields.map((field, index) => (
						<div key={field.id} className="flex items-center gap-2">
							<input
								type="text"
								{...register(`awards.${index}`)}
								placeholder="Premio"
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							/>
							<button
								type="button"
								onClick={() => {
									removeAward(index);
									setValue(`awards.${index}`, "");
								}}
								className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
							>
								Eliminar
							</button>
						</div>
					))}
					<div className="flex justify-center mt-4">
						<button
							type="button"
							onClick={() => appendAward({ award: "" })}
							className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						>
							Añadir premio
						</button>
					</div>
				</div>

				<div className="flex justify-center mt-6">
					<button
						type="submit"
						className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
					>
						Enviar
					</button>
				</div>
			</form>
		</div>
	);
};

export default ProjectForm;
