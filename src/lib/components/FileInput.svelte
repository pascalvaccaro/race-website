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
    align-items: center;
    outline: none;
    border: 1px dashed gray;
    border-radius: 0.8rem;
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    font-weight: bold;
    box-shadow: none;
  }
  button input {
    width: 1px;
    height: 1px;
    min-height: 0;
  }
</style>
