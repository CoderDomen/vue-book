<template>
  <div class="shelf-list" :style="{'top':shelfListTop}">
    <transition-group name="list" id="shelf-list" tag="div">
      <div v-for="(item) in data" :key="item.id" class="shelf-list-item-wrapper">
        <ShelfItem :data="item" :style="{'height':itemHeight}"></ShelfItem>
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{item.title}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { storeShelfMixin } from "../../utils/mixin";
import { realPx ,px2rem} from "../../utils/utils";
import ShelfItem from "./ShelfItem";
export default {
  mixins: [storeShelfMixin],  
  props:{
    top:{
      type:Number,
      default:94
    },
    data:Array
  },
  data() {
    return {};
  },
  components: {
    ShelfItem
  },
  computed: {
    itemHeight() {
      return ((window.innerWidth - realPx(120)) / 3 / 250) * 350 + "px";
    },
    shelfListTop(){
      return px2rem(this.top) + 'rem'
    }
  }
};
</script>
<style  lang='scss' scoped>
@import "../../assets/styles/global";
.shelf-list {
  position: absolute;
  left: 0;
  z-index: 100;
  width: 100%;
  #shelf-list {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;
  }
  .shelf-list-item-wrapper {
    flex: 0 0 33.33%;
    width: 33.33%;
    padding: px2rem(15);
    box-sizing: border-box;
    &.list-leave-active{
      display: none;
    }
    &.list-move{
      transition: transform 0.5s;
    }
    .shelf-list-title-wrapper {
      margin-top: px2rem(10);
    }
  }
}
</style>
