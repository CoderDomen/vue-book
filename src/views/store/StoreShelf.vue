<template>
  <div class="store-shelf">
    <ShelfTitle :title="$t('shelf.title')"></ShelfTitle>
    <Scroll
      :top="0"
      ref="scroll"
      :bottom="scrollBottom"
      class="store-shelf-scroll-wrapper"
      @onScroll="onScroll"
    >
      <ShelfSearch></ShelfSearch>
      <ShelfList :data="shelfList"></ShelfList>
    </Scroll>
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

  data() {
    return {
      scrollBottom: 0
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
    this.getShelfList();
    this.setShelfCategory([]);
    this.setCurrentType(1);
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
}
</style>
