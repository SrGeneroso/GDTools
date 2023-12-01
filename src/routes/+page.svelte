<script>
	let site = '';
	let usr = '';
	let pss = '';
	export let data;
	export let form;
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

{#await data}
	<!-- promise is pending -->
{:then value}
	<!-- promise was fulfilled -->

	cookie value is {form?.cookie}
	<div>
		HTML received is :
		{@html form?.response}
	</div>
	<!-- promise was fulfilled -->
{/await}
