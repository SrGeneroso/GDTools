<script>
	import { enhance } from '$app/forms';
	import { parse } from 'svelte/compiler';

	let site = 'dimeirauto';
	let usr = 'dimeirauto';
	let pss = '';
	export let data;
	export let form;
	let clientOutputFile;
	let vehicleOutputFile;
	let installation = '2124';
	let json;

	function handleFile(event, callback) {
		const reader = new FileReader();
		reader.onload = callback;
		reader.readAsText(event.target.files[0]);
	}
	$: if (clientOutputFile && vehicleOutputFile) {
		let tempClient = JSON.parse(clientOutputFile);
		let tempVehicle = JSON.parse(vehicleOutputFile);
		const finalArray = tempClient.map((cliente) => {
			const match = tempVehicle.filter((vehiculo) => vehiculo.idCliente === cliente.id);
			return {
				...cliente,
				vehiculo: match
			};
		});
		json = JSON.stringify(finalArray, null, 2);
	}

	function processList() {
		console.log(clientOutputFile);
	}
</script>

<div>
	{#await data then}
		{#if form?.cookie}
			<div>
				Auth is {form.cookie}
				<button on:click={() => (form = '')}>Reset</button>
			</div>
			<br />
			<div>
				<form method="post" action="?/insertClient" use:enhance>
					<input type="hidden" name="auth" value={form.cookie} />
					<input type="hidden" name="clientList" value={json} />
					<label for="clientInput">Fichero Clientes</label>
					<input
						type="file"
						name="clientsFile"
						id="clientInput"
						on:input={(event) => {
							handleFile(event, (e) => {
								clientOutputFile = e.target.result;
							});
						}}
						accept="application/json"
					/>
					<label for="clientInput">Fichero Vehiculos</label>
					<input
						type="file"
						name="vehiclesFile"
						id="vehicleInput"
						on:input={(event) => {
							handleFile(event, (e) => {
								vehicleOutputFile = e.target.result;
							});
						}}
						accept="application/json"
					/>

					<br /><br />
					<label for="installation">ID Instalacion</label>
					<input type="text" name="installation" id="installationInput" bind:value={installation} />
					<br />
					<br />
					<button type="submit" disabled={json == undefined}> Insert Clients </button>
				</form>
			</div>
			<br />
			<div>
				{#if form.processedClients}
					hello
					<pre>{JSON.stringify(form.processedClients)}</pre>
					{@debug form}
				{:else if json}
					<pre>{json}</pre>
				{/if}
			</div>
		{:else}
			<div>
				<form method="POST" action="?/login" use:enhance>
					<label>
						Site:
						<input bind:value={site} name="site" type="text" />
					</label>
					<label>
						Username:
						<input bind:value={usr} name="usr" type="text" />
					</label>
					<label>
						Password:
						<input bind:value={pss} name="pss" type="password" />
					</label>
					<button type="submit">Login</button>
				</form>
			</div>
		{/if}
		{#if form?.error}
			<pre>{form.error}</pre>
		{/if}
	{/await}
</div>
