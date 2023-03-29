<template>
  <div>
    <TableComponent/>
    <hr>
    <HelloWorld/>
  </div>
</template>

<script>
import HelloWorld from './components/Component.vue'
import TableComponent from './components/Table.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    TableComponent
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
