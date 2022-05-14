<template>
  <q-layout view="hHh LpR lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <router-link class="title iwr-page" to="/"
            >Pós-Graduação Lato Sensu
          </router-link>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      :width="250"
      :breakpoint="300"
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
    >
      <iwr-menu />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white iwr-page">
      <q-toolbar>
        <q-toolbar-title>
          <small>&copy; {{ copyright }} - Empresa LTDA</small>
        </q-toolbar-title>
        <q-space></q-space>
        <small>Powered By {{ author }}</small>
        <strong
          ><small>&nbsp;&nbsp;Version {{ appVersion }}</small></strong
        >
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import pachageInfo from "../../package.json";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const leftDrawerOpen = ref(false);
    const miniState = ref(true);

    return {
      leftDrawerOpen,
      miniState,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      appVersion: pachageInfo.version,
      author: pachageInfo.author,
      copyright: pachageInfo.copyright,
    };
  },
});
</script>

<style scoped>
.title {
  text-decoration: none;
  color: white;
}

.iwr-page {
  font-family: "Poppins", sans-serif;
}
</style>
