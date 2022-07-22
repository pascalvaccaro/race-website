<script lang="ts">
	export let name: string;
  export let required: boolean;
	let fileInput: any;
</script>

<button on:click={() => fileInput.click()}>
	<slot>Ajouter</slot>
	<input {name} {required} type="file" bind:this={fileInput} />
</button>

<style>
  button {
    display: flex;
    align-items: center;
    outline: none;
    background-color: lightgray;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    box-shadow: none;
    text-transform: uppercase;
  }
  button input {
    width: 1px;
    height: 1px;
    min-height: 0;
  }
</style>
