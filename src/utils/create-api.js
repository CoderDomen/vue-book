import CreateAPI from "vue-create-api";
import Vue from "vue";
import Toast from "../components/common/Toast";
import Popup from "../components/common/Popup";
import GroupDialog from '../components/shelf/ShelfGroupDialog'

Vue.use(CreateAPI);
Vue.createAPI(Toast, true);
Vue.createAPI(Popup, true);
Vue.createAPI(GroupDialog, true);

Vue.mixin({
  methods: {
    toast(setting) {
      return this.$createToast({
        $props: setting
      });
    },
    popup(setting) {
      return this.$createPopup({
        $props: setting
      });
    },
    simpleToast(setting) {
      const toast = this.toast({
        text: setting
      });
      toast.show();
      toast.updateText(setting);
    },
    dialog(setting){
      return this.$createGroupDialog({
        $props: setting
      });
    }

  }
});
