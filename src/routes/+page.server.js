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
		const processedClients = await insertClient(auth, clientData);

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

//Do I create a user and then populate the data or do I create the user at once? To post you need the client id
async function createNewClient(auth, client) {
	const url = 'https://app.gdtaller.com/app/app_contactos_form.php?cod=-1&tipo=-1';
	const formData = new URLSearchParams([
		['hidGuardado', 'o'],
		['eCodigo', '-1'],
		['BtnCrear_btn', 'Crear Contacto'],
		['BtnCrear', 'Crear Contacto'],
		['selecInstalacion', '2124'],
		['selecComercial', '-1'],
		['hidIdTipoSelec', '-1'],
		['txtNombre', 'test'],
		['selecTarifaDef', '-1'],
		['hidTab', '1'],
		['ckbTipo_0', '24'],
		['eNumChecks', '3'],
		['selecSector', '-1'],
		['hidVariasActividades', 'si'],
		['eNumActividades', '0'],
		['ckbRecibirPublicidad', 'on'],
		['txtWeb', 'http://'],
		['selecPais', '61'],
		['selecProvincia', '-1'],
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
			referer: 'https://app.gdtaller.com/app/app_contactos_form.php?cod=-1&tipo=-1',
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

	try {
		const response = await fetch(url, options);
		// const data = await response.json();
		// console.log(data);
		if (response.status !== 302) {
			throw new Error('Network response status was ' + response.status);
		}
		if (response.headers.has('Location')) {
			const location = response.headers.get('Location');
			console.log('Redirect URL:', location);
			const codValue = new URLSearchParams(new URL(location, 'https://dummy.com').search).get(
				'cod'
			);
			console.log(codValue);
			return codValue;
		} else {
			// Handle other response scenarios
			console.log('No redirect location found');
		}
	} catch (error) {
		console.error(error);
	}
}

async function insertClient(auth, clients) {
	let output = [];
	clients.forEach((cliente) => {
		//FIRST Create Client
		//SECOND Post Client Data
		//THIRD Create Vehicle
		//FORTH Assign Vehicle to Client
		//FIFTH Return data with IDs of vehicles and client ID
		console.log(cliente.nombre);
	});

	// const url = 'https://app.gdtaller.com/app/app_contactos_form.php?cod=-1&tipo=24';
	// const formData = new URLSearchParams([
	// 	['txtNombre', nombre],
	// 	['txtApellidos', apellidos],
	// 	['txtAlias', alias],
	// 	['txtCif', cif],
	// 	['txtTelefono', telefono1],
	// 	['txtTelefono2', telefono2],
	// 	['txtMovil', movil],
	// 	['txtFax', fax],
	// 	['txtEmail', email1],
	// 	['txtEmail2', email2],
	// 	['txtWeb', web],
	// 	['selecPais', '61'],
	// 	['selecProvincia', '-1'],
	// 	['txtCodigoPostal', cpostal],
	// 	['txtLocalidad', localidad],
	// 	['txtDomicilio', direccion],
	// 	['txtReferencia', referencia],
	// 	['txtNombreEntrega', ''],
	// 	['txtCnae', ''],
	// 	['txtPersonaContacto', ''],
	// 	['hidReferenciaAnterior', ''],
	// 	['txtVat', ''],
	// 	['txtValorDcto_0', '0.00'],
	// 	['txtValorDcto_1', '0.00'],
	// 	['hidNumChecksDctos', '2'],
	// 	['', ''],
	// 	['', ''],
	// 	['', ''],
	// 	['', ''],
	// 	['', ''],
	// 	['', ''],
	// 	['', ''],
	// 	['hidGMapAsignar', ''],
	// 	['hidGMapGeocodeAnt', ''],
	// 	['txtGMapDireccion', ''],
	// 	['hidGMapLat', ''],
	// 	['hidGMapLong', ''],
	// 	['txtCifEntrega', ''],
	// 	['hidGMapDesmarcar', ''],
	// 	['hidGuardado', 'o'],
	// 	['eCodigo', '-1'],
	// 	['hidInfoExtra', ''],
	// 	['BtnModificar_btn', ''],
	// 	['BtnModificar', ''],
	// 	['BtnEliminar', ''],
	// 	['BtnCrear_btn', 'Crear Contacto'],
	// 	['BtnCrear', 'Crear Contacto'],
	// 	['selecInstalacion', '2124'],
	// 	['txtDctoArticulos', ''],
	// 	['txtDctoServicios', ''],
	// 	['selecComercial', '-1'],
	// 	['hidIdTipoSelec', '-1'],
	// 	['txtCoefPuntosCoste', ''],
	// 	['txtDescuentoCoste', ''],
	// 	['txtCoefPuntosVenta', ''],
	// 	['selecTarifaDef', '-1'],
	// 	['hidTab', '1'],
	// 	['ckbTipo_0', '24'],
	// 	['eNumChecks', '3'],
	// 	['selecSector', '-1'],
	// 	['hidVariasActividades', 'si'],
	// 	['eNumActividades', '0'],
	// 	['ckbRecibirPublicidad', 'on'],

	// 	['ckbUsarGMap', 'on'],
	// 	['hidUsarGMap', '0'],
	// 	['hidGMapZoom', '0'],
	// 	['hidGMapAsignar', 'si'],
	// 	['hidGMapLat', '0'],
	// 	['hidGMapLong', '0'],
	// 	['selecPaisEntrega', '61'],
	// 	['selecProvinciaEntrega', '-1'],
	// 	['radioPostalTitular', '1'],
	// 	['radioPostalDomicilio', '1'],
	// 	['selecFormaPago', '-1'],
	// 	['selecVencimiento', '-1'],
	// 	['selecDiaPago', '0'],
	// 	['selecDiaPago2', '0'],
	// 	['hidEstadoCcc', '3'],
	// 	['radioIbanCompleto', '0'],
	// 	['txtValorDcto_0', '0,00'],
	// 	['txtValorDcto_1', '0,00'],
	// 	['hidNumChecksDctos', '2'],
	// 	['txtOrden', '1'],
	// 	['ckbVisible', '1']
	// ]);

	// const options = {
	// 	method: 'POST',
	// 	headers: {
	// 		authority: 'app.gdtaller.com',
	// 		accept:
	// 			'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
	// 		'accept-language': 'en-US,en;q=0.8',
	// 		'cache-control': 'max-age=0',
	// 		cookie: auth,
	// 		dnt: '1',
	// 		origin: 'https://app.gdtaller.com',
	// 		referer: 'https://app.gdtaller.com/app/app_contactos_form.php?cod=-1&tipo=-1',
	// 		'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
	// 		'sec-ch-ua-mobile': '?0',
	// 		'sec-ch-ua-platform': '"Windows"',
	// 		'sec-fetch-dest': 'document',
	// 		'sec-fetch-mode': 'navigate',
	// 		'sec-fetch-site': 'same-origin',
	// 		'sec-fetch-user': '?1',
	// 		'sec-gpc': '1',
	// 		'upgrade-insecure-requests': '1',
	// 		'user-agent':
	// 			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
	// 	},
	// 	redirect: 'manual'
	// };

	// options.body = formData;

	// try {
	// 	const response = await fetch(url, options);
	// 	// const data = await response.json();
	// 	// console.log(data);
	// 	if (response.status !== 302) {
	// 		throw new Error('Network response status was ' + response.status);
	// 	}
	// 	if (response.headers.has('Location')) {
	// 		const location = response.headers.get('Location');
	// 		console.log('Redirect URL:', location);
	// 		const codValue = new URLSearchParams(new URL(location, 'https://dummy.com').search).get(
	// 			'cod'
	// 		);
	// 		console.log(codValue);
	// 		return { codValue: codValue, clientID: clientID };
	// 	} else {
	// 		// Handle other response scenarios
	// 		console.log('No redirect location found');
	// 	}
	// } catch (error) {
	// 	console.error(error);
	// }
}

// fetch('https://app.gdtaller.com/app/app_contactos_form.php?cod=1111965&tipo=24', {
// 	headers: {
// 		accept:
// 			'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
// 		'accept-language': 'en-US,en;q=0.6',
// 		'cache-control': 'max-age=0',
// 		'content-type': 'multipart/form-data; boundary=----WebKitFormBoundarySHkJymVRIw5F53Rf',
// 		'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
// 		'sec-ch-ua-mobile': '?0',
// 		'sec-ch-ua-platform': '"Windows"',
// 		'sec-fetch-dest': 'document',
// 		'sec-fetch-mode': 'navigate',
// 		'sec-fetch-site': 'same-origin',
// 		'sec-fetch-user': '?1',
// 		'sec-gpc': '1',
// 		'upgrade-insecure-requests': '1'
// 	},
// 	referrer: 'https://app.gdtaller.com/app/app_contactos_form.php?cod=1111965&tipo=24',
// 	referrerPolicy: 'strict-origin-when-cross-origin',
// 	body: '------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidGuardado"\r\n\r\nno\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="eCodigo"\r\n\r\n1111965\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidInfoExtra"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="BtnModificar_btn"\r\n\r\nGuardar\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="BtnModificar"\r\n\r\nGuardar\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="BtnEliminar"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="selecInstalacion"\r\n\r\n2124\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtDctoArticulos"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtDctoServicios"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="selecComercial"\r\n\r\n-1\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtApellidos"\r\n\r\naplellidos\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidIdTipoSelec"\r\n\r\n24\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtNombre"\r\n\r\nnombre\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtCoefPuntosCoste"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtDescuentoCoste"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtCoefPuntosVenta"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="selecTarifaDef"\r\n\r\n-1\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtAlias"\r\n\r\nalias\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtNombreEntrega"\r\n\r\ncombre comercial\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtCnae"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidTab"\r\n\r\n1\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="ckbTipo_0"\r\n\r\n24\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="eNumChecks"\r\n\r\n3\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="selecSector"\r\n\r\n-1\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidVariasActividades"\r\n\r\nsi\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="eNumActividades"\r\n\r\n0\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtPersonaContacto"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtTelefono"\r\n\r\ntelefono 1\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtTelefono2"\r\n\r\ntelefono 2\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtMovil"\r\n\r\nmovil\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtFax"\r\n\r\nfax\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtEmail"\r\n\r\nemail 1\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtEmail2"\r\n\r\nemail 2\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtWeb"\r\n\r\nhttp://webdeltio\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtCif"\r\n\r\ncif\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtReferencia"\r\n\r\nref/cod\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidReferenciaAnterior"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtVat"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="selecPais"\r\n\r\n61\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="selecProvincia"\r\n\r\n32\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtLocalidad"\r\n\r\nlocalidad\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtCodigoPostal"\r\n\r\ncp\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtDomicilio"\r\n\r\ndomicilio\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="ckbUsarGMap"\r\n\r\non\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidUsarGMap"\r\n\r\n0\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidGMapZoom"\r\n\r\n0\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidGMapDesmarcar"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidGMapAsignar"\r\n\r\nsi\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidGMapGeocodeAnt"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtGMapDireccion"\r\n\r\n, localidad\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidGMapLat"\r\n\r\n0\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidGMapLong"\r\n\r\n0\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtCifEntrega"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="selecPaisEntrega"\r\n\r\n61\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="selecProvinciaEntrega"\r\n\r\n-1\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtLocalidadEntrega"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtCodigoPostalEntrega"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtDomicilioEntrega"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="radioPostalTitular"\r\n\r\n1\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtNombrePostal"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="radioPostalDomicilio"\r\n\r\n1\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="selecFormaPago"\r\n\r\n-1\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="selecVencimiento"\r\n\r\n-1\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="selecDiaPago"\r\n\r\n0\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="selecDiaPago2"\r\n\r\n0\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtVencimiento"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="__txtNombreBanco"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidIdBanco"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidEstadoCcc"\r\n\r\n3\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtBic"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="radioIbanCompleto"\r\n\r\n0\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtIban"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtCcc"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtCccTitular"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtSufijoIdSepa"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtBanco"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtValorDcto_0"\r\n\r\n0,00\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtValorDcto_1"\r\n\r\n0,00\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidNumChecksDctos"\r\n\r\n2\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtFacturaECodOC"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtFacturaECodOG"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtFacturaECodUT"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtObservaciones"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="txtOrden"\r\n\r\n1\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="ckbVisible"\r\n\r\n1\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="hidActualFoto"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf\r\nContent-Disposition: form-data; name="archivoSubidoFoto"\r\n\r\n\r\n------WebKitFormBoundarySHkJymVRIw5F53Rf--\r\n',
// 	method: 'POST',
// 	mode: 'cors',
// 	credentials: 'include'
// });
