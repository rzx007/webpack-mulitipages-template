// observe compile watcher 关联器 入口
import "@/style/index.css";
import "@/style/leo.scss";
import SelfVue from "@/vue";
import $ from "Jquery";
new SelfVue({
 el: '#app',
 data: {
   title: 'hello PageB',
   name: 'rzx'
 },
 methods: {
   clickMe: function () {
     this.title = 'hello PageB';
   }
 },
 mounted: function () {
   window.setTimeout(() => {
     this.title = '你好 PageB';
   }, 1000);
 }
});