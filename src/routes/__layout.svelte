<div class="wrapper">
  <slot />
</div>

<style>
  .wrapper {
    width: 100vw;
    display: flex;
    justify-content: center;
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
		margin-left: 8px;
	}
	:global(.two-cols > *:first-child) {
		margin-right: 8px;
	}
	:global(.two-cols > *) {
		width: calc(50% - 32px);
	}
  :global(label, input) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: white;
		min-height: 1rem;
	}
	:global(label, input, button) {
		box-shadow: 1px 1px 1px;
		border: 0;
		border-radius: 4px;
		outline: none;
	}
</style>
