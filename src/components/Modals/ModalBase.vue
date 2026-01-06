<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import IconX from "@/components/icons/IconX.vue";

const emit = defineEmits(['close']);
const props = defineProps<{
  wide?: boolean
  update?: boolean
  menu?: boolean
}>();

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    emit("close");
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div id="modal-background" class="modal-background">
    <div class="modal max-w-screen-xs mx-auto" :class="{ 'modal-wide': wide, 'modal-update': update, 'modal-menu': menu}">
      <div class="title">
        <div class="subtitle">
          <h2 id="modal-title">about</h2>
        </div>
        <div class="close-button">
          <button class="border-none text-custom-mg" v-on:click="emit('close')">
            <IconX/>
          </button>
        </div>
      </div>
      <div class="text">
        <slot/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  display: flex;

  justify-content: center;
  align-items: center;

  margin-bottom: 1.5rem;
}

.subtitle{
  flex: 1 1 0%;
  padding-left: 1.75rem;
}

.close-button{
  display: flex;
  justify-self: end;
}

.close-button button{
  color: var(--color-mg);
  border-style: none;
  cursor: pointer;
}

.close-button button svg{
  width: 1.75rem;
  height: 1.75rem;
}

.subtitle h2 {
  text-indent: 0.25em;
  color: var(--color-line);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 10;
  font-size: 1.75rem;
  line-height: 1.75rem;
  text-align: center;
  font-family: mediumfont;
}

.modal{
  border-radius: 0.125rem;
  width: 100%;
  max-width: 600px;
  top: 5rem;
  position: relative;
  pointer-events: auto;

  background: var(--color-modal-bg);

  border-color: var(--color-modal-border);
  border-width: 1px;

  padding: 1.5rem;
}

.modal.modal-update {
  background-color: #BC93C7;
  color: black;
}
.modal.modal-update .subtitle h2 {
  color: black;
}

.modal.modal-wide {
  max-width: 900px;
}

.modal-background{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
  z-index: 1000;
}
</style>