import MyDialog from './MyDialog.vue';

MyDialog.install = function (Vue) {
  Vue.component(MyDialog.name, MyDialog);
};

export default MyDialog;