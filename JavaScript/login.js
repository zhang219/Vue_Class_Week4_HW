import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
    data() {
        return {
            user: {
                username: '',
                password: '',
            },
        }
    },
    methods:{
        login() {
            const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
            axios.post(api, this.user)
                .then((response) => {
                    const { token, expired } = response.data;
                    //寫入 cookie token
                    //expires 設置有效時間
                    document.cookie = `hexToken=${ token }; expires=${ new Date(expired) };`;
                    //somecookie自訂義名稱 = 值，expires是時間格式 用 newDate來做轉型
                    window.location = 'product.html';
                })
                .catch((error) => {
                    alert(error.data.message);
            });
        },
    },
}).mount('#app');