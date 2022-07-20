<script lang="ts">
	export let name: string;
  export let required: boolean;
	let fileInput: any;
</script>

<button on:click={() => fileInput.click()}>
	<slot>Upload</slot>
	<input {name} {required} type="file" bind:this={fileInput} />
</button>

<style>
  button {
    display: flex;
    outline: none;
    border: 2px dashed gray;
    border-radius: 0.8rem;
    padding: 1rem;
    margin: 0 1rem;
    font-weight: bold;
  }
  button input {
    width: 1px;
    height: 1px;
    min-height: 0;
  }
</style>
