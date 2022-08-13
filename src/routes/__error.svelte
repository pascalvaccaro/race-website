<script context="module">
  /** @type {import('@sveltejs/kit').Load} */
  export function load({ error, status }) {
    return {
      props: {
        title: `${status}: ${error.message}`,
        stack: error.stack || '',
      }
    };
  }
</script>

<script>
  import { dev } from '$app/env';
  export let title;
  export let stack;
</script>

<div>
  <h1>{title}</h1>
  {#if dev}
    <pre>{stack}</pre>
  {/if}
</div>

<style>
  div {
    max-width: 520px;
    min-height: 100vh;
  }
  h1, pre {
    color: white;
  }
</style>