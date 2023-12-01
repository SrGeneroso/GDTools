<script>
	let site = 'test';
	let usr = 'user';
	let pss = 'pass';
	export let data;
</script>

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

{#await data then value}
	{#if data}
		cookie value is
		<div>{@html data.response}</div>
	{/if}
	<!-- promise was fulfilled -->
{/await}
