<template>
  <q-page class="q-pa-sm items-start q-gutter-sm iwr-page">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title class="text-subtitle1">
        {{ getPageTitle }}
      </q-toolbar-title>
    </q-toolbar>

    <q-card bordered>
      <q-card-section>
        <r-container
          :required="true"
          class="col-12 col-lg-12 col-md-12"
          :label="'Tarefa / Atividade'"
        >
          <q-input
            class="field-container-content"
            outlined
            dense
            v-model="taskForm.description"
            @keyup.enter="addTask"
            color="primary"
            placeholder="Informe a descrição da Tarefa/Atividade"
          >
          </q-input>
        </r-container>
      </q-card-section>
    </q-card>
    <q-card bordered>
      <q-card-section>
        <q-scroll-area
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
          style="height: 350px"
          v-if="tasks.length"
        >
          <q-list padding>
            <div v-for="(task, i) in tasks" :key="i">
              <q-item
                :active="task.todo"
                tag="label"
                v-ripple
                active-class="text-green"
              >
                <q-item-section side top>
                  <q-toggle
                    v-model="task.todo"
                    :val="task.todo"
                    :color="task.todo ? 'green' : 'red'"
                    @click="sincronizeTask()"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Atividade Nº{{ i + 1 }}</q-item-label>
                  <q-item-label caption> {{ task.description }} </q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-btn
                    class="gt-xs"
                    size="14px"
                    flat
                    dense
                    round
                    icon="delete"
                    color="red"
                    @click="deleteTask(task)"
                  />
                </q-item-section>
              </q-item>

              <q-separator />
            </div>
          </q-list>
        </q-scroll-area>
        <div v-else>Sem Atividades</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { uid, useQuasar } from "quasar";
import { defineComponent, computed, ref, onBeforeMount } from "vue";
import { useRoute } from "vue-router";

interface ITaskForm {
  id: string;
  description: string;
  todo: boolean;
}

export default defineComponent({
  name: "TodoList",

  setup() {
    const $q = useQuasar();
    const $route = useRoute();
    const taskStorageKey = "@@tasks";
    const tasks = ref<ITaskForm[]>([]);
    const taskFormBase = () => ({
      id: "1",
      description: "",
      todo: false,
    });
    const taskForm = ref<ITaskForm>(taskFormBase());

    const addTask = () => {
      if (taskForm.value.description.length) {
        const taskTemp = { ...taskForm.value, id: uid() };

        tasks.value.push(taskTemp);

        localStorage.setItem(taskStorageKey, JSON.stringify(tasks.value));

        taskForm.value = taskFormBase();
      }
    };

    const deleteTask = (task: ITaskForm) => {
      $q.loading.show({ message: "Deletando Task: " + task.id });

      const index = tasks.value.indexOf(task);

      setTimeout(() => {
        tasks.value.splice(index, 1);

        localStorage.setItem(taskStorageKey, JSON.stringify(tasks.value));

        $q.loading.hide();

        $q.notify({
          message: `Tarefa ${task.id} Excluída com sucesso!`,
          type: "positive",
        });
      }, 500);
    };

    const loadTasks = () => {
      const tasksStorage = localStorage.getItem(taskStorageKey);

      tasksStorage ? (tasks.value = JSON.parse(tasksStorage)) : [];
    };

    const sincronizeTask = () =>
      localStorage.setItem(taskStorageKey, JSON.stringify(tasks.value));

    onBeforeMount(() => loadTasks());

    return {
      getPageTitle: computed(() => $route.meta.title),
      taskForm,
      deleteTask,
      addTask,
      tasks,
      sincronizeTask,

      thumbStyle: {
        right: "4px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "5px",
        opacity: 0.75,
      },

      barStyle: {
        right: "2px",
        borderRadius: "9px",
        backgroundColor: "#027be3",
        width: "9px",
        opacity: 0.2,
      },
    };
  },
});
</script>

<style lang="sass" scoped>
.field-container-content
  padding: 8px 0
</style>
