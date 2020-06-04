<template>
  <transition name="fade">
    <div class="shelf-title" v-show="shelfTitleVisible" :class="{'hide-shadow':isHideShadow}">
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{title}}</span>
        <span class="shelf-sub-title-text" v-show="isEditMode">{{selectedText}}</span>
      </div>
      <!-- 左侧按钮  清除缓存和返回-->
      <div class="shelf-title-btn-wrapper shelf-title-left" @click="clearCache" v-if="showClear">
        <div class="shelf-title-btn-text">{{$t('shelf.clearCache')}}</div>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left" @click="back" v-if="showBack">
        <span class="icon-back"></span>
      </div>
      <!-- 右侧按钮点击编辑 -->
      <div class="shelf-title-btn-wrapper shelf-title-right" @click="onEditClick" v-if="showEdit">
        <div class="shelf-title-btn-text">{{isEditMode? $t('shelf.cancel'):$t('shelf.edit')}}</div>
      </div>

      <!-- 修改分组按钮，可能在左，可能在右 -->
      <div
        class="shelf-title-btn-wrapper"
        :class="{'shelf-title-left':changGroupLeft,'shelf-title-right':changGroupRight}"
        @click="changGroup"
        v-if="showChangGroup"
      >
        <span class="shelf-title-btn-text">{{$t('shelf.editGroup')}}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { storeShelfMixin } from "../../utils/mixin";
import { clearLocalStorage, saveBookShelf } from "../../utils/localStorage";
import { clearLocalForage } from "../../utils/localForage";
export default {
  mixins: [storeShelfMixin],
  props: {
    title: ""
  },
  computed: {
    // 右侧按钮显示：编辑，修改分组
    emptyCategory() {
      return (
        !this.shelfCategory ||
        !this.shelfCategory.itemList ||
        this.shelfCategory.itemList.length === 0
      );
    },
    showEdit() {
      return this.currentType === 1 || !this.emptyCategory;
    },

    // 左侧按钮显示： 返回， 清除缓存，修改分组
    showClear() {
      return this.currentType === 1;
    },
    showBack() {
      return this.currentType === 2 && !this.isEditMode;
    },
    showChangGroup() {
      return this.currentType === 2 && (this.isEditMode || this.emptyCategory);
    },
    // 修改分组显示在左在右
    changGroupLeft() {
      return !this.emptyCategory;
    },
    changGroupRight() {
      return this.emptyCategory;
    },

    selectedText() {
      const slectedNumber = this.shelfSelected ? this.shelfSelected.length : 0;
      return slectedNumber <= 0
        ? this.$t("shelf.selectBook")
        : slectedNumber === 1
        ? this.$t("shelf.haveSelectedBook").replace("$1", slectedNumber)
        : this.$t("shelf.haveSelectedBooks").replace("$1", slectedNumber);
    },
    popupCancelBtn() {
      return {
        text: this.$t("shelf.cancel"),
        type: "normal",
        click: () => {
          this.hidePopup();
        }
      };
    }
  },
  methods: {
    onComplete() {
      this.hidePopup();
      //注意箭头函数的{}，需要自行设置return
      this.setShelfList(
        this.shelfList.filter(book => {
         return book.id !== this.shelfCategory.id;
        })  //删除该分类
      ).then(() => {
        // console.log(this.shelfList);
        
        saveBookShelf(this.shelfList);
        this.$router.go(-1);
        this.setIsEditMode(false);
      });
    },
    // 选中分组中所有书籍，将其添加到shelfList中，然后再删除该分类
    deleteGroup() {
      if (!this.emptyCategory) {      
        this.setShelfSelected(this.shelfCategory.itemList);
        this.moveOutOfGroup(this.onComplete);
      } else {
        this.onComplete();
      }
    },
    hidePopup() {
      this.popupMenu.hide();
    },
    changGroupName() {
      this.hidePopup();
      this.dialog({
        showNewGroup: true,
        groupName: this.shelfCategory.title
      }).show();
    },
    showDeleteGroup() {
      this.hidePopup(); //存在0.2s的过渡动画，需要等结束后再重新弹出新的popup
      setTimeout(() => {
        this.popupMenu = this.popup({
          title: this.$t("shelf.deleteGroupTitle"),
          btn: [
            {
              text: this.$t("shelf.confirm"),
              type: "danger",
              click: () => {
                this.deleteGroup();
              }
            },
            this.popupCancelBtn
          ]
        }).show();
      }, 200);
    },
    changGroup() {
      this.popupMenu = this.popup({
        btn: [
          {
            text: this.$t("shelf.editGroupName"),
            type: "normal",
            click: () => {
              this.changGroupName();
            }
          },
          {
            text: this.$t("shelf.deleteGroup"),
            type: "danger",
            click: () => {
              this.showDeleteGroup();
            }
          },
          this.popupCancelBtn
        ]
      }).show();
    },

    back() {
      this.$router.go(-1);
      this.setIsEditMode(false);
    },
    onEditClick() {
      // 每次点击时先判断是否为false，先清除，再进行设置
      if (!this.isEditMode) {
        this.setShelfSelected([]);
        this.shelfList.forEach(item => {
          item.selected = false;
          if (item.itemList && item.itemList.length > 0) {
            item.itemList.forEach(subitem => {
              subitem.selected = false;
            });
          }
        });
      }
      this.setIsEditMode(!this.isEditMode);
    },
    // 清除缓存
    clearCache() {
      clearLocalStorage();
      clearLocalForage();
      this.setShelfList([]);
      this.setShelfSelected([]);
      this.getShelfList();
      this.simpleToast(this.$t("shelf.clearCacheSuccess"));
    }
  },
  watch: {
    offsetY(v) {
      if (v > 0) {
        this.isHideShadow = false;
      } else {
        this.isHideShadow = true;
      }
    }
  },

  data() {
    return {
      isHideShadow: true
    };
  },
  components: {}
};
</script>

<style  lang='scss' scoped>
@import "../../assets/styles/global";
.shelf-title {
  position: relative;
  z-index: 130;
  //   top: 0;
  //   left: 0;
  width: 100%;
  height: px2rem(42);
  background-color: #fff;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);

  &.hide-shadow {
    box-shadow: none;
  }
  .shelf-title-text-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .shelf-title-text {
      font-size: px2rem(16);
      line-height: px2rem(20);
      color: #333;
      font-weight: bold;
    }
    .shelf-sub-title-text {
      font-size: px2rem(10);
      color: #333;
    }
  }
  .shelf-title-btn-wrapper {
    position: absolute;
    top: 0;
    height: 100%;
    @include center;
    box-sizing: border-box;
    &.shelf-title-left {
      left: 0;
      padding-left: px2rem(15);
    }
    &.shelf-title-right {
      padding-right: px2rem(15);
      right: 0;
    }
    .shelf-title-btn-text {
      font-size: px2rem(14);
      color: #666;
    }
    .icon-back {
      font-size: px2rem(20);
      color: #666;
    }
  }
}
</style>
