<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible &&  settingVisible ===2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{getReadTimeText()}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection()">
            <div class="icon-back"></div>
          </div>
          <input
            class="progress"
            type="range"
            max="100"
            min="0"
            step="1"
            @change="onProgressChange($event.target.value)"
            @input="onProgressInput($event.target.value)"
            :value="progress"
            :disabled="!bookAvailable"
            ref="progress"
          />
          <div class="progress-icon-wrapper" @click="nextSection()">
            <div class="icon-forward"></div>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{getSectionName}}</span>
          <span>({{bookAvailable ? progress + '%' : '加载中...'}})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";


export default {
  mixins: [ebookMixin],

  methods: {

   
    // 结束进度条拖动
    onProgressChange(progress) {
      this.setProgress(progress).then(() => {
        this.displayProgress();
        this.updataProgressBg();
      });
    },
    // 拖动进度条过程
    onProgressInput(progress) {
      this.setProgress(progress).then(() => {
        this.updataProgressBg();
      });
    },
     //根据progress进度百分比值得出当前的cfi并且显示
    displayProgress() {
      const percentage = this.progress / 100
      const cfi = this.currentBook.locations.cfiFromPercentage(percentage);
      this.display(cfi)
    },
    updataProgressBg() {
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`;
    },


    // 上一章节
    prevSection() {
      if (this.section > 0 && this.bookAvailable) {
        this.setSection(this.section - 1).then(() => {
          this.displaySection();
        });
      }
    },
    // 下一章节
    nextSection() {
      if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) { 
        this.setSection(this.section + 1).then(() => {
          this.displaySection();
        });
      }
    },
    //根据section获取链接渲染页面
    displaySection() {
      const sectionInfo = this.currentBook.section(this.section);
      if (sectionInfo && sectionInfo.href) {
        this.display(sectionInfo.href)
      }
    },





  },



  updated() {
    this.updataProgressBg(); //解决刷新0%时满进度条的颜色
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.setting-wrapper {
  position: absolute;
  bottom: px2rem(48);
  left: 0;
  z-index: 190;
  width: 100%;
  height: px2rem(90);
  background: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  .read-time-wrapper {
    width: 100%;
    height: px2rem(40);
    position: absolute;
    top: 0;
    left: 0;
    @include center;
    font-size: px2rem(12);
  }
  .setting-progress {
    position: relative;
    width: 100%;
    height: 100%;
    .progress-wrapper {
      width: 100%;
      height: 100%;
      @include center;
      padding: 0 px2rem(30);
      box-sizing: border-box;
      .progress-icon-wrapper {
        font-size: px2rem(15);
      }
      .progress {
        width: 100%;
        -webkit-appearance: none;
        height: px2rem(2);
        margin: 0 px2rem(10);
        // background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
        // background-size: 0 100% !important;
        &:focus {
          outline: none;
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: px2rem(20);
          width: px2rem(20);
          border-radius: 50%;
          background: white;
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.15);
          border: px2rem(1) solid #ddd;
        }
      }
    }
    .text-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(10);
      width: 100%;
      color: #333;
      font-size: px2rem(12);
      padding:0 px2rem(15);
           box-sizing: border-box;
      //   text-align: center;
      @include center;
       .progress-section-text {
           
           @include ellipsis;
      }
    }
  }
}
</style>
