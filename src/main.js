import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

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