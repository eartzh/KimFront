<script setup>
import MegaMenu from "primevue/megamenu";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import axios from "axios";
import { ref, onMounted } from "vue";

const accDialogVisible = ref(false);
const loginIcon = ref("");
const logoutIcon = ref("");
const serverStatusIcon = ref("pi pi-spin pi-spinner");
const API_URL = "/api";

onMounted(async () => {
    await checkServerStatus();
});

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const checkServerStatus = async () => {
    try {
        const response = await axios.get(`${API_URL}/health`);
        if (response.status === 200) {
            serverStatusIcon.value = "pi pi-server";
        } else {
            serverStatusIcon.value = "pi pi-times";
        }
    } catch (error) {
        console.error(error);
        await sleep(5000);
        await checkServerStatus();
    }
};

const accessToken = $cookies.get("accessToken");
if (accessToken) {
    loginIcon.value = "pi pi-user";
    logoutIcon.value = "pi pi-sign-out visible";
} else {
    loginIcon.value = "pi pi-sign-in";
    logoutIcon.value = "hidden";
}

const items = ref([
    {
        label: "Home",
        route: "/",
    },
    {
        label: "Notes",
        route: "/notes",
    },
    {
        label: "Finance",
        route: "/finance",
    },
]);

const username = ref("");
const password = ref("");

const register = async () => {
    accDialogVisible.value = false;
    try {
        const response = await axios.post(`${API_URL}/users`, {
            username: username.value,
            password: password.value,
        });
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

const login = async () => {
    accDialogVisible.value = false;
    try {
        const response = await axios.get(`${API_URL}/users`, {
            params: {
                username: username.value,
                password: password.value,
            },
        });
        $cookies.set("accessToken", response.data);
        console.log("Logged in");
        location.reload();
    } catch (error) {
        console.error(error);
    }
};

const logout = async () => {
    try {
        $cookies.remove("accessToken");
        await axios.delete(`${API_URL}/users`, {
            params: {
                token: accessToken,
            },
        });
        console.log("Logged out");
        location.reload();
    } catch (error) {
        console.log(error);
    }
};
</script>

<template>
    <router-view />

    <div style="position: absolute; bottom: 1vh; width: 95%; margin: 2%">
        <MegaMenu
            :model="items"
            class="p-4 bg-surface-0"
            style="border-radius: 3rem"
        >
            <template #start>
                <i
                    :class="serverStatusIcon"
                    style="font-size: 2vh; margin: 1vh"
                ></i>
            </template>
            <template #item="{ item }">
                <router-link
                    v-if="item.route"
                    v-slot="{ href, navigate }"
                    :to="item.route"
                    custom
                >
                    <a v-ripple :href="href" @click="navigate">
                        <span class="font-2 geom">{{ item.label }}</span>
                    </a>
                </router-link>
            </template>
            <template #end>
                <i
                    :class="logoutIcon"
                    style="font-size: 2vh; margin: 1vh"
                    @click="logout()"
                    v-ripple
                ></i>
                <i
                    :class="loginIcon"
                    style="font-size: 2vh; margin: 1vh"
                    @click="accDialogVisible = true"
                    v-ripple
                ></i>
            </template>
        </MegaMenu>
    </div>

    <Dialog
        v-model:visible="accDialogVisible"
        modal
        header="Log in or Register"
        :style="{ width: '25rem' }"
    >
        <!-- <span class="text-surface-500 dark:text-surface-400 block mb-8"
            >Update your information.</span
        > -->
        <div class="flex items-center gap-4 mb-4">
            <label for="username" class="font-semibold w-24">Username</label>
            <InputText
                id="username"
                v-model="username"
                autocomplete="off"
                fluid
            />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <label for="password" class="font-semibold w-24">Password</label>
            <Password
                id="password"
                v-model="password"
                autocomplete="off"
                fluid
            />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Register" @click="register"></Button>
            <Button
                type="button"
                label="Cancel"
                severity="secondary"
                @click="accDialogVisible = false"
            ></Button>
            <Button type="button" label="Login" @click="login"></Button>
        </div>
    </Dialog>
</template>
