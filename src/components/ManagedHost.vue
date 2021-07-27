<template>
  <div class="hostContainer">
    <div style="min-width: 650px;">
      <div id="newHostBtn" v-on:click="makeHost" v-bind:style="newHostBtnStyle">
        <span>+</span>
      </div>
      <div class="hostLayer" v-bind:style="hostInputLayerStyle">
        <div class="hostInnerWrap">
          Name <input id="newName" class="form-control" type="text" v-model="newName">
          Host <input id="newHost" class="form-control" type="text" v-model="newHost">
          <input id="connHostBtn" class="btn btn-success" type="button" value="연결" v-on:click="connectHost">
        </div>
      </div>
      <div class="hostLayer" v-for="([key, val], idx) in Array.from(hostMap)" v-bind:key="idx">
        <div class="hostInnerWrap">
          <span class="hostName">Name: {{key}}</span>
          <span class="host">Host: {{val}}</span>
          <input type="button" class="btn btn-danger removeBtn" value="해제" v-on:click="deconnectHost(key)">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from "axios";

import axios from "axios";

export default {
  name: "ManagedHost",
  data() {
    return {
      newName: "test",
      newHost: "localhost:2505",
      hostInputLayerStyle: {
        display: "none"
      },
      newHostBtnStyle: {
        display: "flex"
      }
    }
  },
  props: {
    hostMap: Map
  },
  methods: {
    makeHost: function() {
      this.hostInputLayerStyle.display = "flex";
      this.newHostBtnStyle.display = "none";
    },
    connectHost: function() {
      console.log(this.hostMap);
      if (this.hostMap.has(this.newName)) {
        alert("same host name.");
        return;
      }
      axios.get("./connect", {params:{name: this.newName, host: this.newHost}})
      .then(res=> {
        if (res.data.result === "success") {
          this.addHost();
        }
        console.log(res.data.message);
      })
      .catch(e=> {
        console.log(e);
      });
    },
    addHost: function() {
      this.hostMap.set(this.newName, this.newHost);
      this.hostInputLayerStyle.display = "none";
      this.newHostBtnStyle.display = "flex";
      this.newName = "";
      this.newHost = "";
    },
    deconnectHost: function(name) {
      this.hostMap.delete(name);
      this.$forceUpdate();
    }
  }
}
</script>

<style scoped>
.hostContainer {
  /*width: auto;*/
  max-width: 800px;
  padding: 0 15px;
  margin: auto;
}
.hostContainer #text-result {
  margin: 20px 0;
}

#newHostBtn, .hostLayer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100px;
  background-color: rgb(217, 237, 247);
  margin: 10px;
  /*padding: 20px;*/
  text-align: center;
  vertical-align: middle;
  border-radius: 5px;
}

.hostInnerWrap {
  padding-right: 10px;
}

.hostName, .host {
  font-size: 1.2em;
  margin: 0;
}

#newHostBtn:hover {
  cursor: pointer;
  background-color: #337ab7;
  transition: all 0.5s ease-in-out;
}
.hostLayer:hover {
  color: white;
  background-color: #337ab7;
  transition: all 0.5s ease-in-out;
}

.hostListWrap:hover span {
  color: white;
}

#newHostBtn:hover span {
  color: white;
  transition: all 0.2s ease-in-out;
}

#newHostBtn span {
  color: white;
}

/*#hostList {*/
/*  display: inline-block;*/
/*  min-width: 650px;*/
/*}*/

#newName {
  margin-right: 10px;
}

#newHostBtn:active {
  transform : translateY(3px);
}

#newHostBtn span {
  cursor: default;
  font-size: 35px;
  color: #000000;
}

#connHostBtn {
  display: inline-block;
  float: right;
}

.form-control {
  display: inline-block;
  width: 35%;
}

.removeBtn {
  float: right;
}
</style>