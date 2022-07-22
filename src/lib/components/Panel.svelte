<script lang="ts">
  export let title: string;
  export let value: boolean;
</script>

<div>
  <p data-cy={title} on:click={() => value = !value}>
    {title}
    <span>
      {@html (value ? '&#9660' : '&#9658')}
    </span>
  </p>
  {#if value}
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
    margin: 0.25rem 0;
    width: calc(100% - 32px);
  }
  div > p {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 8px 4px;
    align-items: center;
    flex-shrink: 1;
    width: 100%;
  }
  div > p > span {
    margin-left: 1rem;
  }
  p {
    margin: 0;
  }
</style>