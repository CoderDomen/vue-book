<template>
  <div class="shelf-item-category">
    <div class="shelf-item-category-list" v-if="data.itemList.length > 0">
      <div class="shelf-item-category-item" v-for="(item,index) in data.itemList" :key="index">
        <img class="shelf-item-categoty-img" :src="item.cover" />
      </div>
    </div>
    <div class="shelf-list-category-bg" v-else>
      <span class="icon-book2"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  },
  components: {}
};
</script>

<style  lang='scss' scoped>
@import "../../assets/styles/global";
.shelf-item-category {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .shelf-item-category-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    padding-top: px2rem(5);
    box-sizing: border-box;
    align-content: flex-start;

    .shelf-item-category-item {
      width: 33.33%;
      height: 33.33%;
      box-sizing: border-box;

      &:nth-child(3n + 1) {
        padding: 0 px2rem(2.5) px2rem(5) px2rem(5);
      }
      &:nth-child(3n + 2) {
        padding: 0 px2rem(2.5) px2rem(5) px2rem(2.5);
      }
      &:nth-child(3n + 3) {
        padding: 0 px2rem(5) px2rem(5) px2rem(2.5);
      }
      .shelf-item-categoty-img {
        width: 100%;
        height: 100%;
      }
    }
  
  }
  .shelf-list-category-bg{
      width: 100%;
      height: 100%;
      font-size: px2rem(30);
      background-color: #fff;
      color: #ccc;
      // text-align: center;
      // margin:  0 auto;
      @include center;
    }
}
</style>
