import React from 'react';
import { useState, useEffect } from 'react';
import Mensaje from './Mensaje';
import CerrarBtn from '../img/cerrar.svg';

const Modal = ({
	setModal,
	animarModal,
	setAnimarModal,
	guardarGasto,
	gastoEditar,
	setGastoEditar,
}) => {
	const [advertencia, setAdvertencia] = useState('');

	const [nombre, setNombre] = useState('');
	const [cantidad, setCantidad] = useState('');
	const [categoria, setCategoria] = useState('');
	const [fecha, setFecha] = useState('');
	const [id, setId] = useState('');

	//Verificamos que el objeto gastoEditar tenga algo, entonces llenamos los campos de edicion
	useEffect(() => {
		if (Object.keys(gastoEditar).length > 0) {
			setNombre(gastoEditar.nombre);
			setCantidad(gastoEditar.cantidad);
			setCategoria(gastoEditar.categoria);
			setFecha(gastoEditar.fecha);
			setId(gastoEditar.id);
		}
	}, []);

	//Pasamos a ocultar el icono de cierre
	const ocultarModal = () => {
		setAnimarModal(false);
		//Cuando ocultemos el modal cerrandolo, dejara como vacio el estado del mismo
		setGastoEditar({});
		setTimeout(() => {
			setModal(false);
		}, 500);
	};

	//Evento submit del formulario
	const handleSubmit = (e) => {
		e.preventDefault();
		//Verificamos que todos los campos tenga informacion
		if ([nombre, cantidad, categoria].includes('')) {
			setAdvertencia('Todos los campos son obligatorios');
			//Desaparece el aviso
			setTimeout(() => {
				setAdvertencia('');
			}, 3000);
			//Agregamos return para que no continue la ejecucion
			return;
		}
		//Almacenamos el gasto en caso de pasar la validacion
		guardarGasto({ nombre, cantidad, categoria, fecha, id });
	};

	return (
		<div className='modal'>
			<div className='cerrar-modal'>
				<img src={CerrarBtn} alt='cerrar modal' onClick={ocultarModal} />
			</div>
			<form
				className={`formulario ${animarModal ? 'animar' : 'cerrar'}`}
				onSubmit={handleSubmit}
			>
				<legend>{gastoEditar.nombre ? 'Editar Gasto' : 'Nuevo Gasto'}</legend>

				{advertencia && <Mensaje tipo='error'>{advertencia}</Mensaje>}

				<div className='campo'>
					<label htmlFor='nombre'>Nombre Gasto</label>

					<input
						id='nombre'
						type='text'
						placeholder='Agrega el Nombre del Gasto'
						value={nombre}
						onChange={(e) => setNombre(e.target.value)}
					/>
				</div>

				<div className='campo'>
					<label htmlFor='cantidad'>Cantidad</label>

					<input
						id='cantidad'
						type='number'
						placeholder='Agrega la Cantidad del Gasto: Ej. 300'
						value={cantidad}
						onChange={(e) => setCantidad(Number(e.target.value))}
					/>
				</div>

				<div className='campo'>
					<label htmlFor='categoria'>Categoria</label>

					<select
						id='categoria'
						value={categoria}
						onChange={(e) => setCategoria(e.target.value)}
					>
						<option value=''>-- Seleccione</option>
						<option value='ahorro'>Ahorro</option>
						<option value='comida'>Comida</option>
						<option value='casa'>Casa</option>
						<option value='gastos'>Gastos Varios</option>
						<option value='ocio'>Ocio</option>
						<option value='salud'>Salud</option>
						<option value='suscripciones'>Suscripciones</option>
					</select>
				</div>

				<input
					type='submit'
					value={gastoEditar.nombre ? 'Guardar Cambios' : 'Agregar Gasto'}
				/>
			</form>
		</div>
	);
};

export default Modal;
