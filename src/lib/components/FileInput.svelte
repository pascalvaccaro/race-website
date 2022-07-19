<script lang="ts">
	export let name: string;
	let fileInput: any;
</script>

<button on:click={() => fileInput.click()}>
	<slot>Upload</slot>
	<input {name} type="file" bind:this={fileInput} style="display:none" />
</button>

<style>
  button {
    outline: none;
    border: 2px dashed gray;
    border-radius: 0.8rem;
    padding: 1rem;
    margin: 0 1rem;
    font-weight: bold;
  }
</style>
