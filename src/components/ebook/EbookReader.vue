<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <!-- 蒙版上实现点击功能 -->
    <div
      class="ebook-reader-mask"
      @click="onMaskClick"
      @touchmove="move"
      @touchend="moveEnd"
      @mousedown.left="onMouseEnter"
      @mousemove.left="onMouseMove"
      @mouseup.left="onMouseEnd"
    ></div>
  </div>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
import { flatten } from "../../utils/book";

import {
  getFontFamily,
  saveFontFamily,
  getFontSize,
  saveFontSize,
  getTheme,
  saveTheme,
  getLocation
} from "../../utils/localStorage";

import Epub from "epubjs";
import { getLocalForage } from "../../utils/localForage";
global.ePub = Epub;

export default {
  mixins: [ebookMixin],

  data() {
    return {
      // touchStartX:0,
      // touchStartTime:0
      firstOffsetY: null,
      mouseState: 0,
      mouseStartTime: 0
    };
  },

  mounted() {
    // console.log(this.$route.params);
    // console.log(this.$route.params.fileName.split("|").join("/"));
    // 将路由中参数传递到vuex中改变state中的fileName数据，使用this.fileName的数据就是state的值
    // console.log(this.$route.params.fileName.split("|").join("/"));
    const books = this.$route.params.fileName.split("|");
    // console.log(books);
    const fileName = books[1];
    // 从本地查找电子书
    getLocalForage(fileName, (err, blob) => {
      if (!err && blob) {
        // console.log("找到离线缓存电子书");
        this.setFileName(books.join("/")).then(() => {
          this.initEpub(blob);
        });
      } else {
        // console.log("在线缓存电子书");
        // console.log(books.join("/"));
        this.setFileName(books.join("/")).then(() => {
          // console.log(this.fileName);
          const url = process.env.VUE_APP_EPUB_URL + '/' +  this.fileName + '.epub';
          // console.log(url);
          this.initEpub(url);
        });
      }
    });
  },

  methods: {
    // 1.鼠标点击
    // 2.鼠标点击后移动
    // 3.鼠标移动后松开
    // 4.鼠标不经过移动后离开
    onMouseEnter(e) {
      this.mouseState = 1;
      e.preventDefault();
      e.stopPropagation();
      this.mouseStartTime = e.timeStamp;
    },
    onMouseMove(e) {
      let offsetY = 0;
      if (this.mouseState === 1) {
        this.mouseState = 2;
      } else if (this.mouseState === 2) {
        if (this.firstOffsetY) {
          offsetY = e.clientY - this.firstOffsetY;
          this.setOffsetY(offsetY);
        } else {
          this.firstOffsetY = e.clientY;
        }
      }
      e.preventDefault();
      e.stopPropagation();
    },
    onMouseEnd(e) {
      if (this.mouseState === 2) {
        this.mouseState = 3;
        this.setOffsetY(0);
        this.firstOffsetY = null;
      } else {
        this.mouseState = 4;
      }
      const time = e.timeStamp - this.mouseStartTime;
      // 从点击到离开时间差< 200 视作没有经过移动
      if (time < 100) {
        this.mouseState = 4;
      }
      e.preventDefault();
      e.stopPropagation();
    },

    // 点击蒙版
    onMaskClick(e) {
      // 若鼠标添加与删除书签则不适用蒙版的功能
      if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
        return;
      }
      const offsetX = e.offsetX;
      const width = window.innerWidth;
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage();
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage();
      } else {
        this.toggleTitleAndMenu();
      }
    },
    // 点击移动
    move(e) {
      let offsetY = 0;
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY;
        this.setOffsetY(offsetY);
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY;
      }
      e.preventDefault();
      e.stopPropagation();
    },
    // 松开鼠标
    moveEnd(e) {
      this.setOffsetY(0);
      this.firstOffsetY = null;
    },

    // 上一页
    prevPage() {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation();
        });
        this.hideTitleAndMenu();
      }
    },
    // 下一页
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation();
        });
        this.hideTitleAndMenu();
      }
    },
    // 切换显示隐藏标题菜单
    toggleTitleAndMenu() {
      if (this.menuVisible) {
        this.setsettingVisible(-1);
      }
      this.setMenuVisible(!this.menuVisible);
      this.setFontFamilyVisible(false);
    },

    // 字体大小
    initFontSize() {
      let fontSize = getFontSize(this.fileName); //从localStorage获取
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize);
      } else {
        this.setDefaultFontSize(fontSize); // 获取之后改变Default*的值
        this.rendition.themes.fontSize(fontSize + "px"); //注意这里添加’px' ；获取之后改变当前书本
      }
    },
    // 字体样式
    initFontFamily() {
      let font = getFontFamily(this.fileName); //从localStorage获取字体样式
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily);
      } else {
        this.setDefaultFontFamily(font); // 获取之后改变DefaultFontFamily的值
        this.rendition.themes.font(font); //获取之后改变当前书本的字体样式
      }
    },
    // 主题
    initTheme() {
      // 三步走   0.注册主题  1.获取主题   2.改变default    3.改变当前主题
      let theme = getTheme(this.fileName); //获取主题
      if (!theme) {
        saveTheme(this.fileName, this.themeList[0].name);
      } else {
        this.setDefaultTheme(theme); //改变default
        this.rendition.themes.select(this.defaultTheme); //改变当前主题
      }
    },

    // 图书渲染显示
    initRenditon() {
      this.rendition = this.book.renderTo("read", {
        width: innerWidth,
        height: innerHeight,
        method :'default'        
      });
      const location = getLocation(this.fileName);
      this.display(location, () => {
        this.initTheme();
        this.initFontSize();
        this.initFontFamily();
        this.initGlobalStyle();
      });
      // 给epubjs注入字体样式
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/cabin.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`
          )
        ]).then(() => {
          // console.log("字体全部加载完全");
        });
      });
      // 给epubjs注册主题
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style);
      });
    },

    initGesture() {
      // 触摸事件
      this.rendition.on("touchstart", event => {
        this.touchStartX = event.changedTouches[0].clientX;
        this.touchStartTime = event.timeStamp;
      });
      // 离开触摸
      this.rendition.on("touchend", event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX;
        const time = event.timeStamp - this.touchStartTime;
        // console.log(offsetX,Time);
        if (time < 500 && offsetX > 40) {
          this.prevPage();
        } else if (time < 500 && offsetX < -40) {
          this.nextPage();
        } else {
          this.toggleTitleAndMenu();
        }
        // event.preventDefault();    //禁止默认事件
        event.stopPropagation(); //禁止冒泡
      });
    },

    // 解析电子书，图片 ， 标题 ， 作者 , 章节
    parseBook() {
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url);
        });
      });
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata);
      });
      this.book.loaded.navigation.then(nav => {
        const navItem = flatten(nav.toc);
        function find(item, level = 0) {
          return !item.parent
            ? level
            : find(
                navItem.filter(parentItem => parentItem.id === item.parent[0]),
                ++level
              );
        }
        navItem.forEach(item => {
          item.level = find(item);
        });
        this.setNavigation(navItem);
      });
    },

    // 图书初始化
    initEpub(url) {
      // console.log(url);
      this.book = new Epub(url); //这里epub解析url下载后的blob对象
      // console.log(this.book);

      this.setCurrentBook(this.book);
      this.initRenditon();
      // this.initGesture();
      this.parseBook();

      // 钩子函数，book解析结束后,设置每页字数数量对书本进行分页
      this.book.ready.then(() => {
        return this.book.locations
          .generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)
          )
          .then(locations => {
            this.navigation.forEach(nav => {
              nav.pagelist = [];
            });
            //注意这里如果报错可能出现文件为xhtml，无法匹配到
            locations.forEach(item => {
              const loc = item.match(/\[(.*)\]!/)[1];

              this.navigation.forEach(nav => {
                if (nav.href) {
                  // const href = nav.href.match(/^(.*)\.html$/) [1]
                  const href1 =
                    nav.href.match(/^(.*)\.html$/) ||
                    nav.href.match(/^(.*)\.xhtml$/);
                  const href = href1[1];

                  if (href === loc) {
                    nav.pagelist.push(item);
                  }
                }
              });
            });

            let currentPage = 1;
            this.navigation.forEach((nav, index) => {
              if (index === 0) {
                nav.page = 1;
              } else {
                nav.page = currentPage; //章节的起始页
              }
              currentPage += nav.pagelist.length + 1;
            });

            this.setPagelist(locations);
            this.setBookAvailable(true);
            this.refreshLocation(); //分页完成后再获取进度百分比
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";

.ebook-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ebook-reader-mask {
    position: absolute;
    top: 0;
    left: 0;
    background-color: transparent;
    width: 100%;
    height: 100%;
    z-index: 150;
  }
}
</style>
