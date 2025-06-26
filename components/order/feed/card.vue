<template>
  <div
    class="w-full overflow-hidden shadow-lg relative rounded-4xl hover:duration-300 hover:scale-[99%] hover:transform cursor-pointer border-1"
    :class="[borderColor]"
  >
    <div class="w-full rounded-t-4xl p-6 shadow-lg dark:bg-default bg-accented">
      <!-- Header -->
      <div class="flex items-center mb-4">
        <div
          class="w-10 h-10 bg-white text-black font-bold text-center rounded-md flex items-center justify-center mr-3"
        >
          G
        </div>
        <div>
          <h2 class="text-lg font-bold">Sr. UX Designer</h2>
          <p class="text-sm">Google</p>
          <div class="flex mt-3">
            <UBadge
              icon="material-symbols:location-on-outline-rounded"
              size="md"
              class="border-1 border-white bg-none rounded-3xl"
              >Russia, Moscow</UBadge
            >
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-full bg-black rounded-b-4xl max-h-[50px] p-6 flex items-center gap-2 justify-between text-white dark:bg-white dark:text-black"
    >
      <div class="flex items-center gap-2">
        <UIcon
          name="material-symbols:history-rounded"
          class="text-black dark:bg-black bg-white"
        />
        <p class="text-sm dark:text-black">Posted 2 days ago</p>
      </div>
      <div class="flex items-center gap-2">
        <p class="text-xl dark:text-black font-bold">3,000₽</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inverted-radius {
  --r: 20px; /* the radius */
  --s: 30px; /* size of inner curve */
  --x: 20px; /* horizontal offset (no percentage) */
  --y: 10px; /* vertical offset (no percentage) */

  width: 100%;
  /* aspect-ratio: 1; */
  border-radius: var(--r);
  --_m: /calc(2 * var(--r)) calc(2 * var(--r)) radial-gradient(#000 70%, #0000
        72%);
  --_g: conic-gradient(at calc(100% - var(--r)) var(--r), #0000 25%, #000 0);
  --_d: (var(--s) + var(--r));
  mask: calc(100% - var(--_d) - var(--x)) 0 var(--_m),
    100% calc(var(--_d) + var(--y)) var(--_m),
    radial-gradient(var(--s) at 100% 0, #0000 99%, #000 calc(100% + 1px))
      calc(-1 * var(--r) - var(--x)) calc(var(--r) + var(--y)),
    var(--_g) calc(-1 * var(--_d) - var(--x)) 0,
    var(--_g) 0 calc(var(--_d) + var(--y));
  mask-repeat: no-repeat;
}
</style>
<script setup lang="ts">
import { computed } from "vue";

type Complexity = "easy" | "medium" | "hard";

interface IOrder {
  complexity: Complexity;
  // можно добавить другие поля в будущем
}

const props = defineProps<{
  order: IOrder;
}>();

const borderColor = computed(() => {
  switch (props.order.complexity) {
    case "easy":
      return "border-blue";
    case "medium":
      return "border-yellow";
    case "hard":
      return "border-red";
    default:
      return "border-blue";
  }
});
const colorTaskText = computed(() => {
  switch (props.order.complexity) {
    case "easy":
      return "text-white";
    case "hard":
      return "text-white";
    default:
      return "text-black";
  }
});
</script>
