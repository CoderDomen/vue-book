<template>
  <div class="store-home">
    <!-- 搜索框 -->
    <SearchBar></SearchBar>
    <!-- 弹出卡片 -->
    <FlapCard :data="random"></FlapCard>
    <!-- 滚动 -->
    <Scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <!-- 图片 -->
      <div class="banner-wrapper">
        <div class="banner-img" :style="{'backgroundImage':`url(${banner})`}"></div>
      </div>
      <!-- 猜你喜欢 -->
      <GuessYouLike :data="guessYouLike"></GuessYouLike>
      <!-- 热门推荐 -->
      <Recommend :data="recommend" class="recommend"></Recommend>
      <!-- 精选 -->
      <Featured
        :data="featured"
        class="featured"
        :titleText="$t('home.featured')"
        :btnText="$t('home.seeAll')"
      ></Featured>
      <!-- 分类列表 -->
      <div class="category-list-wrapper" v-for="(item,index) in categoryList" :key="index">
        <CategoryBook :data="item"></CategoryBook>
      </div>
      <!-- 分类 -->
      <Category :data="categories" class="categories"></Category>
    </Scroll>
  </div>
</template>

<script>
import { storeHomeMixin } from "../../utils/mixin";
import { home } from "../../api/store";
import SearchBar from "./SearchBar";
import FlapCard from "./FlapCard";

import Scroll from "../../components/common/Scroll";
import GuessYouLike from "./GuessYouLike";
import Recommend from "./Recommend";
import Featured from "./Featured";
import CategoryBook from "./CategoryBook";
import Category from "./Category";

export default {
  mixins: [storeHomeMixin],
  data() {
    return {
      scrollTop: 94,
      random: null,
      banner: '',
      categories: null,
      categoryList: null,
      featured: null,
      guessYouLike: null,
      recommend: null
    };
  },
  components: {
    SearchBar,
    FlapCard,
    Scroll,
    GuessYouLike,
    Recommend,
    Featured,
    CategoryBook,
    Category
  },
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY);
      if (offsetY > 0) {
        this.scrollTop = 52;
      } else {
        this.scrollTop = 94;
      }
      this.$refs.scroll.refresh();
    }
  },
  mounted() {
    home().then(res => {
      // console.log(res.data);
      const randomIndex = Math.floor(Math.random() * res.data.random.length);
      this.random = res.data.random[randomIndex];
      this.banner = res.data.banner;
      this.categories = res.data.categories;
      this.categoryList = res.data.categoryList;
      this.featured = res.data.featured;
      this.guessYouLike = res.data.guessYouLike;
      this.recommend = res.data.recommend;
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.store-home {
  width: 100%;
  height: 100%;
  .banner-wrapper {
    width: 100%;
    padding: px2rem(10);
    box-sizing: border-box;
    .banner-img {
      width: 100%;
      height: px2rem(150);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .recommend {
    margin-top: px2rem(20);
  }
  .featured {
    margin-top: px2rem(20);
  }
  .category-list-wrapper {
    margin-top: px2rem(20);
  }
  .categories {
    margin-top: px2rem(20);
  }
}
</style>
