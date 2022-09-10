import { useState, useEffect } from 'react';
import Header from './components/Header';
import Filtros from './components/Filtros';
import ListadoGastos from './components/ListadoGastos';
import Modal from './components/Modal';
import { generarId } from './helpers';
import IconoNuevoGasto from './img/nuevo-gasto.svg';

function App() {
	// defino el state gastos de una vez como un arreglo, pero a ese arreglo le copio lo que venga de localStorage. Si no existe nada en localStorage (como la primera vez que se abra la app), no copia nada PERO sigue siendo un arreglo. Si existe, entonces el arreglo contiene una copia de lo que está en localStorage gracias al operador de Spread ( los tres puntitos ...)
	const [gastos, setGastos] = useState([
		...(JSON.parse(localStorage.getItem('gastos')) ?? []),
	]);

	//Si dentro de localStorage no hay nada, agregamos el valor 0
	const [presupuesto, setPresupuesto] = useState(
		Number(localStorage.getItem('presupuesto')) ?? 0
	);

	const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);

	const [modal, setModal] = useState(false);
	const [animarModal, setAnimarModal] = useState(false);

	const [gastoEditar, setGastoEditar] = useState({});

	const [filtro, setFiltro] = useState('');
	const [gastosFiltrados, setGastosFiltrados] = useState([]);

	//Mediante este hook queremos verificar si gastoEditar tiene algo, entonces editamos
	useEffect(() => {
		if (Object.keys(gastoEditar).length > 0) {
			setModal(true);

			//Usando la API de JS setTimeOut para el manejo del modal
			setTimeout(() => {
				setAnimarModal(true);
			}, 500);
		}
	}, [gastoEditar]);

	//Hook para almacenar el presupuesto en localStorage
	useEffect(() => {
		localStorage.setItem('presupuesto', presupuesto);
	}, [presupuesto]);

	//Hook para almacenar los gastos (items) en localStorage
	useEffect(() => {
		localStorage.setItem('gastos', JSON.stringify(gastos) ?? []);
	}, [gastos]);

	//Este hook estara 'escuchando' los cambios que sucedan en FILTRO
	useEffect(() => {
		if (filtro) {
			//Filtrar gastos por categoria
			const gastosFiltrados = gastos.filter(
				(gasto) => gasto.categoria === filtro
			);

			setGastosFiltrados(gastosFiltrados);
		}
	}, [filtro]);

	//Como queremos que se ejecute una unica vez, dejamos la dependencia vacia [] - PRESUPUESTO (monto)
	useEffect(() => {
		const presupuestoLS = Number(localStorage.getItem('presupuesto')) ?? 0;

		if (presupuestoLS > 0) {
			setIsValidPresupuesto(true);
		}
	}, []);

	//Generamos un nuevo gasto
	const handleNuevoGasto = () => {
		setModal(true);

		//Luego de la edicion del producto, vaciamos el modal
		setGastoEditar({});

		//Usando la API de JS setTimeOut para el manejo del modal
		setTimeout(() => {
			setAnimarModal(true);
		}, 500);
	};

	//Generamos ID para el gasto y colocamos copia del gasto (...gastos) + nuevo gasto (gasto)
	const guardarGasto = (gasto) => {
		if (gasto.id) {
			//Actualizado
			const gastosActualizados = gastos.map((gastoState) =>
				gastoState.id === gasto.id ? gasto : gastoState
			);
			setGastos(gastosActualizados);
			//Vaciamos el estado luego ded guardar el gasto con setGastoEditar({});
			setGastoEditar({});
		} else {
			//Nuevo Gasto
			//Generamos un ID unico
			gasto.id = generarId();

			//La fecha se formatea desde la carpeta helpers archivo index, mediante el componente Gasto.jsx
			gasto.fecha = Date.now();
			setGastos([...gastos, gasto]);
		}

		//Reutilizamos estos hook (setAnimarModal / setModal) y cerramos el modal
		setAnimarModal(false);
		setTimeout(() => {
			setModal(false);
		}, 500);
	};

	//Eliminando gasto utilizando el metodo FILTER
	const eliminarGasto = (id) => {
		const gastosActualizados = gastos.filter((gasto) => gasto.id !== id);
		setGastos(gastosActualizados);
	};

	//Dentro del primer Div mediante true/false acomodamos el estilo para el modal carga de gastos
	return (
		<div className={modal ? 'fijar' : ''}>
			<Header
				gastos={gastos}
				setGastos={setGastos}
				presupuesto={presupuesto}
				setPresupuesto={setPresupuesto}
				isValidPresupuesto={isValidPresupuesto}
				setIsValidPresupuesto={setIsValidPresupuesto}
			/>

			{isValidPresupuesto && (
				<>
					<main>
						<Filtros filtro={filtro} setFiltro={setFiltro} />
						<ListadoGastos
							gastos={gastos}
							setGastoEditar={setGastoEditar}
							eliminarGasto={eliminarGasto}
							filtro={filtro}
							gastosFiltrados={gastosFiltrados}
						/>
					</main>
					<div className='nuevo-gasto'>
						<img
							src={IconoNuevoGasto}
							alt={'icono nuevo gasto'}
							onClick={handleNuevoGasto}
						/>
					</div>
				</>
			)}

			{modal && (
				<Modal
					setModal={setModal}
					animarModal={animarModal}
					setAnimarModal={setAnimarModal}
					guardarGasto={guardarGasto}
					gastoEditar={gastoEditar}
					setGastoEditar={setGastoEditar}
				/>
			)}
		</div>
	);
}

export default App;
