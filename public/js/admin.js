$(function () {
    console.log('heiheihei')
    $('.del').click(function (e) {
        var target = $(e.target);
        var id = target.data('id'); // $(xx).data('mm')是jquery的方法
        var tr = $('.item-id-' + id);

        $.ajax({
            type: 'DELETE',
            url: '/admin/control/delete?id=' + id
        })
        .done(function (results) {
            if (results.success) {
                alert('成功删除本条记录')
                if (tr.length > 0) {
                    tr.remove();
                }
            }
        })
    });
});
