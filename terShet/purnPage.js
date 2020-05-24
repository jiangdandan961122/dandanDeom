(function ($) {
  function TurnPage(options) {
    this.warp = options.warp;//翻页插件的父元素
    this.nowPage = options.nowPage;//当前为第几页
    this.allPageSize = options.allPageSize//总的条数
    this.pageSize = options.pageSize//每页多少条
    this.allPage = Math.ceil(this.allPageSize / this.pageSize);//总的页数
    this.changePageCb = options.changePageCb;
    this.init = function () {//初始化方法
      this.renderDom();//添加dom
      this.bindEvent();//页码以及上下页的点击事件
    }
  }
  TurnPage.prototype.renderDom = function () {
    $(this.warp).empty()//每次点击清空通过append添加的元素
    var oDiv = $('<div class="page-size"><span>每页条数</span><input class="input" type="number" min=1 max=50  value="'+ this.pageSize+'"/></div>')
      oDiv.appendTo(this.warp)
    let OUl = $('<ul class="my-turn-page"></ul>')
    if (this.nowPage > 1) {
      $('<li class="prev-page">上一页</li>').appendTo(OUl);
    } else {
      $('<li class="prev-no">上一页</li>').appendTo(OUl);
    }
    if (this.nowPage > 3) {
      $('<li class="num">1</li>').appendTo(OUl);
    } 
    if (this.nowPage >4 ) {
      $('<span>...</span>').appendTo(OUl);
    }
  
      for (let i = this.nowPage - 2; i <= this.nowPage + 2; i++) {
        if (i == this.nowPage) {
          $('<li class="num active">' + i + '</li>').appendTo(OUl);
        } else if(i>0 && i<=this.allPage){
          $('<li class="num">' + i + '</li>').appendTo(OUl);
        }

      }
    if (this.nowPage + 2 < this.allPage - 1) {
      $('<span>...</span>').appendTo(OUl);
    }
    if (this.allPage + 2 < this.allPage) {
      $('<li class="num">' + this.allPage + '</li>').appendTo(OUl);
    }
    if (this.nowPage < this.allPage) {
      $('<li class="next-page">下一页</li>').appendTo(OUl);

    } else {
      $('<li class="prev-no">下一页</li>').appendTo(OUl);

    }
    $(this.warp).append(OUl)
  },
    TurnPage.prototype.bindEvent = function () {
      const slfa = this
        $('.num',this.warp).on('click',function(){
            const page = parseInt( $(this).text())
            console.log(slfa)
            // slfa.nowPage = page
            slfa.changePage(page)
        })
        $('.prev-page',this.warp).on('click',function(){
          if(slfa.nowPage >1){
            slfa.changePage(slfa.nowPage - 1)
          }
        })
        $('.next-page',this.warp).on('click',function(){
          if(slfa.nowPage < slfa.allPage){
            slfa.changePage(slfa.nowPage + 1)
          }
        })
        $('.input',this.warp).change(function(e){
            slfa.pageSize = parseInt($(this).val());
            slfa.allPage = Math.ceil(slfa.allPageSize/slfa.pageSize)
            slfa.changePage(1)
            
        })
    },
    TurnPage.prototype.changePage = function(page){
      this.nowPage = page
      this.init();
      this.changePageCb&& this.changePageCb({
        nowPage:this.nowPage,
        pageSize:this.pageSize
      })
    }
  $.fn.extend({
    page: function (options) {
      options.warp = this
      const pageObj = new TurnPage(options)
      pageObj.init();
      return this
    }
  })
})(jQuery)