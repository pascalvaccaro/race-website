<script lang="ts">
  export let title: string;
  export let value: boolean;
</script>

<div>
  <p on:click={() => value = !value}>
    {title}
    <span>
      {@html (value ? '&#9660' : '&#9658')}
    </span>
  </p>
  {#if value}
    <style>
      * {
        margin-bottom: 8px !important;
      }
    </style>
    <slot />
  {/if}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 4px;
    padding: 8px 16px;
    background-color: rgba(255, 255, 255, 0.65);
  }
  div > p {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 8px 4px;
    margin: 0;
    align-items: center;
    flex-shrink: 1;
  }
</style>