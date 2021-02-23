import { debounce } from "common/utils"
import BackTop from "components/content/backTop/BackTop"


export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      isShowBackTop: false
    }
  },
  components: {
    BackTop
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    listenShowBackTop(position) {
      this.isShowBackTop = (-position.y) > 1000
    }
  },
  // 把Home和Detail共同的mounted生命周期里的代码混入进来
  mounted() {
    // 1. 图片加载完成的事件监听
    let refresh = debounce(this.$refs.scroll.refresh,200)

    // 2.对监听的事件进行保存
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
    // console.log('我是混入中的内容');
  }
}

