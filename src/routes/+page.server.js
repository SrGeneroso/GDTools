// let site;
// let usr;
// let pss;
// let force = false;
let response;
let errorResponse = null;
let loadNumber = 0;

export function load() {
	loadNumber++;
	console.log('load fucntion executed ' + loadNumber);

	return;
}

export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		const sessionID = await getSession();
		return await fetchCredentials(data, sessionID);
	}
};

async function getSession() {
	try {
		let session;
		const response = await fetch('https://app.gdtaller.com/app/app_login.php');
		const cookies = response.headers.get('set-cookie');

		if (cookies) {
			const cookie = cookies.split(';');
			cookie.forEach((part) => {
				const cookieParts = part.trim().split('=');
				if (cookieParts[0] === 'PHPSESSID') {
					session = cookieParts[1];
				}
			});
		}
		return session;
	} catch (error) {
		console.error(error);
		return null;
	}
}
async function fetchCredentials(data, sessionID) {
	const url = 'https://app.gdtaller.com/app/app_login.php';

	const formData = new URLSearchParams();
	formData.append('txtSite', data.get('site'));
	formData.append('txtLogin', data.get('usr'));
	formData.append('txtClave', data.get('pss'));
	formData.append('BtnLoginApp_btn', 'Entrar');
	formData.append('BtnLoginApp', 'Entrar');

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
		const res = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: formData
		});

		if (!res.ok) {
			const errorData = await res.json(); // Parse error response if available
			errorResponse = {
				CODE: errorData?.error?.CODE || 'Unknown',
				DESC: errorData?.error?.DESC || 'Unknown'
			};
			throw new Error(errorData.error.DESC || 'Network response was not ok');
		}
		console.log('no errors');
		// console.log(await res.headers.forEach());

		const cookieHeaders = await res.headers.get('set-cookie');
		console.log('response cookie is ' + cookieHeaders);

		// const myCookies = await res.headers.get('set-cookie');
		// cookies = await cookieHeaders;
		// await console.log(`cookies are ${res.headers.getSetCookie()}`);
		response = await res.text();
		// console.log(response);
		errorResponse = null;
		return { response: response, cookie: sessionID };
	} catch (error) {
		console.error('Error:', error);
		response = null;
		// errorResponse = { error: error.message };
	}
}
