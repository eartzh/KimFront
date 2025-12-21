import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import Ripple from "primevue/ripple";
import VueCookies from "vue-cookies";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import { router } from "./router.js";

const preset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{neutral.50}",
      100: "{neutral.100}",
      200: "{neutral.200}",
      300: "{neutral.300}",
      400: "{neutral.400}",
      500: "{neutral.500}",
      600: "{neutral.600}",
      700: "{neutral.700}",
      800: "{neutral.800}",
      900: "{neutral.900}",
      950: "{neutral.950}",
    },
  },
  components: {
    card: {
      root: {
        border: {
          radius: "2rem",
        },
      },
    },
  },
});

const app = createApp(App);
app.use(router);
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: preset,
  },
});
app.use(VueCookies);
app.directive("ripple", Ripple);

app.mount("#app");
