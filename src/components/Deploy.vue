<template>
  <div class="deploy_layer">
    <div class="control_box">
      <input type="button" value="동기화">
      <input type="button" value="배포" v-on:click="deploy">
    </div>
<!--    <p>-->
<!--      <input type="button" value="조회" v-on:click="deployListing">-->
<!--    </p>-->
    <div class="path_layer">
      <nav id="path_navi">
        <p id="path_bar">
          <span v-for="(path, idx) in paths" v-bind:key="idx">
            <span class="path_link" v-if="idx !== paths.length-1"
                  v-on:click="directoryListingToFullPath(path.val)">{{path.key}}</span>
            <span class="path_cur" v-else>{{path.key}}</span>
            <span v-if="idx !== paths.length-1"> / </span>
          </span>
        </p>
      </nav>
    </div>
    <div class="directory_layer">
      <table class="directory_table">
  <!--      <thead></thead>-->
        <tbody>
          <tr v-for="val in dirList" v-bind:key="val.path">
            <td>
              <input type="checkbox" v-on:click="addDeployPath(val.path)">
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
    msg: String
  },
  data() {
    return {
      searchText: '/',
      paths: [],
      dirList: [],
      deployList: []
    }
  },
  mounted() {
    this.directoryListing('');
  },
  methods: {
    directoryListingToFullPath: function(path) {
      console.log(path);
      this.searchDirectory(path);
    },
    directoryListing: function(searchText) {
      let data = this.searchText + searchText;
      if (searchText !== "") {
        data += "/"
      }
      console.log(data);
      this.searchDirectory(data);
    },
    searchDirectory(path) {
      axios.get('/directoryList', {params:{searchText: path}})
          .then((res)=> {
            this.dirList = [];

            // console.log("/directoryList: " + res);
            let dataList = res.data.dirList;
            for (let i = 0; i < dataList.length; ++i) {
              this.dirList.push(dataList[i]);
            }
            this.paths = [];
            let tempPath = '/';
            this.paths.push({"key":'home', "val":tempPath});
            let pathSplit = path.split('/');
            for (let i = 1; i < pathSplit.length-1; ++i) {
              let key = pathSplit[i];
              tempPath += pathSplit[i] + "/";
              let val = tempPath;
              this.paths.push({"key":key, "val":val});
            }
            this.searchText = path;
          })
          .catch((e)=> {
            console.log("ajax error: /directoryList [" + e + "]");
          });
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
      for (let i = 0; i < len; ++i) {
        console.log(this.deployList.pop());
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.deploy_layer {
  padding:5px 15px;
  border: 1px solid coral;
}

.control_box {
  display: flex;
  justify-content: space-around;
}

#path_navi {
  display: flex;
  flex-direction: row;
}
#path_bar {
  padding: 0 10px 0 10px;
}

.directory_table {
  width: 100%;
}

.directory_table>tbody>tr {
  display: flex;
}

.path_link {
  color: rgba(82, 74, 62, 0.75);
}
.path_link:hover {
  cursor: pointer;
  color: black;
  text-decoration: underline;
}

.path_cur {
  font-weight: bold;
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
