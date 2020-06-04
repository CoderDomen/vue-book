<template>
  <div class="ebook" ref="ebook">
    <ebook-bookmark></ebook-bookmark>
    <EbookHeader></EbookHeader>
    <ebook-reader></ebook-reader>
    <ebook-title></ebook-title>
    <ebook-menu></ebook-menu>
    <EbookFooter></EbookFooter>
  </div>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
import { getReadTime, saveReadTime } from "../../utils/localStorage";
import EbookHeader from '../../components/ebook/EbookHeader'
import EbookReader from "../../components/ebook/EbookReader";
import EbookFooter from '../../components/ebook/EbookFooter'
import EbookTitle from "../../components/ebook/EbookTitle";
import EbookMenu from "../../components/ebook/EbookMenu";
import EbookBookmark from "../../components/ebook/EbookBookmark";

export default {
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark,
    EbookHeader,
    EbookFooter
  },
  watch: {
    offsetY(v) {
      if (!this.menuVisible && this.bookAvailable) {
        if (v >0) {
          this.move(v);
        } else if (v === 0)
          //当touchend时候
          this.restore();
      }
    }
  },
  methods: {
    restore() {
      this.$refs.ebook.style.transition = "all 0.2s linear";
      this.$refs.ebook.style.top = 0;
      setTimeout(() => {
        this.$refs.ebook.style.transition = "";
      }, 200);
    },
    move(v) {
      // this.$refs.ebook.style.transition = '';
      this.$refs.ebook.style.top = v + "px";
    },
    startLoopReadTime() {
      let readTime = getReadTime();
      if (!readTime) {
        readTime = 0;
      }
      const task = setInterval(() => {
        readTime++;
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime);
        }
      }, 1000);
    }
  },
  mounted() {
    this.startLoopReadTime();
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.ebook {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
