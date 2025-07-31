<template>
  <div
    class="w-full overflow-hidden relative rounded-4xl cursor-pointer border-1 bg-card-bg"
    :class="[borderColor]"
  >
    <div class="w-full rounded-t-4xl p-6 bg-card-bg flex flex-col gap-4">
      <!-- Header -->
      <div class="flex items-center mb-4">
        <NuxtImg
          src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          width="40"
          height="40"
          class="mr-3"
        />
        <div class="flex flex-col gap-2">
          <h2 class="text-lg font-bold">Интернет магазин на Wordpress</h2>
          <p class="text-sm text-gray-400 overflow-ellipsis line-clamp-2">
            Необходимо сделать интернет магазин на Wordpress с нуля для продажи
            товаров Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est minima
            iste corporis. Voluptate sapiente expedita, delectus impedit neque
            porro repellat necessitatibus ut odit assumenda iure perferendis
            nobis. Totam doloremque velit reprehenderit quam voluptates magni
            quaerat ad laudantium placeat natus! Vitae, ipsa repellat. Accusamus
            quis alias hic reprehenderit iste corrupti, quia pariatur placeat
            assumenda aliquid asperiores consequuntur nemo quam sequi! Velit
            nostrum modi at voluptas expedita laboriosam earum reprehenderit,
            commodi minima laudantium? Deserunt nesciunt itaque vitae atque!
            Consequuntur unde, vero sequi illum tempore voluptatum mollitia
            obcaecati placeat quaerat. Asperiores, rerum! Dignissimos, ex minus
            perspiciatis distinctio placeat provident consequuntur dolore optio
            soluta illum ut accusantium repellat. Recusandae iste ipsum magni
            dignissimos, vitae consequatur sint molestiae voluptas nisi, maiores
            eum similique ipsa! Illum tempora excepturi neque aliquid recusandae
            distinctio, quo odio. Quasi voluptates ad repudiandae nobis! Ut,
            quod. Earum, accusamus facilis facere blanditiis doloribus enim quo
            corrupti consequuntur sit possimus amet obcaecati delectus omnis
            magni quia maiores eaque placeat eius? Voluptas necessitatibus ea
            eaque sunt optio numquam voluptate aliquid commodi odio
            reprehenderit explicabo, cumque adipisci quasi at, consequatur
            dignissimos quos dolore. Esse harum voluptatum animi quisquam
            perspiciatis facere explicabo nulla voluptate praesentium cum ullam
            quo voluptatem adipisci id repudiandae culpa inventore temporibus,
            architecto quam enim possimus quia. Eaque voluptate nulla, ipsum
            iure repellendus molestias rerum dicta dolor. Totam ducimus
            consequuntur aspernatur, excepturi sit eum nesciunt doloribus earum
            sint vero exercitationem placeat, molestias harum qui repellendus?
            Eos doloremque officiis maiores velit eum molestias magni labore
            animi earum quo, voluptas ipsa fugit, veniam quas et, eveniet
            nostrum rerum blanditiis error dolor totam. Ex laboriosam quibusdam
            animi quidem quia! Quasi eaque voluptate delectus eum ad culpa in
            recusandae, cum quibusdam odio dolore soluta quaerat itaque quae
            veritatis voluptatibus blanditiis ipsa similique cupiditate natus
            non, dolores consequuntur velit laboriosam. Perferendis aut sequi
            illo ducimus blanditiis quos sit.
          </p>
          <div class="flex mt-3 flex-col w-fit gap-2">
            <UBadge
              icon="material-symbols:location-on-outline-rounded"
              size="md"
              color="success"
              class="border-1 border-white bg-none rounded-3xl"
              >Russia, Moscow</UBadge
            >
            <UBadge
              icon="material-symbols:clock-loader-40"
              size="md"
              color="success"
              class="border-1 border-white bg-none rounded-3xl"
              >1-3 дня</UBadge
            >
          </div>
        </div>
      </div>
      <div class="flex justify-end">
        <UButton
          color="success"
          class="rounded-xl flex gap-2 font-medium text-sm px-4 mobile:w-full mobile:justify-center hover:scale-105 transition-all duration-200"
          >Откликнуться
          <UIcon
            name="material-symbols:arrow-forward-ios-rounded"
            class="text-black"
          />
        </UButton>
      </div>
    </div>
    <div
      class="w-full bg-card-bg rounded-b-4xl max-h-[50px] p-6 flex items-center gap-2 justify-between text-black dark:bg-white"
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
      return "border-success";
    case "medium":
      return "border-yellow";
    case "hard":
      return "border-red";
    default:
      return "border-blue";
  }
});
</script>
