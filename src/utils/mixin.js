import { mapGetters, mapActions } from "vuex";
import {
  themeList,
  addCss,
  removeAllCss,
  showBookDetail,
  getReadTimeByMin,
  appendAddToShelf,
  removeAddFromShelf,
  computedId
} from "./book";
import {
  saveLocation,
  getBookmark,
  getBookShelf,
  saveBookShelf
} from "./localStorage";
import { shelf } from "../api/store";

export const storeShelfMixin = {
  computed: {
    ...mapGetters([
      "isEditMode",
      "shelfList",
      "shelfSelected",
      "shelfTitleVisible",
      "offsetY",
      "shelfCategory",
      "currentType"
    ])
  },
  methods: {
    ...mapActions([
      "setIsEditMode",
      "setShelfList",
      "setShelfSelected",
      "setShelfTitleVisible",
      "setOffsetY",
      "setShelfCategory",
      "setCurrentType"
    ]),
    showBookDetail(book) {
      showBookDetail(this, book);
    },

    // 获取书架分组列表数据
    getShelfCatefory(title) {
      this.getShelfList().then(() => {
        const categoryList = this.shelfList.filter(
          item => item.type === 2 && item.title === title
        )[0];
        this.setShelfCategory(categoryList);
      });
    },

    // 获取书架页面数据
    getShelfList() {
      let shelfList = getBookShelf();
      // 如果本地没有，则api获取默认数据
      if (!shelfList) {
        shelf().then(res => {
          // 在原有的bookList 数据上添加一个空对象然后保存
          if (res.status === 200 && res.data && res.data.bookList) {
            shelfList = appendAddToShelf(res.data.bookList);
            saveBookShelf(shelfList);
            return this.setShelfList(shelfList);
          }
        });
      } else {
        return this.setShelfList(shelfList);
      }
    },

    moveOutOfGroup(cb) {
      this.setShelfList(
        this.shelfList.map(book => {
          if (book.type === 2 && book.itemList) {
            book.itemList = book.itemList.filter(subBook => !subBook.selected);
          }
          return book;
        })
      ).then(() => {
        const list = computedId(
          appendAddToShelf(
            removeAddFromShelf(this.shelfList).concat(this.shelfSelected)
          )
        );
        this.setShelfList(list).then(() => {
          this.simpleToast(this.$t("shelf.moveBookOutSuccess"));
          cb && cb();
        });
      });
    }
  }
};

export const storeHomeMixin = {
  computed: {
    ...mapGetters(["offsetY", "hotSearchOffsetY", "flapCardVisible"])
  },

  methods: {
    ...mapActions(["setOffsetY", "setHotSearchOffsetY", "setFlapCardVisible"]),

    showBookDetail(book) {
      showBookDetail(this, book);
    }
  }
};

export const ebookMixin = {
  computed: {
    ...mapGetters([
      "fileName",
      "menuVisible",
      "settingVisible",
      "defaultFontSize",
      "defaultFontFamily",
      "fontFamilyVisible",
      "defaultTheme",
      "bookAvailable",
      "progress",
      "section",
      "isPaginating",
      "currentBook",
      "navigation",
      "cover",
      "metadata",
      "paginate",
      "pagelist",
      "offsetY",
      "isBookmark",
      "speakingIconBottom"
    ]),
    themeList() {
      return themeList(this);
    },
    getSectionName() {
      return this.section ? this.navigation[this.section].label : "";
    }
  },
  methods: {
    ...mapActions([
      "setsettingVisible",
      "setFileName",
      "setMenuVisible",
      "setDefaultFontSize",
      "setDefaultFontFamily",
      "setFontFamilyVisible",
      "setDefaultTheme",
      "setBookAvailable",
      "setProgress",
      "setSection",
      "setIsPaginating",
      "setCurrentBook",
      "setNavigation",
      "setCover",
      "setMetadata",
      "setPaginate",
      "setPagelist",
      "setOffsetY",
      "setIsBookmark",
      "setSpeakingIconBottom"
    ]),
    initGlobalStyle() {
      removeAllCss();
      switch (this.defaultTheme) {
        case "Default":
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`);
          break;
        case "Gold":
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`);
          break;
        case "Eye":
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`);
          break;
        case "Night":
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`);
          break;
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`);
          break;
      }
    },
    //  设置progress  ， 设置section ，  保存cfi ,设置标签,设置当前页数
    refreshLocation() {
      const currentLocation = this.currentBook.rendition.currentLocation();
      if (
        currentLocation &&
        currentLocation.start &&
        currentLocation.start.cfi
      ) {
        const startCfi = currentLocation.start.cfi;
        const progress = this.currentBook.locations.percentageFromCfi(startCfi);
        this.setProgress(Math.floor(progress * 100));
        // console.log(currentLocation);
        this.setSection(currentLocation.start.index);
        saveLocation(this.fileName, startCfi);
        const bookmark = getBookmark(this.fileName);
        // console.log(bookmark);
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true);
          } else {
            this.setIsBookmark(false);
          }
        } else {
          this.setIsBookmark(false);
        }
        if (this.pagelist) {
          const totalPage = this.pagelist.length;
          const currentPage = currentLocation.start.location;
          if (currentPage && currentPage > 0) {
            this.setPaginate(currentPage + "/" + totalPage);
          } else {
            this.setPaginate("");
          }
        } else {
          this.setPaginate("");
        }
      }
    },
    display(target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation();
          cb && cb();
        });
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation();
          cb && cb();
        });
      }
    },
    // 隐藏标题菜单栏
    hideTitleAndMenu() {
      this.setsettingVisible(-1);
      this.setMenuVisible(false);
      this.setFontFamilyVisible(false);
    },
    // 显示阅读时间
    getReadTimeText() {
      return this.$t("book.haveRead").replace(
        "$1",
        getReadTimeByMin(this.fileName)
      );
    }
  }
};
