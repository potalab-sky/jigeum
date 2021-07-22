<template>
  <div style="background-color: coral">
    <p>
      <input type="button" value="동기화">
      <input type="button" value="배포">
    </p>
    <p>
      <input type="button" value="조회" v-on:click="deployListing">
    </p>
    <table>
<!--      <thead></thead>-->
      <tbody>
        <tr v-for="(val, idx) in dirList" v-bind:key="val" style="display: flex">
          <td>{{idx+1}}<td>
          <td>{{val.type}}<td>
          <td>{{val.path}}</td>
        </tr>
      </tbody>
    </table>
    deploy
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Deploy',
  props: {
    msg: String,
    dirList: []
  },
  methods: {
    deployListing: function() {
      axios.get('/directoryList', {params:{searchText: '/'}})
        .then((res)=> {
          // clearUl(ul);
          console.log("/directoryList: " + res);
          this.dirList = res.data
          // makeSearchingList(input, ul, result);
        })
        .catch((e)=> {
          console.log("ajax error: /directoryList [" + e + "]");
        });
      // $(function () {
      //   $.ajax({
      //     url: "./directoryList",
      //     type: "get",
      //     datatype: "json",
      //     data: {searchText: input.value},
      //     success: function(result) {
      //       clearUl(ul);
      //       console.log("/directoryList: " + result);
      //       makeSearchingList(input, ul, result)
      //     },
      //     error: function() {
      //       console.log("ajax error: /directoryList");
      //     }
      //   })
      // });
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
</style>
