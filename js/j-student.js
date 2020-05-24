let nowPage = 1;
let pageSize = 10;
let allPageSize = 0;
let sheetData = [];
let sheetinfodata = []
function init() {
  bindEvent()
  $('.list').trigger('click')
}

function bindEvent() {
  let flag = false
  $('#menu-list').on('click', 'dd', function () {
    $(this).siblings().removeClass('active')//移除元素身上的class类名(active)
    $(this).addClass('active')//点击当前元素添加上active
    const id = $(this).data('id');//取到自定义数据
    // console.log(id)

    if (id == 'student-list') {
      listSheet();
    }
    $('.content').fadeOut()
    $('#' + id).fadeIn()

  })
  $('#add-student-but').on('click', function (e) {
    e.preventDefault();
    const data = $('#add-student-form').serializeArray()
    const forData = jsonData(data)

    transferData('/api/student/addStudent', forData, function (res) {
      $('#add-student-form')[0].reset();
      const icfoim = confirm('添加成功，是否跳转');
      if (icfoim) {
        $('.list').trigger('click')
      }
    })
  })
  $('#student-list-body').on('click', '#edit', function (e) {
    const index = $(this).data('index')
    sheetinfo(sheetData[index])
    $('.dailog ').slideDown()
  })
  $('.mask').on('click', function () {
    $('.dailog ').slideUp()
  })
  $('#end-but').on('click', function (e) {
    e.preventDefault()
    flag = false
    if (flag) {
      return false

    }
    flag = true
    const data = $('#end-student-form').serializeArray()
    sheetinfodata = jsonData(data)
    transferData('/api/student/updateStudent', sheetinfodata, function (res) {
      $('#end-student-form')[0].reset();
      const icfoim = confirm('修改成功，是否跳转');
      if (icfoim) {
        $('.list').trigger('click')
        $('.dailog ').slideUp()
      }
    })
  })
  flag = false
  $('#student-list-body').on('click', '#del', function (e) {
    const index = $(this).data('index')
    console.log({ sNo: sheetData[index].sNo })
    const icfoim = confirm(`否要删除，学号：${sheetData[index].sNo}姓名：${sheetData[index].name}，的这个学员`);
    if (icfoim) {
      transferData('/api/student/delBySno', { sNo: sheetData[index].sNo }, function (res) {
        $('.list').trigger('click')

      })
    }

  })
  $('#shenc-but').on('click', function () {
    const val = $('#shenc-word').val()
    if (val) {
      shenc(val)
    } else {
      $('.list').trigger('click')
    }
  })
}
function shenc(val) {
  transferData('/api/student/searchStudent', {
    sex: -1,
    search: val,
    page: nowPage,
    size: pageSize
  }, function (res) {
    if (!res.data.searchList[0]) {
      alert('关键字搜索支持按学号查询，地址，邮箱')
      $('.list').trigger('click')
      $('#shenc-word').val('')
    }
    allPageSize = res.data.cont
    studentS(res.data.searchList)
  })
}
function sheetinfo(data) {
  const sheetform = $('#end-student-form')[0]
  for (let prop in data) {
    if (sheetform[prop]) {
      sheetform[prop].value = data[prop]
    }

  }

}
function jsonData(data) {
  let obj = {};
  for (let i = 0; i < data.length; i++) {
    if (!obj[data[i].name]) {
      obj[data[i].name] = data[i].value
    }
  }
  return obj
}
function listSheet() {
  transferData('/api/student/findByPage', {
    page: nowPage,
    size: pageSize
  }, function (res) {
    allPageSize = res.data.cont;
    sheetData = res.data.findByPage;
    studentS(sheetData)
  })
}
function studentS(data) {
  console.log(data)
  let str = '';
  let date = new Date().getFullYear()
  data.forEach(function (ele, index) {
    str += `<tr>
      <td>${ele.sNo}</td>
      <td>${ele.name}</td>
      <td>${ele.sex == 0 ? '女' : '男'}</td>
      <td>${ele.email}</td>
      <td>${date - ele.birth}</td>
      <td>${ele.phone}</td>
      <td>${ele.address}</td>
      <td>
        <button class="success" id="edit" data-index=${index}>编辑</button>
        <button id="del" class="del" data-index=${index}>删除</button>
      </td>
    </tr>`
  })
  $('#student-list-body').html(str)
  $('#wrap').page({
    allPageSize: allPageSize,
    nowPage: nowPage,
    pageSize: pageSize,
    showPageSize: true,
    changePageCb: function (obj) {
      // pageSize = 
      pageSize = obj.pageSize
      nowPage = obj.nowPage
      listSheet()

    }
  })
}
function transferData(url, data, cd) {
  if (!data) {
    data = {}
  }
  $.ajax({
    type: 'get',
    url: 'http://api.duyiedu.com' + url,
    data: $.extend(data, {
      appkey: 'jiangdandan_1572068232941'
    }),
    dataType: 'json',
    success: function (res) {
      console.log(res)
      if (res.status == 'success') {
        cd(res)
      } else {
        alert(res.msg)
      }
    }
  })
}
init()