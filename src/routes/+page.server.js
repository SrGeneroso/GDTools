export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		const sessionID = await fetchSession();
		return await fetchCredentials(data, sessionID);
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
		return { cookies: parseResponseCookies(response.headers.getSetCookie()) };
	} catch (error) {
		console.error('Error:', error);
		return { error: 'something went wrong' };
	}
}
