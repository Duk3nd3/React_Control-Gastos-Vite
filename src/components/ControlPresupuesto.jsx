import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Swal from 'sweetalert2';

const ControlPresupuesto = ({
	gastos,
	setGastos,
	presupuesto,
	setPresupuesto,
	setIsValidPresupuesto,
}) => {
	//Estados que controlan el gasto y lo disponible
	const [disponible, setDisponible] = useState(0);
	const [gastado, setGastado] = useState(0);

	//Controlamos el estado de la grafica
	const [porcentaje, setPorcentaje] = useState(0);

	useEffect(() => {
		//Aqui acumulamos lo que vamos gastando con el metodo REDUCE
		const totalGastado = gastos.reduce(
			(total, gasto) => gasto.cantidad + total,
			0
		);

		//Aqui calculamos presupuesto contra total gastado y obtenemos lo disponible (resto)
		const totalDisponible = presupuesto - totalGastado;

		//Calcular el porcentaje gastado (grafica)
		const nuevoPorcentaje = (
			((presupuesto - totalDisponible) / presupuesto) *
			100
		).toFixed(2);

		//Actualizamos el monto disponible
		setDisponible(totalDisponible);
		//Actualizamos el valor de lo gastado
		setGastado(totalGastado);

		setTimeout(() => {
			//Actualizamos el porcentaje dentro de la grafica
			setPorcentaje(nuevoPorcentaje);
		}, 2000);
	}, [gastos]);

	//Formateamos el importe del presupuesto a Dolares
	const formatearCantidad = (cantidad) => {
		return cantidad.toLocaleString('es-AR', {
			style: 'currency',
			currency: 'ARG',
		});
	};

	//Manejamos el RESET de la APP (Usamos la libreria SWEETALERT2 para mostrar mensaje de advertencia)
	const handleResetApp = () => {
		Swal.fire({
			title: 'Estas segur@?',
			text: 'No vas a poder recuperar esta informacion!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: 'No, mejor no!',
			confirmButtonText: 'Si, borralo!',

			//Espera una respuesta por parte de la promesa
		}).then((result) => {
			if (result.isConfirmed) {
				//Una vez confirmada la accion (SI) vaciamos el gasto y presupuesto
				setGastos([]);
				setPresupuesto([]);
				setIsValidPresupuesto(false);
				Swal.fire('Borrado!', 'Registro quitado con exito.', 'success');
			}
		});
	};

	return (
		<div className='contenedor-presupuesto contenedor sombra dos-columnas'>
			<div>
				<CircularProgressbar
					styles={buildStyles({
						pathColor: porcentaje > 100 ? '#DC2626' : '#3B82F6',
						trailColor: '#F5F5F5',
						textColor: porcentaje > 100 ? '#DC2626' : '#3B82F6',
					})}
					value={porcentaje}
					text={`${porcentaje}% Gastado`}
				/>
			</div>
			<div className='contenido-presupuesto'>
				<button className='reset-app' type='button' onClick={handleResetApp}>
					Resetar APP
				</button>
				<p>
					<span>Presupuesto: </span>
					{formatearCantidad(presupuesto)}
				</p>
				<p className={`${disponible < 0 ? 'negativo' : ''}`}>
					<span>Disponible: </span>
					{formatearCantidad(disponible)}
				</p>
				<p>
					<span>Gastado: </span>
					{formatearCantidad(gastado)}
				</p>
			</div>
		</div>
	);
};

export default ControlPresupuesto;
