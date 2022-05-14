<template>
  <q-list padding separator>
    <q-item
      clickable
      v-ripple
      v-for="menu in menuList"
      :key="menu"
      :to="menu.to"
      active-class="text-primary"
    >
      <q-item-section avatar>
        <q-icon :name="menu.icon" />
      </q-item-section>

      <q-item-section class="iwr-page"> {{ menu.name }} </q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts">
import { TodoListRouter, PomodoroRouter } from "src/enums/routes";
import { defineComponent, ref } from "vue";
import { IMenu } from "./models";

export default defineComponent({
  name: "Menu",

  setup(props, ctx) {
    const menuList = ref<IMenu[]>([
      {
        to: TodoListRouter.Path,
        name: "Todo List",
        icon: "fas fa-list",
      },
      {
        to: PomodoroRouter.Path,
        name: "Pomodoro",
        icon: "far fa-clock",
      },
    ]);

    return { menuList };
  },
});
</script>

<style scoped>
.iwr-page {
  font-family: "Poppins", sans-serif;
}

.menu-item-active-route {
  background-color: rgba(0, 0, 0, 0.3);
  color: #e5f835;
}
</style>
