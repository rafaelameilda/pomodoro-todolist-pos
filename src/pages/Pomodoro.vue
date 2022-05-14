<template>
  <q-page class="q-pa-sm items-start q-gutter-sm iwr-page">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title class="text-subtitle1">
        {{ getPageTitle }}
      </q-toolbar-title>
    </q-toolbar>

    <q-card bordered class="text-center text-black text-bold">
      <q-card-section>
        Escolha sua opção de Tempo:
        <q-option-group
          v-model="timeChoose"
          :options="timeOptions"
          color="primary"
          inline
        />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-circular-progress
          show-value
          :max="initialTime"
          :value="totalTime"
          size="20rem"
          :thickness="0.13"
          :color="timerColor"
        >
          <span :class="`text-${timerColor}`">{{ minutes }}:{{ seconds }}</span>
        </q-circular-progress>
      </q-card-section>

      <q-separator />

      <q-card-actions align="center">
        <q-btn
          flat
          v-if="!pauseButton"
          size="15px"
          label="Start"
          stack
          icon="play_arrow"
          @click="startTimer"
        ></q-btn>
        <q-btn
          flat
          size="15px"
          label="Pause"
          @click="pauseTimer"
          v-if="pauseButton"
          stack
          icon="pause"
        ></q-btn>
        <q-btn
          v-show="resetButton"
          flat
          size="15px"
          label="Reset"
          @click="resetTimer"
          stack
          icon="restore"
        ></q-btn>
      </q-card-actions>
    </q-card>
    <audio ref="notification" src="/sounds/steam_notification.mp3"></audio>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import BrowserNotifications from "src/mixins/BrowserNotifications.vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "Pomodoro",

  mixins: [BrowserNotifications],

  watch: {
    timeChoose() {
      this.resetTimer();
    },
    totalTime() {
      if (this.totalTime === 0 && this.notification) {
        this.notification.play();
        this.showNotification("O tempo Acabou!", "", "pomodoro.png");
      }
    },
  },

  setup() {
    const $route = useRoute();
    const timer = ref<any>(null); // REFERENCIA DO SET TIMEOUT
    const timeChoose = ref(5); // HORA ESCOLHIDA
    const pauseButton = ref(false); // VISIBILIDADE PAUSE
    const resetButton = ref(false); // VISIBILIDADE RESET
    const totalTime = ref(5 * 60); // TEMPO TOTAL EM SEGUNDOS
    const timeOptions = ref([
      { label: "Pomodoro", value: 25 },
      { label: "Parada Curta", value: 5 },
      { label: "Parada Longa", value: 10 },
    ]);
    const notification = ref<HTMLVideoElement>(); // REFERENCIA DO AUDIO

    // VALOR MÁXIMO CALCULADO PARA A % DO GRÁFICO
    const initialTime = computed({
      get: () => timeChoose.value * 60,
      set: (value) => value,
    });

    // MIUTOS RESTANTES RESTANTE CALCULADO
    const minutes = computed({
      get: () => {
        const minutes = Math.floor(totalTime.value / 60);

        return padTime(minutes);
      },
      set: (value) => value,
    });

    // SEGUNDOS RESTANTES CALCULADO
    const seconds = computed({
      get: () => {
        const seconds = totalTime.value - Number(minutes.value) * 60;

        return padTime(seconds);
      },
      set: (value) => value,
    });

    // COR CALCULADA
    const timerColor = computed({
      get: () => {
        const value = totalTime.value / 60;

        return value <= 3.125
          ? "negative"
          : value <= 6.25
          ? "orange"
          : value <= 12.5
          ? "secondary"
          : "green";
      },
      set: () => {},
    });

    const startTimer = () => {
      timer.value = setInterval(() => countDown(), 50); // RODANDO EM 50 MS
      resetButton.value = true; // MOSTRANDO OS BOTÕES
      pauseButton.value = true; // MOSTRANDO OS BOTÕES
    };

    //FUNÇÃO REGRESSIVA DO VALOR
    const countDown = () => {
      if (totalTime.value >= 1) {
        totalTime.value--;
      } else {
        totalTime.value = 0;
        resetTimer();
      }
    };

    const resetTimer = () => {
      totalTime.value = timeChoose.value * 60; // IGUAL OPÇÃO SELECIONADA EM SEGUNDOS
      clearInterval(timer.value); // ZERANDO O INTERVAL
      timer.value = null; // ZERANDO O INTERVAL
      resetButton.value = false; // ESCONDENDO OS BOTÕES
      pauseButton.value = false; // ESCONDENDO OS BOTÕES
    };

    const pauseTimer = () => {
      pauseButton.value = false; // ESCONDENDO OS BOTÕES
      clearInterval(timer.value); // ZERANDO O INTERVAL
      timer.value = null; // ZERANDO O INTERVAL
      resetButton.value = true; // MOSTRANDO OS BOTÕES
    };

    const padTime = (time: number) => (time < 10 ? "0" : "") + time; // 0 A ESQUERDA

    return {
      timeOptions,
      initialTime,
      pauseTimer,
      minutes,
      resetButton,
      seconds,
      timerColor,
      startTimer,
      pauseButton,
      timeChoose,
      resetTimer,
      totalTime,
      notification,
      getPageTitle: computed(() => $route.meta.title),
    };
  },
});
</script>
