<script lang="ts">
  export let name: string;
  export let group: boolean;
  export let value: boolean;
</script>

<label class:selected={group === value} class="box">
  <slot />
  <input type="radio" {name} {value} bind:group={group} />
</label>

<style>
  label.box {
		background-color: white;
    justify-content: center;
		flex-direction: column;
		text-align: center;
		padding: 4px 8px;
	}
  input[type=radio] {
    margin-top: 8px !important;
    box-shadow: none;
  }
	label.selected {
		background-color: lightgray;
	}
</style>