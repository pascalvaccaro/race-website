<script lang="ts">
  export let title = '';
  export let value: boolean;

  const isBool = typeof value === 'boolean';
</script>

<div data-cy={title}>
  <p on:click={isBool ? () => (value = !value) : undefined}>
    <slot name="title">{title}</slot>
    <slot name="action">
      <span>
        {@html (value ? '&#9660' : '&#9658')}
      </span>
    </slot>
  </p>
  {#if value || !isBool}
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