// BORRARLA
import React, { useState, useEffect } from "react";
import { useProjects } from "../context/ProjectsContext.jsx";
import ProjectCard from "../components/Cards/ProjectCard.jsx";

function ProjectHomePage() {
	const { projects, getProjects } = useProjects();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getProjects().then(() => setLoading(false));
	}, []);

	if (projects.length === 0) {
		return <p>No hay proyectos para mostrar</p>;
	}

	return (
		<>
			{loading ? (
				<p>Cargando proyectos...</p>
			) : (
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{projects.map((project) => (
							<ProjectCard key={project.id} project={project} />
						))}
					</div>
				</div>
			)}
		</>
	);
}

export default ProjectHomePage;
