<script lang="ts">
	import { page } from '$app/stores';
</script>

{#if $page.url.pathname !== '/admin/run'}
	<div class="close">
		<a href="/admin/run">X</a>
	</div>
{/if}
<div class="run-wrapper">
	<slot />
</div>

<style>
	.close {
		position: fixed;
		top: 0;
		right: 0;
		height: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 3rem;
		background-color: rgba(255, 0, 2, 0.5);
		z-index: 100;
		cursor: pointer;
	}
	.close > a {
		color: white;
		text-decoration: none;
		font-family: sans-serif;
		box-shadow: none;
		border-radius: 0;
	}
	.run-wrapper {
		width: 100%;
		height: 100%;
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}
</style>
