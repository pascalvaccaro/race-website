<main class="container">
	<slot />
	<footer class="selector">
		<a href="/admin/run/checkin/scanner">Scanner un QR Code</a>
		<a href="/admin/run/checkin/runner">Inscrire un nouveau participant</a>
	</footer>
</main>

<style>
	main.container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	footer.selector {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
    gap: 1rem;
		height: 5rem;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.75);
		padding: 1rem;
	}
	footer.selector > a {
		max-width: 40%;
		padding: 1rem 2rem;
		border-radius: 1rem;
		text-decoration: none;
    color: black;
    font-weight: 200;
    background: lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
	}
</style>
