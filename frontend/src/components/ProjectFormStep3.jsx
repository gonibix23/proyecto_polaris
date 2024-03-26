import React from "react";

const ProjectFormStep3 = ({ returnStep, advanceStep }) => {
	return (
		<>
			<div>
				<h1>Step 3</h1>
			</div>
			<button
				onClick={() => {
					returnStep();
				}}
			>
				ANTERIOR
			</button>
			<button
				onClick={() => {
					advanceStep();
				}}
			>
				SIGUIENTE
			</button>
		</>
	);
};

export default ProjectFormStep3;
