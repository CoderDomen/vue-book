<template>
  <div class="store-shelf">
    <ShelfTitle :title="shelfCategory.title"></ShelfTitle>
    <Scroll
      :top="0"
      :bottom="scrollBottom"
      class="store-shelf-scroll-wrapper"
      @onScroll="onScroll"
      v-if="ifShowList"
      ref="scroll"
    >
      <ShelfList :top="42" :data="shelfCategory.itemList"></ShelfList>
    </Scroll>
    <div class="store-shelf-empty-view" v-else>
      <div>{{$t('shelf.groupNone')}}</div>
    </div>
    <ShelfFooter></ShelfFooter>
  </div>
</template>

<script>
import { storeShelfMixin } from "../../utils/mixin";
import ShelfTitle from "../../components/shelf/ShelfTitle";
import Scroll from "../../components/common/Scroll";
import ShelfSearch from "../../components/shelf/ShelfSearch";
import ShelfList from "../../components/shelf/ShelfList";
import ShelfFooter from "../../components/shelf/ShelfFooter";

export default {
  mixins: [storeShelfMixin],
  computed: {
    ifShowList() {
      return (
        this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
      );
    }
  },

  data() {
    return {
      scrollBottom:0
    };
  },
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearch,
    ShelfList,
    ShelfFooter
  },
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY);
    }
  },
  mounted() {
    this.getShelfCatefory(this.$route.query.title);
    this.setCurrentType(2);
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global";
.store-shelf {
  position: relative;
  z-index: 100;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .store-shelf-scroll-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
  }
  .store-shelf-empty-view {
    position: relative;
    // top: 0;
    // left: 0;
    width: 100%;
    height: 100%;
    font-size: px2rem(14);
    color: #333;
    @include center;
  }
}
</style>
