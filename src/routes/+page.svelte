<script>
	import { enhance } from '$app/forms';

	let site = '';
	let usr = '';
	let pss = '';
	export let data;
	export let form;
</script>

<div>
	{#await data then}
		{#if form?.cookie}
			Auth is <pre>{form.cookie}</pre>

			{#if form?.clientID}
				Client ID is {form.clientID}
				<form method="post" action="?/insertClient" use:enhance>
					<input type="hidden" name="auth" value={form.cookie} />
					<input type="hidden" name="clienID" value={form.clienID} />

					<button type="submit"> Create Client </button>
				</form>
			{:else}
				<form method="POST" action="?/createClient" use:enhance>
					<input type="hidden" name="auth" value={form.cookie} />
					<button type="submit"> Insert Client </button>
				</form>
			{/if}
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
