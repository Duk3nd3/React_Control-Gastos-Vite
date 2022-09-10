import React, { useState } from 'react';
import Mensaje from './Mensaje';

const NuevoPresupuesto = ({
	presupuesto,
	setPresupuesto,
	setIsValidPresupuesto,
}) => {
	const [mensaje, setMensaje] = useState('');

	const handlePresupuesto = (e) => {
		e.preventDefault();
		//Validamos el dato ingresado dentro del campo
		if (!presupuesto || presupuesto < 0) {
			setMensaje('No es un presupuesto valido');

			return;
		}
		//Limpiamos el error al completar el campo con un dato valido
		setMensaje('');
		setIsValidPresupuesto(true);
	};

	return (
		<div className='contenedor-presupuesto contenedor sombra'>
			<form onSubmit={handlePresupuesto} className='formulario'>
				<div className='campo'>
					<label>Definir Presupuesto</label>

					<input
						className='nuevo-presupuesto'
						type='number'
						placeholder='Agrega tu Presupuesto'
						value={presupuesto}
						onChange={(e) => setPresupuesto(Number(e.target.value))}
					/>
				</div>

				<input type='submit' value='Agregar' />

				{mensaje && <Mensaje tipo='error'>{mensaje}</Mensaje>}
			</form>
		</div>
	);
};

export default NuevoPresupuesto;
