<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
</script>

<div class="wrapper">
	<nav><Nav /></nav>
	<main>
		<div class="page">
			<slot />
		</div>
	</main>
</div>

<style>
	.wrapper {
		min-height: 100vh;
		width: 100vw;
		max-width: 520px;
		box-sizing: border-box;
	}
	nav {
		min-height: 3rem;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		justify-content: space-between;
	}
	main {
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		padding: 0 1rem;
		padding-top: 4rem;
		flex-grow: 1;
	}
	.page {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		max-width: 520px;
		height: 100%;
		align-items: center;
		justify-content: center;
	}

	@media screen and (min-width: 520px) {
		.wrapper {
			max-width: 100%;
			display: flex;
			flex-direction: row;
			gap: 2rem;
		}
		nav {
			width: 16rem;
			height: 100%;
			position: static;
		}
		main {
			max-width: 100%;
			width: 100%;
			padding-top: 0;
		}
	}
	:global(body) {
		margin: 0;
		width: 100vw;
		background-image: url(/banner.png);
		background-repeat: no-repeat;
		background-size: cover;
		background-position: right;
		display: flex;
		justify-content: center;
		font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
	}
	:global(.alert) {
		padding: 4px 8px;
		color: rgba(230, 40, 40);
		text-align: center;
		margin: 0;
		font-weight: bold;
		background-color: rgba(255, 0, 0, 0.2);
	}
	:global(label, input, select) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: white;
		min-height: 1rem;
	}
	:global(label, input, button, select) {
		box-shadow: 3px 3px 2px black;
		border: 0;
		border-radius: 4px;
		outline: none;
		text-decoration: none;
	}
	:global(button, a) {
		cursor: pointer;
	}
</style>
