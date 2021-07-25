<template>
  <div id="app">
    <div id="menuBoundary">
      <Menu @update:onHostPage="onHostPage" @update:onDeployPage="onDeployPage"></Menu>
    </div>
    <div id="contents">
      <ManagedHost id="managedHost" @update:onHostPage="onHostPage" :class="{'showDisplay':hostDisplay, 'hideDisplay':!hostDisplay}"></ManagedHost>
      <Deploy id="deploy" @update:onDeployPage="onDeployPage" :class="{'showDisplay':deployDisplay, 'hideDisplay':!deployDisplay}"></Deploy>
    </div>
    <div style="flex-grow: 1">
      <host-status></host-status>
    </div>
  </div>
</template>

<script>
import Menu from "@/components/Menu";
import ManagedHost from "@/components/ManagedHost";
import Deploy from "@/components/Deploy";
import HostStatus from "@/components/HostStatus";


export default {
  name: 'App',
  data() {
    return {
      hostDisplay: true,
      deployDisplay: false
    }
  },
  components: {HostStatus, Deploy, ManagedHost, Menu},
  methods: {
    onHostPage() {
      this.hostDisplay = true;
      this.deployDisplay = false;
    },
    onDeployPage() {
      this.hostDisplay = false;
      this.deployDisplay = true;
    }
  }
}
</script>

<style>
.showDisplay {
  display: block;
}

.hideDisplay {
  display: none;
}
/*#deploy {*/
/*  display: none;*/
/*}*/
#contents{
  flex-grow: 2;
  padding: 0 30px;
}
#menuBoundary {
  flex-grow: 0;
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
