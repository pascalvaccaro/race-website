<script lang="ts">
	import Disclaimer from '$lib/components/Disclaimer.svelte';
	import LoginForm from '$lib/components/LoginForm.svelte';

	export let errors: Error | null;
</script>

<Disclaimer>
	<h2 style="margin: 0;">Vous devez vous connecter pour accéder à cette page</h2>
</Disclaimer>

<LoginForm errors={errors} />
