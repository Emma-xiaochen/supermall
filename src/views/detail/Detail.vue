<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentStroll">
      <!-- 属性：topImages 传入值：top-images -->
      <ul style="width:100%;index:10">
        <li v-for="item in $store.state.cartList" :key="item.index">
          {{item}}
        </li>
      </ul>
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info  ref="comment" :comment-info="commentInfo" />
      <goods-list  ref="recommend" :goods="recommends" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <detail-bottom-bar @addCart="addToCart"/>
  </div>
</template>

<script>
  import DetailNavBar from "./childComp/DetailNavBar"
  import DetailSwiper from "./childComp/DetailSwiper"
  import DetailBaseInfo from "./childComp/DetailBaseInfo"
  import DetailShopInfo from "./childComp/DetailShopInfo"
  import DetailGoodsInfo from "./childComp/DetailGoodsInfo"
  import DetailParamInfo from "./childComp/DetailParamInfo"
  import DetailCommentInfo from "./childComp/DetailCommentInfo"
  import DetailBottomBar from './childComp/DetailBottomBar'

  import Scroll from "components/common/scroll/Scroll"
  import GoodsList from "components/content/goods/GoodsList"


  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail"
  import {itemListenerMixin} from "common/mixin"
  import {debounce} from "common/utils";


  export default {
    name: "Detail",
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList
    },
    mixins: [itemListenerMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
      }
    },
    created() {
      // 1. 保存传入的iid
      // console.log(this.$route.params);
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 1. 获取顶部的图片轮播数据
        console.log(res);
        const data = res.result

        this.topImages = data.itemInfo.topImages

        // 2. 获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3. 创建商家信息的对象
        this.shop = new Shop(data.shopInfo)

        // 4. 保存商品的详情数据
        this.detailInfo = data.detailInfo

        // 5. 获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 6.获取评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }

        /* 
        // 第一次获取，值不对：DOM里的this.$refs.params.$el压根没有渲染
        // this.themeTopYs = []
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

        // 第二次渲染
        // this.$nextTick(() => {
        // 值不对：图片没有加载完成，没有计算在offsetTop中
          // 根据最新的数据，对应的DOM是已经被渲染出来
          // 但是图片是依然没有加载完的
          // this.themeTopYs = []
          // this.themeTopYs.push(0)
          // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

          //  console.log(this.themeTopYs);
          // this.themeTopYs.push(参数的offsetTop)
          // this.themeTopYs.push(评论的offsetTop)
          // this.themeTopYs.push(推荐的offsetTop)
        // })
        */
      }),

      // 3. 请求推荐数据
      getRecommend().then(res => {
        // console.log(res);
        this.recommends = res.data.list
      })

      // 给getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
      this.getThemeTopY = debounce(() => {
          this.themeTopYs = []
          this.themeTopYs.push(0);
          this.themeTopYs.push(this.$refs.params.$el.offsetTop);
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
          this.themeTopYs.push(Number.MAX_VALUE)
          console.log(this.themeTopYs);
      }, 100)
    },
    methods: {
      imageLoad() {
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index) {
        // console.log(index);
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentStroll(position) {
        // 1. 获取y值
        const positionY = -position.y
        let length = this.themeTopYs.length

        // 2.positionY和主题中的值进行对比
        // [0, 5752, 6519, 6851, (Number.MAX_VALUE]
        // console.log(Number.MAX_VALUE);

        // positionY 在 0 和 5752, index = 0
        // positionY 在 5752 和 6519, index = 1
        // positionY 在 6519 和 6851, index = 2
        // positionY 在 大于等于 6851值时, index = 3

        // for(let i = 0; i < length-1; i++) {
        //     if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
        //         this.currentIndex = i;
        //         this.$refs.nav.currentIndex = this.currentIndex
        //   }
        // }
        
        for(let i = 0;i <length -1; i++) {
          if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }

        // 3. 是否显示回到顶部
        this.listenShowBackTop(position)

      },
      addToCart() {
        // 1. 获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        // 2. 将商品添加到购物车里
        // this.$store.cartList.push(product)
        // this.$store.commit('addCart', product)
        this.$store.dispatch('addCart', product)
      }
    },
    mounted() {
    },
    destroyed() {
       this.$bus.$on('itemImageLoad',this.itemImgListener)
      }
    }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    background-color: #fff;
    z-index: 9;
  }

  .content { 
    height: calc(100% - 44px);
  }
</style>