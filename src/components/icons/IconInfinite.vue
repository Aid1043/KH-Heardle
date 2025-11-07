<script setup lang="ts">

</script>

<template>
  <img src="https://i.imgur.com/uuaLiEE.png" alt="Mario Heardle Infinite">
</template>

<style scoped>
img {
  height: 30px !important;
  width: 30px !important;
  display: initial;
  -webkit-animation: wiggle 2s infinite;
  animation: wiggle 2s infinite;

  margin-bottom: 0.25rem;
  margin-right: 0.5rem;

  max-width: 100%;
  vertical-align: middle;

  border-style: solid;
}

@keyframes wiggle {
  0% {
    transform: rotate(0) scale(1)
  }
  60% {
    transform: rotate(0) scale(1)
  }
  75% {
    transform: rotate(0) scale(1.12)
  }
  80% {
    transform: rotate(0) scale(1.1)
  }
  84% {
    transform: rotate(-10deg) scale(1.1)
  }
  88% {
    transform: rotate(10deg) scale(1.1)
  }
  92% {
    transform: rotate(-10deg) scale(1.1)
  }
  96% {
    transform: rotate(10deg) scale(1.1)
  }
  100% {
    transform: rotate(0) scale(1)
  }
}
</style>