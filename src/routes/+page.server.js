export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		const sessionID = await fetchSession();
		return await fetchCredentials(data, sessionID);
	},
	createClient: async ({ request }) => {
		const data = await request.formData();
		const auth = data.get('auth');
		const clientID = await fetchNewClientID(auth);
		return { cookie: auth, clientID: clientID };
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

async function fetchNewClientID(auth) {
	const url = 'https://app.gdtaller.com/app/app_contactos_form.php?cod=-1&tipo=-1';
	const form = new FormData();
	form.append('hidGuardado', 'o');
	form.append('eCodigo', '-1');
	form.append('BtnCrear_btn', 'Crear Contacto');
	form.append('BtnCrear', 'Crear Contacto');
	form.append('selecInstalacion', '2124');
	form.append('selecComercial', '-1');
	form.append('hidIdTipoSelec', '-1');
	form.append('txtNombre', 'test');
	form.append('selecTarifaDef', '-1');
	form.append('hidTab', '1');
	form.append('ckbTipo_0', '24');
	form.append('eNumChecks', '3');
	form.append('selecSector', '-1');
	form.append('hidVariasActividades', 'si');
	form.append('eNumActividades', '0');
	form.append('ckbRecibirPublicidad', 'on');
	form.append('txtWeb', 'http://');
	form.append('selecPais', '61');
	form.append('selecProvincia', '-1');
	form.append('ckbUsarGMap', 'on');
	form.append('hidUsarGMap', '0');
	form.append('hidGMapZoom', '0');
	form.append('hidGMapAsignar', 'si');
	form.append('hidGMapLat', '0');
	form.append('hidGMapLong', '0');
	form.append('selecPaisEntrega', '61');
	form.append('selecProvinciaEntrega', '-1');
	form.append('radioPostalTitular', '1');
	form.append('radioPostalDomicilio', '1');
	form.append('selecFormaPago', '-1');
	form.append('selecVencimiento', '-1');
	form.append('selecDiaPago', '0');
	form.append('selecDiaPago2', '0');
	form.append('hidEstadoCcc', '3');
	form.append('radioIbanCompleto', '0');
	form.append('txtValorDcto_0', '0,00');
	form.append('txtValorDcto_1', '0,00');
	form.append('hidNumChecksDctos', '2');
	form.append('txtOrden', '1');
	form.append('ckbVisible', '1');

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

	options.body = form;

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
