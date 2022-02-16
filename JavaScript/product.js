import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.27/vue.esm-browser.min.js';
import pagination from './pagination.js';

let productModal = null;
let deleteModal = null;

const app = createApp({
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'zhang-hexschool',
            products: [],
            tempProduct: {
                imagesUrl: [],
            },
            isNew: false,
            pagination: {},
        };
    },
    methods: {
        //驗證是否登入
        loginCheck() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
                .then(() => {
                    this.getProducts();
                })//驗證成功 -> 執行 getData，渲染出產品列表
                .catch((error) => {
                    alert(error.data.message);//驗證失敗 -> 取得 message 的字串
                    window.location = 'index.html';//驗證失敗 -> 導回登入頁面
                })
        },
        //取得後台產品列表
        getProducts(page = 1) { //參數預設值
            //query方法使用?page=${page}
            //param
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`;
            axios.get(url)
                .then((response) => {
                    this.products = response.data.products;
                    this.pagination = response.data.pagination;
                })
                .catch((err) => {
                    alert(err.data.message);
                    window.location = 'index.html';//驗證失敗 -> 導回登入頁面
                })
        },
        
        openModal(isNew, item) {
            if (isNew === 'new') {
                this.tempProduct = { //重製結構
                    imagesUrl: [],
                }
                this.isNew = true; //如果是新的會新增
                productModal.show();
            } else if (isNew === 'edit') {
                this.tempProduct = { ...item };//外層使用淺拷貝就好--因為物件本身是傳參考，如果直接改product會影響本來的值
                this.isNew = false; //編輯頁會是舊的
                productModal.show();
            } else if (isNew === 'delete') {
                this.tempProduct = { ...item };//將item品項帶入
                deleteModal.show();
            }
        },
        //將外層updateProduct往內層丟
        //將外層deleteProduct往內層丟
    },
    mounted() {
        
        //取得Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        //有正確取得token，放入headers
        //console.log(token);
        axios.defaults.headers.common.Authorization = token;
        //如何夾帶驗證資訊過去呢？下次發送 axios 預設把 token 內容直接加到 headers 裡面
        this.loginCheck();//執行驗證

        
    }
})

// 分頁元件
app.component('pagination', {
    props: ['pages'],
    methods: {
        emitPages(item) {
            this.$emit('emit-pages', item);
        },
    },
});

//全域註冊  產品新增/編輯元件
app.component('productModal', {
    props: ['tempProduct', 'isNew'],
    template: '#productModal',
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'zhang-hexschool',
        };
    },
    methods: {
        updateProduct() {
            // 新增商品
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let method ='post';
            if (!this.isNew) { //false，不是新增商品，則切換編輯商品API
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                method ='put';
            }

            axios[method](url, { data: this.tempProduct })//[]帶變數
                .then((response) => {
                    console.log(response);
                    //this.getProducts(); //沒有get Product(外層的方法)
                    this.$emit('get-products')//觸發外層事件
                    this.hideModal();//將Model關掉
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        },
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
        openModal() {
            productModal.show();
        },
        hideModal() {
            productModal.hide();
        },
    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
    }
})

//全域註冊，刪除 Modal
app.component('deleteModal', {
    props: ['tempProduct'], //deleteModal 樣板內有使用到 tempProduct 資料，元件內需定義
    template: '#delProductModal',
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'zhang-hexschool',
        };
    },
    methods: {
        delProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

            axios.delete(url)
                .then((response) => {
                    console.log(response);
                    this.$emit('get-products')//觸發外層事件
                    deleteModal.hide();//將Model關掉
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        },
        openModal() {
            deleteModal.show();
        },
        hideModal() {
            deleteModal.hide();
        },
    },
    mounted() {
        deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    }
});

app.mount('#app');