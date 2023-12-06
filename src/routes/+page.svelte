<script>
	let site = '';
	let usr = '';
	let pss = '';
	export let data;
	export let form;
</script>

<div>
	<form method="POST" action="?/login">
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
<div>
	{#await data then}
		{#if form?.cookies}
			Cookies are <pre>{JSON.stringify(form?.cookies, null, 2)}</pre>
		{/if}
		{#if form?.error}
			<pre>{form.error}</pre>
		{/if}
	{/await}
</div>
