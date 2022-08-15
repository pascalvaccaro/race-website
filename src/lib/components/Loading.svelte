<div class="wrapper">
	<div class="loader" />
	<slot>
		<h3>Merci de bien vouloir patienter...</h3>
	</slot>
</div>

<style>
	div.wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 100;
		background-color: rgba(255, 255, 255, 0.75);
		pointer-events: none;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		border-radius: 4px;
		box-shadow: 2px 2px 4px gray;
		background-color: rgba(255, 255, 255, 0.65);
	}
	div.loader {
		width: 6rem;
		height: 6rem;
		border: 1rem solid #fff;
		border-bottom-color: #d3d2a4;
		border-radius: 50%;
		display: inline-block;
		box-sizing: border-box;
		animation: rotation 1s linear infinite;
	}
	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
