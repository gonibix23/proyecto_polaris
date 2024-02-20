import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Select from "react-select";
import { useAreas } from "../context/AreasContext";
import DropzoneComponent from "./DropzoneComponent";
import { postProjectsRequest } from "../api/projects"

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

const postProject = async (project) => {
    try {
        const response = await postProjectsRequest(project);
        console.log(response);
    } catch (error) {
        console.log(error.response);
    }
};

const ProjectForm = () => {
    const { register, control, handleSubmit, formState: { errors }, setValue } = useForm();
    const { degrees, getDegrees, errors : areasContextErrors } = useAreas();
    const [uploadedFiles, setUploadedFiles] = useState([])

    const { fields : linkFields, append : appendLink } = useFieldArray({
        control,
        name: "links"
    });
    const { fields : studentFields, append : appendStudent } = useFieldArray({
        control,
        name: "students"
    });
    const { fields : teacherFields, append : appendTeacher } = useFieldArray({
        control,
        name: "teachers"
    });
    const { fields : awardFields, append : appendAward } = useFieldArray({
        control,
        name: "obteinedAwards"
    });

    const degreeOptions = useRef([]);

	useEffect(() => {
		getDegrees();

		appendStudent({ impliedStudent: "" });
		appendTeacher({ impliedTeacher: "" });
		appendAward({ award: "" });
	}, []);

    useEffect(() => {
        if(degrees) {
            degrees.map((degree) => {
                const newDegree = { value : degree.id, label : degree.name };
                const isIndegreeOptions = degreeOptions.current.some(degreeOption => {
                    return JSON.stringify(degreeOption) === JSON.stringify(newDegree)
                });
                if(!isIndegreeOptions){
                    degreeOptions.current.push(newDegree);
                }
            })
        }
    }, [degrees]);

    useEffect(() => {
        setValue("uploadedContent", uploadedFiles);
        console.log(uploadedFiles);
    }, [uploadedFiles])
    
    const onSubmit = (data) => {
        const newProject = {
            title : data.projectTitle,
            description : data.projectDescription,
            keywords : [],
            awards : data.awards?.filter(value => value !== ""),
            subject : data.subject,
            personalProject : false,
            academicCourse : data.academicCourse,
            course : data.course,
            letter : data.letter,
            externalLinks : data.externalLinks?.filter(value => value !== ""),
            uploadedContent : data.uploadedContent,
            degreeId : data.degree,
            impliedStudentsIDs : [] /*data.impliedStudents?.filter(value => value !== "")*/,
            impliedProfessorsIDs : [] /*data.impliedTeachers?.filter(value => value !== "")*/
        };
        console.log(newProject);
        
        postProject(newProject);
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <h3>Título</h3>
                <input
                    type="text"
                    {...register("projectTitle", {
                        required : true,
                    })}
                    placeholder="Título del proyecto"
                />
            </div>
            <div>
                <h3>Grado</h3>
                <Select
                    options={degreeOptions.current}
                    onChange={(selectedDgree) => { setValue("degree", selectedDgree.value) }}
                />
            </div>
            <div>
                <h3>Curso</h3>
                <Select
                    options={courseOptions}
                    onChange={(selectedCourse) => { setValue("course", selectedCourse.value) }}
                />
            </div>
            <div>
                <h3>Clase</h3>
                <Select
                    options={letterOptions}
                    onChange={(selectedLetter) => { setValue("letter", selectedLetter.value) }}
                />
            </div>
            <div>
                <h3>Curso académico</h3>
                <input
                    type="text"
                    {...register("academicCourse", {
                        required : true,
                        pattern: {
                            value: /\d{4}\/\d{4}/,
                            message: 'Formato no válido. Utiliza el formato: XXXX/XXXX',
                        }
                    })}
                    placeholder="XXXX/XXXX"
                />
            </div>
            <div>
                <h3>Asignatura</h3>
                <input
                    type="text"
                    {...register("subject", {
                        required : true,
                    })}
                    placeholder="Asignatura"
                />
            </div>
            <div>
                <h3>Archivos del proyecto</h3>
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
            <div>
                <h3>Enlace a recursos externos</h3>
                {linkFields.map((field, index) => (
                    <div key={field.id}>
                    <input
                        type="url"
                        {...register(`externalLinks.${index}`)}
                        placeholder="URL"
                    />
                    </div>
                ))}
                <button type="button" onClick={() => appendLink({ externalLink : "" })}>
                    Añadir recurso externo
                </button>
            </div>
            <div>
                <h3>Descripción del proyecto</h3>
                <textarea
                    {...register("projectDescription", {
                        required : true,
                    })}
                    placeholder="Descripción del proyecto"
                ></textarea>
            </div>
            <div>
                <h3>Estudiantes implicados</h3>
                {studentFields.map((field, index) => (
                    <div key={field.id}>
                    <input
                        type="text"
                        {...register(`impliedStudents.${index}`, {
                            required : (index === 0)
                        })}
                        placeholder="Estudiante implicado"
                    />
                    </div>
                ))}
                <button type="button" onClick={() => appendStudent({ impliedStudent : "" })}>
                    Añadir estudiante
                </button>
            </div>
            <div>
                <h3>Profesores implicados</h3>
                {teacherFields.map((field, index) => (
                    <div key={field.id}>
                    <input
                        type="text"
                        {...register(`impliedTeachers.${index}`)}
                        placeholder="Profesor implicado"
                    />
                    </div>
                ))}
                <button type="button" onClick={() => appendTeacher({ impliedTeacher : "" })}>
                    Añadir profesor
                </button>
            </div>
            <div>
                <h3>Premios</h3>
                {awardFields.map((field, index) => (
                    <div key={field.id}>
                    <input
                        type="text"
                        {...register(`awards.${index}`)}
                        placeholder="Premio"
                    />
                    </div>
                ))}
                <button type="button" onClick={() => appendAward({ award : "" })}>
                    Añadir premio
                </button>
            </div>
            <div>
                <input type="submit" />
            </div>
        </form>
    );
}

export default ProjectForm;
