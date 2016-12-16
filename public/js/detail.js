$(function(){
  $('.comment').click(function(){
    var target = $(this)
    var toId = target.data('tid')       // 评论给谁
    var commentId = target.data('cid')  // comment对象的 _id

    // 解决是否已经插入了隐藏域
    if($('#toId').length > 0){
      $('#toId').val(toId)
    }else{
      $('<input>').attr({
        type: 'hidden',
        id: 'toId',
        name: 'comment[tid]',
        value: toId
      }).appendTo('#commentForm')
    }

    if($('#commentId').length > 0){
      $('#commentId').val(commentId)
    }else{
      $('<input>').attr({
        type: 'hidden',
        id: 'commentId',
        name: 'comment[cid]',
        value: commentId
      }).appendTo('#commentForm')
    }  
  })
})
