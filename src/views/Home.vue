<template>
<div class="header">
    <Header></Header>
    <div class="content">
        <router-view></router-view>
    </div>
</div>
</template>

<script lang="ts" setup>
import Header from '../components/Header.vue';


</script>

<style lang="scss" scoped>

.header {
    .content {
        margin-top: 44px
    }
}
</style>