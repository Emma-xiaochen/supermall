import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import toast from 'components/common/toast'

Vue.config.productionTip = false

// 添加时间总线对象
Vue.prototype.$bus = new Vue()

// 安装toast插件
Vue.use(toast)

// 解决移动端300ms延迟
FastClick.attach(document.body)

// 使用懒加载的插件
Vue.use(VueLazyLoad, {
  loading: require('./assets/img/common/placeholder.png')
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')



// console.log('aaaa');

// setTimeout(() => {
//   console.log('bbbb');
// })

// console.log('cccc');

// aaaa -> cccc-> bbbb

// ES6里的继承方法 
// 继承的都是一些对象
// class Animal {
//   run() {

//   }
// }

// class Rerson extends Animal {
//   // run() {

//   // }
// }

// class Dog extends Animal {
//   // run() {

//   // }
// }

const num = 0
console.log(!num);