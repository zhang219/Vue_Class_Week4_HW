export default {
    props: ['pages'],//使用props接收值，定義接收到的值命名為pages
    template: `<nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: !pages.has_pre }">
        <a class="page-link" href="#" aria-label="Previous" @click.prevent="$emit('get-product', pages.current_page - 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item"
      :class="{ active: page === pages.current_page }"
      v-for="page in pages.total_pages" :key="page +'page'">
        <a class="page-link" href="#" 
        @click.prevent="$emit('get-product', page)">{{page}}</a>
      </li>
      <li class="page-item"  :class="{ disabled: !pages.has_next }">
        <a class="page-link" href="#" aria-label="Next" @click.prevent="$emit('get-product', pages.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`
}
//加上Active視覺效果
//事件發送使用@click="$emit"
//@click.prevent="事件名稱"，.prevent 修飾符是用於停止預設行為的發生
