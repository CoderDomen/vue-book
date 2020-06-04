<template>
  <div class="shelf-footer" v-show="isEditMode">
    <div
      class="shelf-footer-tab-wrapper"
      v-for="(item,index) in tabs"
      :key="index"
      @click="onTabClick(item)"
    >
      <div class="shelf-footer-tab" :class="{'is-selected':isSelected}">
        <div class="tab-icon icon-private" v-if="item.index===1 && !isPrivate"></div>
        <div class="tab-icon icon-private-see" v-if="item.index===1 && isPrivate"></div>
        <div class="tab-icon icon-download" v-if="item.index===2 &&!isDownload"></div>
        <div class="tab-icon icon-download-remove" v-if="item.index===2 && isDownload"></div>
        <div class="tab-icon icon-move" v-if="item.index===3"></div>
        <div class="tab-icon icon-shelf" v-if="item.index===4"></div>
        <div class="tab-text" :class="{'remove-text':item.index ===4}">{{label(item)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { storeShelfMixin } from "../../utils/mixin";
import { saveBookShelf, removeLocalStorage } from "../../utils/localStorage";
import { removeLocalForage } from "../../utils/localForage";
import { download } from "../../api/store";
export default {
  mixins: [storeShelfMixin],

  data() {
    return {
      popupMenu: null,
      tabs: [
        {
          label: this.$t("shelf.private"),
          label2: this.$t("shelf.noPrivate"),
          index: 1
        },
        {
          label: this.$t("shelf.download"),
          label2: this.$t("shelf.delete"),
          index: 2
        },
        {
          label: this.$t("shelf.move"),
          index: 3
        },
        {
          label: this.$t("shelf.remove"),
          index: 4
        }
      ]
    };
  },

  computed: {
    isSelected() {
      return this.shelfSelected && this.shelfSelected.length > 0;
    },

    // 判断选中书籍是否全部****
    isPrivate() {
      if (!this.isSelected) {
        return;
      } else {
        return this.shelfSelected.every(item => item.private);
      }
    },
    // 判断选中书籍是否全部****
    isDownload() {
      if (!this.isSelected) {
        return;
      } else {
        return this.shelfSelected.every(item => item.cache);
      }
    }
  },

  methods: {
    hidePopup() {
      this.popupMenu.hide();
    },
    onComplete() {
      this.hidePopup();
      this.setIsEditMode(false);
      saveBookShelf(this.shelfList);
    },

    async downloadSelectBook() {
      for (let i = 0; i < this.shelfSelected.length; i++) {
        await this.downloadBook(this.shelfSelected[i]).then(book => {
          book.cache = true;
        });
      }
    },
    downloadBook(book) {
      let text = "";
      const toast = this.toast({
        text
      });
      toast.continueShow();
      return new Promise((resolve, reject) => {
        download(
          book, //对应api的book
          book => {
            toast.remove();  //create-api方法？？？
            resolve(book);
          }, //对应api的onSuccess
          reject, //对应api的onError
          ProgressEvent => {
            const progress =
              Math.floor((ProgressEvent.loaded / ProgressEvent.total) * 100) +
              "%";
              text = this.$t("shelf.progressDownload").replace(
              "$1",
              `${book.fileName}.epub(${progress})`
            );
            toast.updateText(text);
          } //对应api的Onprogress
        );
      });
    },

    removeSelectedBook() {
      Promise.all(this.shelfSelected.map(book => this.removeBook(book))).then(
        books => {
          books.map(book => {
            book.cache = false;
          });
          saveBookShelf(this.shelfList);
          this.simpleToast(this.$t("shelf.removeDownloadSuccess"));
        }
      );
    },
    removeBook(book) {
      return new Promise((resolve, reject) => {
        removeLocalStorage(`${book.categoryText}/${book.fileName}-info`);
        removeLocalForage(`${book.fileName}`);
        resolve(book);
      });
    },

    // 设置***
    setPrivate() {
      let isPrivate;
      if (this.isPrivate) {
        isPrivate = false; //关闭私人阅读
      } else {
        isPrivate = true; //开启私人阅读
      }
      this.shelfSelected.forEach(item => (item.private = isPrivate)); //设置所有选中的书籍
      this.onComplete();

      if (isPrivate) {
        this.simpleToast(this.$t("shelf.setPrivateSuccess"));
      } else {
        this.simpleToast(this.$t("shelf.closePrivateSuccess"));
      }
    },
    // 设置***
    async setDownload() {
      this.onComplete();
      if (this.isDownload) {
        this.removeSelectedBook();
      } else {
        await this.downloadSelectBook();
        saveBookShelf(this.shelfList);
        this.simpleToast(this.$t("shelf.setDownloadSuccess"));
      }
    },
    // 设置***
    removeSelected() {
      // 遍历每本选中的书，在书架中过滤掉这些书籍，剩下的保留在书架中
      this.shelfSelected.forEach(item => {
        this.setShelfList(this.shelfList.filter(book => book != item));
      });
      // this.setShelfSelected([])
      this.onComplete();
    },

    //   私人阅读
    showPrivate() {
      this.popupMenu = this.popup({
        title: this.isPrivate
          ? this.$t("shelf.closePrivateTitle")
          : this.$t("shelf.setPrivateTitle"),
        btn: [
          {
            text: this.isPrivate
              ? this.$t("shelf.close")
              : this.$t("shelf.open"),
            click: () => {
              this.setPrivate();
            }
          },
          {
            text: this.$t("shelf.cancel"),
            click: () => {
              this.hidePopup();
            }
          }
        ]
      }).show();
    },
    //   下载电子书
    showDownload() {
      this.popupMenu = this.popup({
        title: this.isDownload
          ? this.$t("shelf.removeDownloadTitle")
          : this.$t("shelf.setDownloadTitle"),
        btn: [
          {
            text: this.isDownload
              ? this.$t("shelf.delete")
              : this.$t("shelf.open"),
            click: () => {
              this.setDownload();
            }
          },
          {
            text: this.$t("shelf.cancel"),
            click: () => {
              this.hidePopup();
            }
          }
        ]
      }).show();
    },
    //   移除书架
    showRemove() {
      let title;
      if (this.shelfSelected.length === 1) {
        title = this.$t("shelf.removeBookTitle").replace(
          "$1",
          `《${this.shelfSelected[0].title}》`
        );
      } else {
        title = this.$t("shelf.removeBookTitle").replace(
          "$1",
          this.$t("shelf.selectedBooks")
        );
      }
      this.popupMenu = this.popup({
        title: title,
        btn: [
          {
            text: this.$t("shelf.removeBook"),
            click: () => {
              this.removeSelected();
            }
          },
          {
            text: this.$t("shelf.cancel"),
            click: () => {
              this.hidePopup();
            }
          }
        ]
      }).show();
    },

    // 点击事件
    onTabClick(item) {
      // 如果没有选择书籍
      if (!this.isSelected) {
        return;
      }
      switch (item.index) {
        case 1:
          this.showPrivate();
          break;
        case 2:
          this.showDownload();
          break;
        case 3:
          this.dialog().show()
          break;
        case 4:
          this.showRemove();
          break;
      }
    },

    label(item) {
      switch (item.index) {
        case 1:
          return this.isPrivate ? item.label2 : item.label;
          break;
        case 2:
          return this.isDownload ? item.label2 : item.label;
          break;
        case 3:
          return  item.label;
          break;
        case 4:
          return  item.label;
          break;
        default:
          item.label;
      }
    }
  }
};
</script>

<style  lang="scss"  scoped>
@import "../../assets/styles/global";
.shelf-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 120;
  display: flex;
  height: px2rem(48);
  background-color: #fff;
  box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, 0.1);
  .shelf-footer-tab-wrapper {
    flex: 1;
    height: px2rem(48);

    .shelf-footer-tab {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      opacity: 0.5;
      &.is-selected {
        opacity: 1;
      }
      .tab-icon {
        font-size: px2rem(20);
        color: #666;
        &.icon-shelf {
          color: $color-pink;
        }
      }
      .tab-text {
        margin-top: px2rem(5);
        font-size: px2rem(12);
        color: #666;
        &.remove-text {
          color: $color-pink;
        }
      }
    }
  }
}
</style>
