<script lang="ts">
	export let name: string;
	export let value: boolean;
	export let required = false;
</script>

<label class:selected={value} class="box">
	<slot />
	<input {required} type="checkbox" {name} bind:checked={value} />
</label>

<style>
	label.box {
		cursor: pointer;
		background-color: white;
		justify-content: center;
		flex-direction: column;
		text-align: center;
		padding: 8px 16px;
		width: 100%;
		box-sizing: border-box;
	}
	input[type='checkbox'] {
		margin-top: 8px !important;
		box-shadow: none;
	}
	label.selected {
		background-color: lightgray;
	}
</style>
