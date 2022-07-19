<div>
  <slot></slot>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  div > * {
    width: 50% !important;
  }
</style>