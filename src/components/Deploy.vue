<template>
  <div style="padding:5px 15px;border: 1px solid coral">
    <div style="display: flex; justify-content: space-around;">
      <input type="button" value="동기화">
      <input type="button" value="배포">
    </div>
<!--    <p>-->
<!--      <input type="button" value="조회" v-on:click="deployListing">-->
<!--    </p>-->
    <nav style="display: flex; flex-direction: row">
      <p>deploy root: </p>
      <p style="padding: 0 10px 0 10px">
        <span v-for="(path, idx) in paths" v-bind:key="idx" v-on:click="directoryListingToFullPath(path.val)" style="padding-right: 5px;">{{path.key}}</span>
<!--        <span v-on:click="deployListing('../')">{{searchText}}</span>-->
      </p>
    </nav>
    <table>
<!--      <thead></thead>-->
      <tbody>
        <tr v-for="(val, idx) in dirList" v-bind:key="val.path" style="display: flex">
          <td>{{idx+1}}</td>
          <td>{{val.type}}<td>
          <td>
            <span v-if="val.type!='file'"  v-on:click="directoryListing(val.path)">{{val.path}}</span>
            <span v-else>{{val.path}}</span>
          </td>
        </tr>
      </tbody>
    </table>
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
      dirList: []
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
            this.paths.push({"key":'/', "val":tempPath});
            let pathSplit = path.split('/');
            for (let i = 1; i < pathSplit.length; ++i) {
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
