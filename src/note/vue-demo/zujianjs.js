const btn ={
    template: `<div><button @click="count++">dianji{{count}}</button></div>`,
    data() {
        return{
            count: 0,
        }
    },
    methods: {},
    created() {},
};
Vue.component("wawawawacounts",btn);