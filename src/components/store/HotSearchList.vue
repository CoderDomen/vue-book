<template>
  <transition name='hot-search-move'>
    <Scroll class="hot-search-wrapper" :top="52" @onScroll="onScroll" ref="scroll">
      <hot-search
        :label="$t('home.hotSearch')"
        :btn="$t('home.change')"
        :hotSearch="searchList.hotSearch"
      ></hot-search>
      <div class="line"></div>
      <hot-search
        :label="$t('home.historySearch')"
        :btn="$t('home.clear')"
        :hotSearch="searchList.historySearch"
      ></hot-search>
    </Scroll>
  </transition>
</template>

<script>
import { storeHomeMixin } from "../../utils/mixin";
import HotSearch from "./HotSearch";
import Scroll from "../common/Scroll";
import { realPx } from "@/utils/utils";
export default {
  mixins: [storeHomeMixin],
  components: {
    HotSearch,
    Scroll
  },
  props: {
    //   ifShowSearchPage: {
    //     type: Boolean,
    //     default: false
    //   },
    //   ifShowHotSearch: {
    //     type: Boolean,
    //     default: true
    //   },
    //   bookListOffsetY: Number
  },
  data() {
    return {
      ifShowSearchPage: true,
      ifShowHotSearch: true,
      searchList: {
        hotSearch: [
          {
            type: 1,
            text: "Self-Reported Population Health",
            num: "1.8万"
          },
          {
            type: 1,
            text: "Library and Information Sciences",
            num: "1.1万"
          },
          {
            type: 1,
            text: "Global Business Strategy",
            num: "1.3万"
          },
          {
            type: 1,
            text: "Corporate Data Quality",
            num: "1.0万"
          },
          {
            type: 1,
            text: "Verrechnungspreise",
            num: "3.9万"
          }
        ],
        historySearch: [
          {
            type: 2,
            text: "Computer Science"
          },
          {
            type: 1,
            text: "Building the Infrastructure for Cloud Security"
          },
          {
            type: 2,
            text: "ePub"
          },
          {
            type: 2,
            text: "api"
          },
          {
            type: 2,
            text: "Vue.js"
          },
          {
            type: 2,
            text: "Nginx"
          },
          {
            type: 2,
            text: "Java"
          },
          {
            type: 2,
            text: "hdfs"
          },
          {
            type: 2,
            text: "vuejs"
          },
          {
            type: 2,
            text: "es6"
          },
          {
            type: 2,
            text: "Intel"
          },
          {
            type: 1,
            text: "Pro Git"
          },
          {
            type: 2,
            text: "imooc"
          },
          {
            type: 2,
            text: "Education"
          },
          {
            type: 2,
            text: "Springer"
          },
          {
            type: 2,
            text: "Environment"
          }
        ]
      }
      //   ifHideShadow: true,
      //   searchText: null
    };
  },
  methods: {
    onScroll(offsetY) {  
      this.setHotSearchOffsetY(offsetY);
    },
    reset() {
      this.$refs.scroll.scrollTo(0, 0);
    }
    //   setKeyword(keyword) {
    //     this.searchText = keyword
    //     this.searchList.historySearch.push(keyword)
    //   },
    //   search() {
    //     this.$router.push({
    //       path: '/book-store/list',
    //       query: {
    //         keyword: this.searchText
    //       }
    //     })
    //   },
    //   hideHotSearch() {
    //     this.$emit('update:ifShowHotSearch', false)
    //   },
    //   showShadow() {
    //     this.ifHideShadow = false
    //   },
    //   hideShadow() {
    //     this.ifHideShadow = true
    //   },
    //   showSearchPageAndHotSearch() {
    //     this.showSearchPage()
    //     this.hideShadow()
    //     this.$emit('update:ifShowHotSearch', true)
    //     this.$nextTick(() => {
    //       this.initHotSearch()
    //     })
    //   },
    //   back() {
    //     this.searchText = ''
    //     if (this.ifShowSearchPage) {
    //       if (this.bookListOffsetY <= 0) {
    //         this.hideSearchPage()
    //       } else {
    //         if (this.ifShowHotSearch) {
    //           this.hideHotSearch()
    //           this.showShadow()
    //         } else {
    //           this.$router.push('/book-store/shelf')
    //         }
    //       }
    //     } else {
    //       this.$router.push('/book-store/shelf')
    //     }
    //     this.$emit('back')
    //   },
    //   hideSearchPage() {
    //     this.$emit('update:ifShowSearchPage', false)
    //     this.ifHideShadow = true
    //   },
    //   showSearchPage() {
    //     this.$emit('update:ifShowSearchPage', true)
    //   },
    //   showFlapCard() {
    //     this.$emit('showFlapCard')
    //   },
    //   handleScroll(e) {
    //     const target = e.target
    //     if (target) {
    //       if (target.scrollTop > 0) {
    //         this.ifHideShadow = false
    //       } else {
    //         this.ifHideShadow = true
    //       }
    //     }
    //   },
    //   initHotSearch() {
    //     if (this.$refs.searchMaskWrapper) {
    //       this.$refs.searchMaskWrapper.style.height = window.innerHeight - realPx(52) + 'px'
    //       this.$refs.searchMaskWrapper.addEventListener('scroll', this.handleScroll)
    //       this.$refs.searchMaskWrapper.scrollTo(0, 0)
    //     }
    //   }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

// .search-bar-wrapper {
.hot-search-wrapper {
  width: 100%;
  height: 100%;
  background: white;
  //   overflow-x: hidden;
  //   overflow-y: scroll;
  //   -webkit-overflow-scrolling: touch;
  //   &::-webkit-scrollbar {
  //     display: none;
  //   }
  .line {
    width: 100%;
    height: 0;
    border-top: px2rem(1) solid #eee;
    margin: px2rem(10) 0;
  }
}
// }
</style>
