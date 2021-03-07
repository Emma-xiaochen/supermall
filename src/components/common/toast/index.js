import Toast from './Toast'

const obj = {}

obj.install = function (Vue) {
  /* 
  // 方法一： 失败，Toast可能未挂在成功
  Vue.extend(Toast)
  console.log(Toast.$el);
  document.body.appendChild(Toast.$el)
  Vue.prototype.$toast = Toast;
  */
  
  // 1. 创建组建构造器
  const toastContrustor = Vue.extend(Toast)

  // 2. new的方式，根据组建构造器，可以创建出来一个组件对象
  const toast = new toastContrustor()

  // 3. 将组件对象，手动挂载到某一个元素上
  toast.$mount(document.createElement('div'))

  // 4. toast.$el对应的就是div
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast = toast;
}

export default obj