<template>
  <div class="shelf-search-wrapper" :class="{'search-top':ifInputClick,'hide-shadow':isHideShadow}">
    <!-- 搜索部分 -->
    <div class="shelf-search" :class="{'search-top':ifInputClick}">
      <!-- 搜索框 -->
      <div class="search-wrapper">
        <div class="icon-search-wrapper">
          <span class="icon-search icon"></span>
        </div>
        <div class="search-input-wrapper">
          <input
            type="text"
            :placeholder="$t('shelf.search')"
            class="search-input"
            @click="onSearchClick"
            v-model="searchText"
          />
        </div>
        <div class="icon-clear-wrapper" v-show="searchText.length > 0" @click="onClearClick">
          <span class="icon-close-circle-fill icon"></span>
        </div>
      </div>
      <!-- 中英切换 -->
      <div class="icon-local-wrapper" v-if="!ifInputClick" @click="switchLocale">
        <span class="icon-cn icon" v-if="lang === 'cn'"></span>
        <span class="icon-en icon" v-else></span>
      </div>
      <!-- 取消 -->
      <div class="cancel-btn-wrapper" @click="onCancelClick" v-else>
        <span class="cancel-text">{{$t('shelf.cancel')}}</span>
      </div>
    </div>
    <!-- tab部分 -->
    <transition name="hot-search-move">
      <div class="shelf-search-tab-wrapper" v-if="ifInputClick">
        <div
          class="shelf-search-tab-item"
          v-for="(item) in tabs"
          :key="item.id"
          @click="onTabClick(item.id)"
        >
          <span
            class="shelf-search-tab-text"
            :class="{'is-select':selectedTab === item.id}"
          >{{item.text}}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { storeShelfMixin } from "../../utils/mixin";

import { setLocalStorage } from "../../utils/localStorage";
export default {
  mixins: [storeShelfMixin],

  computed: {
    lang() {
      return this.$i18n.locale;
    }
  },
  watch: {
    offsetY(v) {
      if (v > 0 && this.ifInputClick) {
        this.isHideShadow = false;  //显示阴影
      } else {
        this.isHideShadow = true;       //隐藏阴影
      }
    }
  },
  data() {
    return {
      ifInputClick: false,
      searchText: "",
      isHideShadow: true,
      tabs: [
        {
          id: 1,
          text: this.$t("shelf.default")
        },
        {
          id: 2,
          text: this.$t("shelf.progress")
        },
        {
          id: 3,
          text: this.$t("shelf.purchase")
        }
      ],
      selectedTab: 1
    };
  },
  methods: {
    onSearchClick() {
      this.ifInputClick = true;
      this.setShelfTitleVisible(false);
    },
    onCancelClick() {
      this.ifInputClick = false;
      this.setShelfTitleVisible(true);
    },
    switchLocale() {
      if (this.lang === "en") {
        this.$i18n.locale = "cn";
      } else {
        this.$i18n.locale = "en";
      }
      setLocalStorage("locale", this.$i18n.locale);
    },
    onClearClick() {
      this.searchText = "";
    },
    onTabClick(id) {
      this.selectedTab = id;
    }
  },
  components: {}
};
</script>
<style  lang='scss' scoped>
@import "../../assets/styles/global";
.shelf-search-wrapper {
  position: relative;
  z-index: 105;
  width: 100%;
  height: px2rem(94);
  font-size: px2rem(16);
  background-color: #fff;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  &.hide-shadow {
    box-shadow: none;
  }
  &.search-top {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 105;
  }
  .shelf-search {
    display: flex;
    position: absolute;
    top: px2rem(42);
    left: 0;
    z-index: 105;
    width: 100%;
    height: px2rem(52);
    transition: top 0.2s linear;
    &.search-top {
      top: 0;
    }
    .search-wrapper {
      flex: 1;

      display: flex;
      margin: px2rem(8) 0 px2rem(8) px2rem(10);
      border: px2rem(1) solid #ccc;
      border-radius: px2rem(3);
      .icon-search-wrapper {
        flex: 0 0 px2rem(22);
        @include right;
        .icon-search {
          font-size: px2rem(12);
        }
      }
      .search-input-wrapper {
        @include center;
        flex: 1;
        padding: 0 px2rem(10);
        box-sizing: border-box;
        .search-input {
          width: 100%;
          border: none;
          font-size: px2rem(14);
          color: #333;
          &:focus {
            outline: none;
          }
          &::-webkit-input-placeholder {
            font-size: px2rem(14);
            color: #ccc;
          }
        }
      }
      .icon-clear-wrapper {
        flex: 0 0 px2rem(22);
        @include left;
        .icon-close-circle-fill {
          font-size: px2rem(14);
          color: #ccc;
        }
      }
    }
    .icon-local-wrapper {
      flex: 0 0 px2rem(55);
      @include center;
      .icon-cn,
      .icon-en {
        font-size: px2rem(22);
        color: #666;
      }
    }
    .cancel-btn-wrapper {
      flex: 0 0 px2rem(55);
      @include center;
      .cancel-text {
        font-size: px2rem(14);
        color: $color-blue;
      }
    }
  }
  .shelf-search-tab-wrapper {
    display: flex;
    position: absolute;
    top: px2rem(42);
    left: 0;
    z-index: 105;
    width: 100%;
    height: px2rem(52);
    .shelf-search-tab-item {
      flex: 1;
      @include center;
      .shelf-search-tab-text {
        font-size: px2rem(12);
        color: #999;
        &.is-select {
          color: $color-blue;
        }
      }
    }
  }
}
</style>
