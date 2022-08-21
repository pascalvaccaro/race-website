<div class="wrapper">
	<slot name="header" />
	<slot />
</div>

<style>
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
	.wrapper {
		min-height: calc(100vh - 1rem);
		max-width: 520px;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		padding: 1rem;
		box-sizing: border-box;
	}

	@media screen and (min-width: 520px) {
		.wrapper {
			max-width: 100%;
		}
	}
	:global(.alert) {
		padding: 4px 8px;
		color: rgba(230, 40, 40);
		text-align: center;
		margin: 0;
		font-weight: bold;
		background-color: rgba(255, 0, 0, 0.2);
	}
	:global(.two-cols) {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
	}
	:global(.two-cols > *:last-child) {
		margin-left: 4px;
	}
	:global(.two-cols > *:first-child) {
		margin-right: 4px;
	}
	:global(.two-cols > *) {
		width: calc(50% - 16px);
	}
	:global(label, input, select) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: white;
		min-height: 1rem;
	}
	:global(label, input, button, select, a) {
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
