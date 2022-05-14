import { boot } from "quasar/wrappers";

import Menu from "src/components/Menu.vue";
import InputContainer from "src/components/InputContainer.vue";

export default boot(({ app }) => {
  app.component("iwr-menu", Menu);
  app.component("r-container", InputContainer);
});
