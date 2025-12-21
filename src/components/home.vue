<script setup>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import tips from "../assets/tips.json";
import axios from "axios";
import { ref } from "vue";

const NOTES_API_URL = "/api/notes";
const FINANCE_API_URL = "/api/accounting";

const tip = tips[Math.floor(Math.random() * tips.length)];
const inputText = ref("");
const accessToken = $cookies.get("accessToken");
let config = {
    headers: {
        Authorization: accessToken,
    },
};

const submit = () => {
    let title = "";
    let content = "";
    let category = "";
    let acc = false;

    if (inputText.value.indexOf("$$") != -1) {
        acc = true;
        inputText.value = inputText.value.replace("$$", "");
    }

    const seperateIndex = inputText.value.indexOf("|||");
    if (seperateIndex != -1) {
        title = inputText.value.substring(0, seperateIndex);
        content = inputText.value.substring(seperateIndex + 3);
    } else {
        title = inputText.value;
        content = "";
    }

    if (title) {
        if (acc) {
            // let digits = title.match(/\d+/g).concat(content.match(/\d+/g));
            const categoryStartIndex = inputText.value.indexOf("[[");
            if (categoryStartIndex != -1) {
                category = inputText.value.substring(
                    categoryStartIndex + 2,
                    inputText.value.indexOf("]]"),
                );
                title = title.replace(`[[${category}]]`, "");
            } else {
                category = "";
            }

            let digits = [
                ...(title.match(/\d+/g) || []),
                ...(content.match(/\d+/g) || []),
            ];
            axios
                .post(
                    FINANCE_API_URL,
                    { title, data: content, amount: digits[0], category },
                    config,
                )
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            axios
                .post(NOTES_API_URL, { title, content }, config)
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }
};

const getNotes = () => {
    axios
        .get(NOTES_API_URL, config)
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
};
</script>

<template>
    <h1 id="mainTitle">Note Something</h1>
    <div id="container">
        <InputText
            type="text"
            style="border-radius: 10vh; margin-right: 2vh; width: 50%"
            placeholder="It's so cute nyaaaaaaa~"
            v-model="inputText"
        />
        <Button
            icon="pi pi-check"
            style="background-color: var(--p-primary-100)"
            rounded
            aria-label="Filter"
            @click="submit()"
        />
        <!-- <Button
            icon="pi pi-check"
            style="background-color: var(--p-primary-100)"
            rounded
            aria-label="Filter"
            @click="getNotes()"
        /> -->
    </div>
    <p id="tips">{{ tip }}</p>
</template>

<style>
#mainTitle {
    padding-top: 25vh;
    text-align: center;
    font-family: "Geom", sans-serif;
    font-optical-sizing: auto;
    font-size: 6vh;
    font-weight: bold;
    font-style: italic;
}
#container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 1vh;
    margin-bottom: 1vh;
}
#tips {
    text-align: center;
    color: gray;
}
</style>
