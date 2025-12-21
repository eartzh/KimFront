<script setup>
import Button from "primevue/button";
import Card from "primevue/card";
import Tree from "primevue/tree";
import { ref, onMounted } from "vue";
import axios from "axios";

const API_URL = "/api/notes";

onMounted(() => {
    if (!accessToken) {
        alert("Please login first");
        location.href = "/";
    } else {
        getData();
    }
});

const selectedKey = ref(null);
const targetKey = ref(null);
const nodes = ref(null);
const accessToken = $cookies.get("accessToken");
let config = {
    headers: {
        Authorization: accessToken,
    },
};

const onNodeSelect = (node) => {
    console.log("Selected Name:", node.label);
    targetKey.value = node.key;
    console.log(targetKey.value);
    console.log("Selected Data:", node.data);
};

// const getData = async () => {
//     try {
//         const response = await axios.get(API_URL);
//         console.log(response.data);
//     } catch (error) {
//         console.error(error);
//     }
// };

const getData = async () => {
    try {
        const response = await axios.get(API_URL, config);
        const rawData = response.data;

        // Grouping logic to convert flat array to tree structure
        const treeData = Object.values(
            rawData.reduce((acc, item) => {
                // 1. If the folder group doesn't exist yet, create the parent node
                if (!acc[item.folder]) {
                    acc[item.folder] = {
                        label: item.folder,
                        data: `${item.folder} folder`,
                        icon: "pi pi-fw pi-inbox",
                        children: [],
                    };
                }

                // 2. Add the item as a child of that folder
                acc[item.folder].children.push({
                    key: item.key,
                    label: item.label.trim(), // Remove extra spaces
                    data: item.data.trim(), // Remove extra spaces
                });

                return acc;
            }, {}),
        );

        console.log(treeData);
        nodes.value = treeData;
        return treeData;
    } catch (error) {
        console.error("Error fetching or converting data:", error);
    }
};
</script>
<template>
    <div class="m-5">
        <router-link to="/">
            <Button
                icon="pi pi-arrow-left"
                style="background-color: var(--p-primary-100)"
                rounded
                aria-label="Filter"
            />
        </router-link>

        <div class="flex">
            <Card
                class="m-5 ml-12 w-fit h-[75vh]"
                style="background-color: var(--p-primary-700)"
            >
                <template #content>
                    <Tree
                        :value="nodes"
                        :filter="true"
                        filterMode="strict"
                        class="w-80"
                        style="background-color: var(--p-primary-700)"
                        selectionMode="single"
                        v-model:selectionKeys="selectedKey"
                        @node-select="onNodeSelect"
                    ></Tree>
                </template>
            </Card>
            <Card
                class="m-5 mr-12 w-full h-[75vh]"
                style="background-color: var(--p-primary-700)"
            >
                <template #content>
                    <div v-for="x in nodes" class="m-10">
                        <div v-for="y in x.children">
                            <div v-if="y.key == targetKey">
                                <h1 class="geom text-3xl">{{ y.label }}</h1>
                                <p class="geom mt-4">{{ y.data }}</p>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>
