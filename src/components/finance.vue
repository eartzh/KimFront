<script setup>
import Button from "primevue/button";
import Card from "primevue/card";
import Select from "primevue/select";
import Chart from "primevue/chart";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { ref, onMounted } from "vue";
import axios from "axios";

const API_URL = "/api/accounting";
const accessToken = $cookies.get("accessToken");
let config = {
    headers: {
        Authorization: accessToken,
    },
};

onMounted(() => {
    if (!accessToken) {
        alert("Please login first");
        location.href = "/";
    } else {
        refreshData();
        getInfo();
    }
});

const products = ref("");

const selectedCity = ref();
const cities = ref([
    { name: "December 2025", code: "202512" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
]);

const getDoughnutData = async () => {
    try {
        const response = await axios.get(`${API_URL}/category`, config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getInfo = async () => {
    try {
        const response = await axios.get(API_URL, config);
        console.log(response.data);
        products.value = response.data;
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const chartData = ref(null);
const chartOptions = ref({
    plugins: {
        legend: {
            display: false,
        },
    },
});

const generateColors = (count) => {
    const backgrounds = [];
    const borders = [];

    for (let i = 0; i < count; i++) {
        const hue = (i * 360) / count; // Evenly space colors around the wheel
        backgrounds.push(`hsl(${hue}, 30%, 60%)`);
        borders.push(`hsl(${hue}, 40%, 45%)`);
    }

    return { backgrounds, borders };
};

const refreshData = async () => {
    const data = await getDoughnutData();
    const labels = Object.keys(data);
    const values = Object.values(data);
    const count = Object.keys(data).length;
    const selectedLabels = labels.slice(0, count);

    const colors = generateColors(count);

    chartData.value = {
        labels: selectedLabels,
        datasets: [
            {
                data: values,
                backgroundColor: colors.backgrounds,
                borderColor: colors.borders,
                borderWidth: 1,
            },
        ],
    };
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
                style="background-color: inherit"
            >
                <template #content>
                    <div class="card flex justify-center">
                        <Chart
                            type="doughnut"
                            :data="chartData"
                            :options="chartOptions"
                            class="w-full md:w-[30rem]"
                        />
                    </div>
                </template>
            </Card>
            <Card
                class="m-5 mr-12 w-full h-[75vh]"
                style="background-color: var(--p-primary-700)"
            >
                <template #content>
                    <!-- <div class="m-5">
                        <Select
                            v-model="selectedCity"
                            :options="cities"
                            optionLabel="name"
                            placeholder="Select a Month"
                            class="w-full md:w-56"
                            size="small"
                        />
                    </div> -->
                    <DataTable
                        :value="products"
                        tableStyle="min-width: 60vh background-color: var(--p-primary-700)"
                    >
                        <Column field="date" header="Date"></Column>
                        <Column field="label" header="Title"></Column>
                        <!-- <Column field="data" header="Info"></Column> -->
                        <Column field="amount" header="Amount"></Column>
                        <Column field="category" header="Catagory"></Column>
                    </DataTable>
                </template>
            </Card>
        </div>
    </div>
</template>
<style>
div {
    --p-datatable-row-background: var(--p-primary-700);
    --p-datatable-header-cell-background: var(--p-primary-700);
}
</style>
