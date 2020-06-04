<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : ''">
      <BookMark :color="color" :height="35" :width="15"></BookMark>
    </div>
  </div>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
import { getBookmark, saveBookmark } from "../../utils/localStorage";
import { realPx } from "../../utils/utils";
import BookMark from "./BookMark";
const DEFAULT = "#cecece";
const BLUE = "blue";

export default {
  mixins: [ebookMixin],
  data() {
    return {
      text: "",
      color: "cecece",
      isFixed: false
    };
  },
  components: {
    BookMark
  },
  computed: {
    height() {
      return realPx(35);
    },
    threshold() {
      return realPx(55);
    },
    fixedStyle() {
      return {
        position: "fixed",
        top: 0,
        right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
      };
    }
  },
  watch: {
    offsetY(v) {
      if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
        return;
      }
      if (v > this.height && v < this.threshold) {
        this.beforeThreshold(v);
      } else if (v >= this.threshold) {
        this.afterThreshold(v);
      } else if (v > 0 && v < this.height) {
        this.beforeHeight();
      } else if (v === 0) {
        this.restore();
      }
    },
    isBookmark(isBookmark){
      this.isFixed = isBookmark
      if(isBookmark){
        this.color = BLUE
      }else{
        this.color = DEFAULT
      }
    }
  },
  methods: {
    // 添加标签
    addBookmark() {
      this.bookmark = getBookmark(this.fileName);
      if (!this.bookmark) {
        this.bookmark = [];
      }
      const currentLocation = this.currentBook.rendition.currentLocation();
      const cfibase = currentLocation.start.cfi.replace(/!.*/, "");
      const cfistart = currentLocation.start.cfi
        .replace(/.*!/, "")
        .replace(/\)$/, "");
      const cfiend = currentLocation.end.cfi
        .replace(/.*!/, "")
        .replace(/\)$/, "");
      const cfirange = `${cfibase}!,${cfistart},${cfiend})`;
      // console.log(cfirange);
      this.currentBook.getRange(cfirange).then(range => {
        const text = range.toString().replace(/\s\s/g, "");
        this.bookmark.push({
          cfi: currentLocation.start.cfi,
          text: text
        }),
          saveBookmark(this.fileName, this.bookmark);
      });
    },
    // 移除标签
    removeBookmark() {
      const currentLocation = this.currentBook.rendition.currentLocation();
      const cfi = currentLocation.start.cfi;
      this.bookmark = getBookmark(this.fileName);
      // 过滤出bookmark数组中cfi与当前cfi不相等的对象，然后重新保存到bookmark
      if (this.bookmark) {
        saveBookmark(
          this.fileName,
          this.bookmark.filter(item => item.cfi !== cfi)
        );
      }
      this.setIsBookmark(false);
    },

    // 归位
    restore() {
      setTimeout(() => {
        this.$refs.bookmark.style.top = `${-this.height}px`;
        this.$refs.iconDown.style.transform = `rotate(0deg)`;
      }, 200);
      if (this.isFixed) {
        this.setIsBookmark(true);
        this.addBookmark();
      } else {
        this.setIsBookmark(false);
        this.removeBookmark();
      }
    },
    // 未到本身
    beforeHeight() {
      if (this.isBookmark) {
        this.text = this.$t("book.pulldownDeleteMark");
        this.color = BLUE;
        this.isFixed = true;
      } else {
        this.text = this.$t("book.pulldownAddMark");
        this.color = DEFAULT;
        this.isFixed = false;
      }
    },
    // 超过本身未到收藏
    beforeThreshold(v) {
      this.beforeHeight();
      this.$refs.bookmark.style.top = `${-v}px`;
      const iconDown = this.$refs.iconDown;
      if (iconDown.style.transform === "rotate(180deg)") {
        iconDown.style.transform = "rotate(0deg)";
      }
    },
    // 等于及超过收藏
    afterThreshold(v) {
      if (this.isBookmark) {
        this.text = this.$t("book.releaseDeleteMark");
        this.color = DEFAULT;
        this.isFixed = false;
      } else {
        this.text = this.$t("book.releaseAddMark");
        this.color = BLUE;
        this.isFixed = true;
      }
      this.$refs.bookmark.style.top = `${-v}px`;
      const iconDown = this.$refs.iconDown;
      if (
        iconDown.style.transform === "rotate(0deg)" ||
        iconDown.style.transform === ""
      ) {
        iconDown.style.transform = "rotate(180deg)";
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global";

.ebook-bookmark {
  position: absolute;
  top: px2rem(-35);
  left: 0;
  width: 100%;
  height: px2rem(35);
  z-index: 200;
  //   background-color: #cacaca;
  .ebook-bookmark-text-wrapper {
    display: flex;
    position: absolute;
    right: px2rem(45);
    bottom: 0;
    .ebook-bookmark-down-wrapper {
      font-size: px2rem(14);
      //   color: #fff;
      transition: all 0.2s linear;
      @include center;
    }
    .ebook-bookmark-text {
      font-size: px2rem(14);
      //   color: #fff;
    }
  }
  .ebook-bookmark-icon-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
    margin-right: px2rem(15);
  }
}
</style>
