<script lang="ts">
  import { browser } from '$app/env';
  export let value: string;

  function copyValue() {
    if (browser && navigator.clipboard) navigator.clipboard.writeText(value);
  }
</script>

<button on:click={copyValue}>
  <slot>Copier dans le presse-papiers</slot>
</button>

<style>
  button {
    font-size: 0.75rem;
    max-width: 100px;
    float: right;
  }
</style>