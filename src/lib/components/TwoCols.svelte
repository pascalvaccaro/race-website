<div>
	<slot name="left" />
	<slot name="right" />
</div>

<style>
	div {
		box-sizing: border-box;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 1rem;
	}
</style>
