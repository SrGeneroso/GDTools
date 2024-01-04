export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		const sessionID = await fetchSession();
		return await fetchCredentials(data, sessionID);
	},
	insertClient: async ({ request }) => {
		const data = await request.formData();
		const auth = data.get('auth');
		const clientData = JSON.parse(data.get('clientList'));
		const installationID = data.get('installation');
		const processedClients = await insertClients(auth, clientData, installationID);

		return { cookie: auth, processedClients: processedClients };
	}
};

function parseResponseCookies(cookiesArray) {
	const cookieObj = {};
	cookiesArray.forEach((cookie) => {
		cookie.split(';').forEach((attribute) => {
			const [key, value] = attribute.trim().split('=');
			cookieObj[key] = value ? value : '';
		});
	});
	return cookieObj;
}

async function fetchSession() {
	try {
		const response = await fetch('https://app.gdtaller.com/app/app_login.php');
		const cookies = response.headers.getSetCookie();
		return cookies ? parseResponseCookies(cookies)['PHPSESSID'] : undefined;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function fetchCredentials(data, sessionID) {
	const url = 'https://app.gdtaller.com/app/app_login.php';

	const formData = new URLSearchParams([
		['txtSite', data.get('site')],
		['txtLogin', data.get('usr')],
		['txtClave', data.get('pss')],
		['BtnLoginApp_btn', 'Entrar'],
		['BtnLoginApp', 'Entrar']
	]);

	const headers = {
		authority: 'app.gdtaller.com',
		accept:
			'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
		'accept-language': 'en-US,en;q=0.7',
		'cache-control': 'max-age=0',
		'content-type': 'application/x-www-form-urlencoded',
		cookie: `PHPSESSID=${sessionID}`,
		dnt: '1',
		origin: 'https://app.gdtaller.com',
		referer: 'https://app.gdtaller.com/app/app_login.php',
		'sec-ch-ua': '"Brave";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
		'sec-ch-ua-mobile': '?0',
		'sec-ch-ua-platform': '"Windows"',
		'sec-fetch-dest': 'document',
		'sec-fetch-mode': 'navigate',
		'sec-fetch-site': 'same-origin',
		'sec-fetch-user': '?1',
		'sec-gpc': '1',
		'upgrade-insecure-requests': '1',
		'user-agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
			redirect: 'manual',
			headers: headers,
			body: formData
		});
		console.log(response.status);
		//Expected redirect
		if (response.status !== 302) {
			throw new Error('Network response status was ' + response.status);
		}
		const cookies = parseResponseCookies(response.headers.getSetCookie());
		const currentAuth = `PHPSESSID=${cookies['PHPSESSID']};UsrRec=${cookies['UsrRec']};UsrEntrar=${cookies['UsrRec']}`;
		return {
			cookie: currentAuth
		};
	} catch (error) {
		console.error('Error:', error);
		return { error: 'something went wrong' };
	}
}

async function returnInsertId(url, options) {
	try {
		const response = await fetch(url, options);
		if (response.status !== 302) {
			throw new Error('Network response status was ' + response.status);
		}
		if (response.headers.has('Location')) {
			const location = response.headers.get('Location');
			if (location !== '../app/app_login.php') {
				const codValue = new URLSearchParams(new URL(location, 'https://dummy.com').search).get(
					'cod'
				);
				return codValue;
			}
		} else {
			console.log('No redirect location found');
		}
	} catch (error) {
		console.error(error);
	}
}

