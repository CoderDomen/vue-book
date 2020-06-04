<template>
  <div>
    <div class="search-bar" :class="{'hide-title' :!titleVisible,'hide-shadow':!shadowVisible }">
      <!-- 返回按钮 -->
      <div class="title-icon-back-wrapper" :class="{'hide-title':!titleVisible}" @click="back">
        <span class="icon-back icon"></span>
      </div>
      <!-- 头部部分 -->
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="title-text title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper" @click="showFlapCard">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <!-- 搜索部分 -->
      <div class="search-bar-input-wrapper" :class="{'hide-title':!titleVisible}">
        <div class="search-bar-blank" :class="{'hide-title':!titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input
            type="text"
            v-model="searchText"
            :placeholder="$t('home.hint')"
            class="input"
            @click="showHotSearch"
            @keyup.13.exact="search()"
          />
        </div>
      </div>
    </div>
    <HotSearchList v-show="hotSearchVisible" ref="hotSearch"></HotSearchList>
  </div>
</template>

<script>
import { storeHomeMixin } from "../../utils/mixin";
import HotSearchList from "./HotSearchList";

export default {
  mixins: [storeHomeMixin],
  components: { HotSearchList },

  data() {
    return {
      searchText: "",
      titleVisible: true,
      shadowVisible: false,
      hotSearchVisible: false
    };
  },
  methods: {
    search() {
      this.$router.push({
        path: "/store/list",
        query: {
          keyword: this.searchText
        }
      });
    },
    showFlapCard() {
      this.setFlapCardVisible(true);
    },
    back() {
      if (this.offsetY > 0) {
        this.showShadow();
      } else {
        this.hideShadow();
      }
      if (this.hotSearchVisible) {
        this.hideHotSearch();
      } else {
        this.$router.push({
          path: "/store/shelf"
        });
      }
    },
    hideHotSearch() {
      this.hotSearchVisible = false;
      if (this.offsetY > 0) {
        this.hideTitle();
        this.showShadow();
      } else {
        this.showTitle();
        this.hideShadow();
      }
    },
    showHotSearch() {
      this.hideTitle();
      this.hideShadow();
      this.hotSearchVisible = true;
      this.$nextTick(() => {
        this.$refs.hotSearch.reset();
      });
    },

    hideTitle() {
      this.titleVisible = false;
    },
    showTitle() {
      this.titleVisible = true;
    },
    hideShadow() {
      this.shadowVisible = false;
    },
    showShadow() {
      this.shadowVisible = true;
    }
  },
  watch: {
    offsetY(v) {
      if (v > 0) {
        this.hideTitle();
        this.showShadow();
      } else {
        this.showTitle();
        this.hideShadow();
      }
    },
    hotSearchOffsetY(v) {
      if (v > 0) {
        this.showShadow();
      } else {
        this.hideShadow();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global";
.search-bar {
  width: 100%;
  position: relative;
  height: px2rem(94);
  z-index: 150;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  &.hide-title {
    height: px2rem(52);
  }
  &.hide-shadow {
    box-shadow: none;
  }

  .title-icon-back-wrapper {
    z-index: 200;
    position: absolute;
    left: px2rem(15);
    top: 0;
    height: px2rem(42);
    @include center;
    transition: height $animationTime $animationType;
    &.hide-title {
      height: px2rem(54);
    }
  }
  .search-bar-title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    .title-text-wrapper {
      width: 100%;
      height: px2rem(42);
      @include center;
    }
    .title-icon-shake-wrapper {
      position: absolute;
      right: px2rem(15);
      top: 0;
      height: px2rem(42);
      @include center;
    }
  }
  .search-bar-input-wrapper {
    display: flex;
    position: absolute;
    top: px2rem(42);
    width: 100%;
    height: px2rem(52);
    padding: px2rem(10);
    box-sizing: border-box;
    transition: top $animationTime $animationType;
    &.hide-title {
      top: 0;
    }
    .search-bar-blank {
      flex: 0 0 0;
      width: 0;
      transition: all $animationTime $animationType;
      &.hide-title {
        flex: 0 0 px2rem(31);
        width: px2rem(31);
      }
    }
    .search-bar-input {
      flex: 1;
      width: 100%;
      background-color: #f4f4f4;
      border-radius: px2rem(20);
      padding: px2rem(5) px2rem(15);
      @include left;
      box-sizing: border-box;
      border: px2rem(1) solid #eee;
      .icon-search {
        color: #999;
      }
      .input {
        width: 100%;
        height: px2rem(22);
        border: none;
        margin-left: px2rem(10);
        font-size: px2rem(12);
        background-color: transparent;
        color: #666;
        &:focus {
          outline: none;
        }
        &::-webkit-input-placeholder {
          color: #ccc;
        }
      }
    }
  }
}
</style>
