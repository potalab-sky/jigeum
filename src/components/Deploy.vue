<template>
  <div class="deploy-layer">
    <div class="control-layer">
      <input class="btn btn-outline-success btn-sync" type="button"  value="동기화">
      <input class="btn btn-outline-primary btn-deploy" type="button" value="배포" v-on:click="deploy">
      <button class="btn btn-outline-secondary btn-refresh" value="갱신" v-on:click="searchDirectory(curPath)">
        <img class="refresh-img"/>
      </button>
    </div>
<!--    <p>-->
<!--      <input type="button" value="조회" v-on:click="deployListing">-->
<!--    </p>-->
    <div class="path-layer">
      <nav id="path-navi">
        <p id="path-bar">
          <span v-for="(path, idx) in paths" v-bind:key="idx">
            <span class="path-link" v-if="idx !== paths.length-1"
                  v-on:click="searchDirectory(path.val)">{{path.key}}</span>
            <span class="path-cur" v-else>{{path.key}}</span>
            <span v-if="idx !== paths.length-1"> / </span>
          </span>
        </p>
      </nav>
    </div>
    <div class="directory-layer" @drop.prevent="dropFile" @dragover.prevent v-on:drag="console.log('drag')">
      <table class="directory-table">
  <!--      <thead></thead>-->
        <tbody>
          <tr v-for="val in dirList" v-bind:key="val.path">
            <td>
              <input type="checkbox" class="form-check-input" v-on:click="addDeployPath(val.path)">
            </td>
            <td>{{val.type}}<td>
            <td>
              <span v-if="val.type!=='file'"  v-on:click="directoryListing(val.path)">{{val.path}}</span>
              <span v-else>{{val.path}}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Deploy',
  props: {
    hostMap: Map
  },
  data() {
    return {
      curPath: '/',
      paths: [],
      dirList: [],
      deployList: [],
      dropFileName: ''
    }
  },
  mounted() {
    this.directoryListing('');
    // this.$on('deployLoad', onload);
  },
  methods: {
    dropFile(event) {
      let droppedItems = event.dataTransfer.items;
      if (!droppedItems) return;

      for (let i = 0; i < droppedItems.length; ++i) {
        this.upload(droppedItems[i].webkitGetAsEntry(), this.curPath);
      }
    },
    upload(entryItem, path) {
      if (entryItem.isDirectory) {
        console.log("Directory[+ " + entryItem.name + "]forEach before");
        this.uploadDirectory(entryItem.createReader(), path + "/" + entryItem.name);
        return;
      }
      this.uploadFile(entryItem, path);
    },
    uploadFile(entryItem, path) {
      entryItem.file(file=> {
        this.requestFile(entryItem.name, path, file);
      });
    },
    async requestFile(name, path, file, callback) {
      let formData = new FormData();
      formData.append(name, file);
      try {
        let res = await axios.post("/upload", formData, {
          params: {
            dir: path
          },
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (res.data.res === 'error') {
          throw res.data.message;
        }
        if (callback !== undefined) {
          callback();
        }
        console.log("path: " + path + " ``` name: " + name);
      } catch(e) {
        console.log(e);
      }
    },
    uploadFiles(itemReader, entryItems, path, idx) {
      let entryItem = entryItems[idx];
      if (entryItems.length <= idx) {
        if (entryItems.length > 0) {
          this.uploadDirectory(itemReader, path);
        }
        return;
      } else if (entryItem.isDirectory) {
        this.uploadDirectory(entryItem.createReader(), path + "/" + entryItem.name);
        this.uploadFiles(itemReader, entryItems, path, ++idx);
        return;
      }

      entryItem.file(file=> {
        this.requestFile(entryItem.name, path, file, ()=> {
          this.uploadFiles(itemReader, entryItems, path, ++idx);
        });
      });
    },
    uploadDirectory(itemReader, parentPath) {
      itemReader.readEntries(entries=>{
        console.log(entries);
        this.uploadFiles(itemReader, entries, parentPath, 0);
      });
    },

    directoryListing: function(searchText) {
      let data = this.curPath + searchText;
      if (searchText !== "") {
        data += "/"
      }
      console.log(data);
      this.searchDirectory(data);
    },
    async searchDirectory(path) {
      try {
        let res = await axios.get('/directoryList', {params: {searchText: path}});
        this.dirList = [];
        // console.log("/directoryList: " + res);
        let dataList = res.data.dirList;
        for (let i = 0; i < dataList.length; ++i) {
          this.dirList.push(dataList[i]);
        }
        this.paths = [];
        let tempPath = '/';
        this.paths.push({"key": 'home', "val": tempPath});
        let pathSplit = path.split('/');
        for (let i = 1; i < pathSplit.length - 1; ++i) {
          let key = pathSplit[i];
          tempPath += pathSplit[i] + "/";
          let val = tempPath;
          this.paths.push({"key": key, "val": val});
        }
        this.curPath = tempPath;
      } catch(e) {
        console.log("ajax error: /directoryList [" + e + "]");
      }
    },
    addDeployPath(path) {
      let find = this.deployList.indexOf(path);
      if (find === -1) {
        console.log("add");
        this.deployList.push(path);
      } else {
        console.log("delete");
        this.deployList = this.deployList.filter(el=>{
          return el !== path;
        });
      }
      console.log(this.deployList);
    },
    deploy() {
      let len = this.deployList.length;
      for (let i = len-1; i >= 0 ; --i) {
        let deployPath = this.deployList.pop();
        console.log(deployPath);
        this.requestDeploy(deployPath);
      }
    },
    requestDeploy(fileName) {
      axios.post("/deploy", {path: this.curPath + "/" + fileName})
          .then(res=>{
            console.log(res.data);
          }).catch(e=>{
        console.log(e);
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.deploy-layer {
  /*display: flex;*/
  flex-direction: column;
  padding:5px 15px;
  border: 1px solid coral;
}

.control-layer {
  display: flex;
  /*border-bottom: 1px solid #e6e8eb;*/
}
.btn-sync, .btn-deploy, .btn-refresh {
  margin: 10px 5px;
}

.path-layer {
  margin: 10px 0;
}

#path-navi {
  display: flex;
  flex-direction: row;
}
#path-bar {
  padding: 0 10px 0 10px;
}

.directory-table {
  width: 100%;
}

.directory-table>tbody>tr {
  display: flex;
}

#path-bar {
  margin: 0;
}

.path-link {
  color: rgba(82, 74, 62, 0.75);
}
.path-link:hover {
  cursor: pointer;
  color: black;
  text-decoration: underline;
}

.path-cur {
  font-weight: bold;
}

.refresh-img {
  content: url("../assets/refresh_black_24dp.svg");
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

table * {
  font-family: Atlas Grotesk,AtlasGrotesk,sans-serif;
}

tr:hover {
  background-color: rgb(230, 232, 235);
  transition: all 0.2s ease-in-out;
}
tr {
  border-bottom: 1px solid #e6e8eb;
}

td {
  margin: 5px;
}
td > span {
  cursor: pointer;
}
</style>
