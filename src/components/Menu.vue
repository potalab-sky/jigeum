<template>
  <div class="boundary">
    <div class="menu-layer">
      <div class="line-top"></div>
      <div class="line-middle"></div>
      <div class="line-bottom"></div>
    </div>
    <p v-on:click="onHostPage">호스트 추가</p>
    <p v-on:click="onDeployPage">파일 배포</p>
  </div>
</template>

<script>
export default {
  name: "Menu",
  methods: {
    onHostPage() {
      this.$emit('update:onHostPage')
    },
    onDeployPage() {
      this.$emit('update:onDeployPage')
    }
    // menuClick(e) {
    //   e.target;
    // }
  }
}
</script>

<style scoped>
.boundary {
  display: flex;
  flex-direction: column;
}
.menu-layer {
  position: relative;
  margin-left: auto;
  /*float: right;*/
  height: 28px;
  width: 36px;
  cursor: pointer;
}

.menu-layer .line-top,
.menu-layer .line-middle,
.menu-layer .line-bottom {
  position: absolute;
  display: block;
  height: 4px;
  width: 36px;
  border-radius: 2px;
  background: #000000;
}

.menu-layer .line-top {
  top: 0;
  -webkit-transform-origin: 34px 2px;
  transform-origin: 34px 2px;
}

.menu-layer .line-middle {
  top: 12px;
  -webkit-transition: opacity 200ms linear;
  transition: opacity 200ms linear;
}

.menu-layer .line-bottom {
  bottom: 0;
  -webkit-transform-origin: 34px 2px;
  transform-origin: 34px 2px;
}
</style>