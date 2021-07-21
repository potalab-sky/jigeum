<template>
  <div id="app">
    <div id="menuBoundary">
      <Menu @update:onHostPage="onHostPage" @update:onDeployPage="onDeployPage"></Menu>
    </div>
    <div>
<!--      <Contents></Contents>-->
      <ManagedHost id="managedHost" @update:onHostPage="onHostPage" v-bind:style="{display: hostDisplay}"></ManagedHost>
      <Deploy id="deploy" @update:onDeployPage="onDeployPage" v-bind:style="{display: deployDisplay}"></Deploy>
    </div>
  </div>
</template>

<script>
import Menu from "@/components/Menu";
import ManagedHost from "@/components/ManagedHost";
import Deploy from "@/components/Deploy";

let hostDisplay = "block";
let deployDisplay = "none";

export default {
  name: 'App',
  data() {
    return {
      hostDisplay: hostDisplay,
      deployDisplay: deployDisplay
    }
  },
  components: {Deploy, ManagedHost, Menu},
  methods: {
    onHostPage() {
      hostDisplay = "block";
      deployDisplay = "none";
    },
    onDeployPage() {
      hostDisplay = "none";
      deployDisplay = "block";
    }
  }
}
</script>

<style>
/*#deploy {*/
/*  display: none;*/
/*}*/
#menuBoundary {
  width: 250px;
  padding: 10px;
  margin-right: 10px;
  /*border-width: 1px;*/
  /*border-color: black;*/
  /*border-right-style: solid;*/
}
#app {
  display: flex;
  height: 100%;
  flex-direction: row;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
