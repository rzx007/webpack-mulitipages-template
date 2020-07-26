// observe compile watcher 关联器 入口
 import "@/style/index.css";
 import "@/style/leo.scss";
import SelfVue from "@/vue";
new SelfVue({
  el: '#app',
  data: {
    title: 'hello world',
    name: 'rzx'
  },
  methods: {
    clickMe: function () {
      this.title = 'hello world';
    }
  },
  mounted: function () {
    window.setTimeout(() => {
      this.title = '你好';
    }, 1000);
  }
});