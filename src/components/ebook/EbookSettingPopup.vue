<template>
  <transition name="popup-slide-up">
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <!-- 头部部分 -->
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon" @click="hide">
          <span class="icon-down2"></span>
        </div>
        <div class="ebook-popup-title-text">
          <span class="ebook-popup-title-text">{{$t('book.selectFont')}}</span>
        </div>
      </div>
      <!-- 字体选择 -->
      <div class="ebook-popup-list-wrapper">
        <div
          class="ebool-popup-item"
          v-for="(item,index) in fontFamilyList"
          :key="index"
          @click="setFontFamily(item.font)"
        >
          <div class="ebook-popup-item-text" :class="{'select':isSelected(item)}">{{item.font}}</div>
          <div class="ebook-popup-item-check">
            <span class="icon-check" v-if="isSelected(item)"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { FONT_FAMILY } from "../../utils/book";
import { ebookMixin } from "../../utils/mixin";
import {saveFontFamily} from '../../utils/localStorage'

export default {
  mixins: [ebookMixin],
  data() {
    return {
      fontFamilyList: FONT_FAMILY
    };
  },
  methods: {
    // 隐藏字体选择框
    hide() {
      this.setFontFamilyVisible(false);
    },
    // 选择字体样式
    setFontFamily(font) {
      this.setDefaultFontFamily(font);    //改变DefaultFontFamily的值
      saveFontFamily(this.fileName,font)   //保存字体样式到localStorage
      if (font === "Default") {
        this.currentBook.rendition.themes.font("Times New Roman");
      } else {
        this.currentBook.rendition.themes.font(font);     //改变当前书本的样式
      }
    },
    isSelected(item) {
      return this.defaultFontFamily === item.font;
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global";
.ebook-popup-list {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 350;
  background-color: #fff;
  box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, 0.1);
  .ebook-popup-title {
    position: relative;
    padding: px2rem(15);
    box-sizing: border-box;
    border-bottom: px2rem(1) solid #b8b9bb;
    text-align: center;
    @include center;
    .ebook-popup-title-icon {
      position: absolute;
      left: px2rem(15);
      top: 0;
      height: 100%;
      font-size: px2rem(16);
      font-weight: blod;
      @include center;
    }
    .ebook-popup-title-text {
      font-weight: blod;
      font-size: px2rem(14);
    }
  }
  .ebook-popup-list-wrapper {
    .ebool-popup-item {
      display: flex;
      padding: px2rem(15);
      .ebook-popup-item-text {
        flex: 1;
        text-align: left;
        font-size: px2rem(14);
        &.select {
          color: #346cb9;
          font-weight: blod;
        }
      }
      .ebook-popup-item-check {
        flex: 1;
        text-align: right;
        font-size: px2rem(14);
        font-weight: bold;
        color: #346cb9;
      }
    }
  }
}
</style>
