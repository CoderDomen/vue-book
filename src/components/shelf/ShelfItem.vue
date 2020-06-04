<template>
  <div
    class="shelf-item"
    :class="{'shelf-item-shadow' : data.type ===1 ||data.type ===2}"
    @click="onShelfItemClick"
  >
    <component
      :is="item"
      :data="data"
      class="shelf-item-comp"
      :class="{'is-edit':isEditMode && data.type===2}"
    ></component>
    <div
      class="icon-selected"
      v-show="isEditMode &&data.type ===1"
      :class="{'is-selected':data.selected}"
    ></div>
  </div>
</template>

<script>
import { storeShelfMixin } from "../../utils/mixin";

import { gotoStoreHome } from "../../utils/book";
import ShelfItemBook from "./ShelfItemBook";
import ShelfItemAdd from "./ShelfItemAdd";
import ShelfItemCategory from "./ShelfItemCategory";
export default {
  mixins: [storeShelfMixin],

  props: {
    data: Object
  },
  data() {
    return {
      book: ShelfItemBook,
      add: ShelfItemAdd,
      category: ShelfItemCategory
    };
  },
  computed: {
    item() {
      return this.data.type === 1
        ? this.book
        : this.data.type === 2
        ? this.category
        : this.add;
    }
  },
  methods: {
    onShelfItemClick() {
      if (this.isEditMode) {
        this.data.selected = !this.data.selected;
        if (this.data.selected) {
          this.shelfSelected.pushWithoutDuplicate(this.data);
       
          
        } else {
          this.setShelfSelected(
            this.shelfSelected.filter(item => {
              return item.id != this.data.id;
            })
          );
       
          
        }
      } else {
        if (this.data.type === 1) {
          this.showBookDetail(this.data);
        } else if (this.data.type === 2) {
          this.$router.push({
            path:'/store/category',
            query:{
              title:this.data.title
            }
          })
        } else {
           this.$router.push({
            path:'/store/home'   
          })
          
        }
      }
    }
  },

  components: { ShelfItemBook, ShelfItemAdd, ShelfItemCategory }
};
</script>

<style  lang='scss' scoped>
@import "../../assets/styles/global";
.shelf-item {
  position: relative;
  width: 100%;
  height: 100%;
  //   background-color: blue;
  &.shelf-item-shadow {
    box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, 0.3);
  }
  .icon-selected {
    position: absolute;
    bottom: px2rem(2);
    right: px2rem(2);
    font-size: px2rem(18);
    color: rgba(0, 0, 0, 0.4);
    &.is-selected {
      color: $color-blue;
    }
  }
  .shelf-item-comp {
    opacity: 1;
    &.is-edit {
      opacity: 0.5;
    }
  }
}
</style>