async function insertClient(auth, client, installationID) {
	const url = 'https://app.gdtaller.com/app/app_contactos_form.php?cod=-1&tipo=24';
	const formData = new URLSearchParams([
		['txtNombre', client.nombre],
		['txtApellidos', client.apellidos],
		['txtAlias', ''],
		['txtCif', client.cif],
		['txtTelefono', client.telefono1],
		['txtTelefono2', client.telefono2],
		['txtMovil', client.movil],
		['txtFax', ''],
		['txtEmail', client.email],
		['txtEmail2', ''],
		['txtWeb', ''],
		['selecPais', '61'],
		['selecProvincia', client.provincia],
		['txtCodigoPostal', client.postal],
		['txtLocalidad', client.poblacion],
		['txtDomicilio', client.direccion],
		['txtReferencia', ''],
		['txtNombreEntrega', ''],
		['txtCnae', ''],
		['txtPersonaContacto', ''],
		['hidReferenciaAnterior', ''],
		['txtVat', ''],
		['txtValorDcto_0', '0.00'],
		['txtValorDcto_1', '0.00'],
		['hidNumChecksDctos', '2'],
		['hidGMapAsignar', ''],
		['hidGMapGeocodeAnt', ''],
		['txtGMapDireccion', ''],
		['hidGMapLat', ''],
		['hidGMapLong', ''],
		['txtCifEntrega', ''],
		['hidGMapDesmarcar', ''],
		['hidGuardado', 'o'],
		['eCodigo', '-1'],
		['hidInfoExtra', ''],
		['BtnModificar_btn', ''],
		['BtnModificar', ''],
		['BtnEliminar', ''],
		['BtnCrear_btn', 'Crear Contacto'],
		['BtnCrear', 'Crear Contacto'],
		['selecInstalacion', installationID],
		['txtDctoArticulos', ''],
		['txtDctoServicios', ''],
		['selecComercial', '-1'],
		['hidIdTipoSelec', '-1'],
		['txtCoefPuntosCoste', ''],
		['txtDescuentoCoste', ''],
		['txtCoefPuntosVenta', ''],
		['selecTarifaDef', '-1'],
		['hidTab', '1'],
		['ckbTipo_0', '24'],
		['eNumChecks', '3'],
		['selecSector', '-1'],
		['hidVariasActividades', 'si'],
		['eNumActividades', '0'],
		['ckbRecibirPublicidad', 'on'],
		['ckbUsarGMap', 'on'],
		['hidUsarGMap', '0'],
		['hidGMapZoom', '0'],
		['hidGMapAsignar', 'si'],
		['hidGMapLat', '0'],
		['hidGMapLong', '0'],
		['selecPaisEntrega', '61'],
		['selecProvinciaEntrega', '-1'],
		['radioPostalTitular', '1'],
		['radioPostalDomicilio', '1'],
		['selecFormaPago', '-1'],
		['selecVencimiento', '-1'],
		['selecDiaPago', '0'],
		['selecDiaPago2', '0'],
		['hidEstadoCcc', '3'],
		['radioIbanCompleto', '0'],
		['txtValorDcto_0', '0,00'],
		['txtValorDcto_1', '0,00'],
		['hidNumChecksDctos', '2'],
		['txtOrden', '1'],
		['ckbVisible', '1']
	]);

	const options = {
		method: 'POST',
		headers: {
			authority: 'app.gdtaller.com',
			accept:
				'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
			'accept-language': 'en-US,en;q=0.8',
			'cache-control': 'max-age=0',
			cookie: auth,
			dnt: '1',
			origin: 'https://app.gdtaller.com',
			referer: 'https://app.gdtaller.com/app/app_contactos_form.php?cod=-1&tipo=24',
			'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"Windows"',
			'sec-fetch-dest': 'document',
			'sec-fetch-mode': 'navigate',
			'sec-fetch-site': 'same-origin',
			'sec-fetch-user': '?1',
			'sec-gpc': '1',
			'upgrade-insecure-requests': '1',
			'user-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
		},
		redirect: 'manual'
	};
	options.body = formData;
	const id = await returnInsertId(url, options);
	return id;
}
async function insertVehicle(auth, gdtID, vehiculo, installationID) {
	let url = 'https://app.gdtaller.com/app/app_vehiculos_form.php?cod=-1';
	const formData = new URLSearchParams([
		['eCodigo', '-1'],
		['BtnCrear_btn', 'Crear Vehlo'],
		['BtnCrear', 'Crear Vehlo'],
		['hidTab', '-1'],
		['selecInstalacion', installationID],
		['selecCateg', '1'],
		['txtNombre', vehiculo.bastidor],
		['txtOrden', '1'],
		['ckbVisible', 'on'],
		['txtCosteVehiculoPorHora', '0'],
		['selecTamanioDepot', '-1'],
		['txtMarca', vehiculo.marca],
		['txtModelo', vehiculo.modelo],
		['txtMatricula', vehiculo.matricula],
		['selecCombustible', '-1'],
		['selecAnioFabricacion', '0'],
		['selecUbicacion', '-1'],
		['hidIdPropietario', gdtID]
	]);
	const options = {
		method: 'POST',
		headers: {
			authority: 'app.gdtaller.com',
			accept:
				'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
			'accept-language': 'en-US,en;q=0.8',
			'cache-control': 'max-age=0',
			cookie: auth,
			dnt: '1',
			origin: 'https://app.gdtaller.com',
			referer: 'https://app.gdtaller.com/app/app_vehiculos_form.php?cod=-1',
			'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"Windows"',
			'sec-fetch-dest': 'document',
			'sec-fetch-mode': 'navigate',
			'sec-fetch-site': 'same-origin',
			'sec-fetch-user': '?1',
			'sec-gpc': '1',
			'upgrade-insecure-requests': '1',
			'user-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
		},
		redirect: 'manual'
	};

	options.body = formData;
	const id = await returnInsertId(url, options);
	return id;
}

async function insertClients(auth, clients, installationID) {
	for (const client of clients) {
		client.gdtID = await insertClient(auth, client, installationID);
		for (const vehiculo of client.vehiculo) {
			vehiculo.gdtID = await insertVehicle(auth, client.gdtID, vehiculo, installationID);
		}
	}
	console.log(JSON.stringify(clients));
	return clients;
}
