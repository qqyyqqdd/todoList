$(function(){
    // 加载页面
    loadItem();
    // 新增事项
    $('.input-area a').on('click',addItem);
    $(window).on('keypress',function(event){
        if(event.key == 'Enter') {
            addItem();
        }
    })
    $('.list ul').on('mouseover','li',function(){
        $(this).children('a').stop().show(300);
    })
    $('.list ul').on('mouseout','li',function(){
        $(this).children('a').stop().hide(300);
    })
    // 删除事项
    $('.list ul').on('click','li a.icon-guanbi',function(){
        delLocalStorage($(this).parent());
        $(this).parent().hide(300,function(){
            loadItem();
        });
    })
    // 清空某一列表
    $('a.clear').on('click',function(){
        if($(this).prop('id')=='clear-on'){
            delAllList(false);
            $(this).siblings('ul').children().hide(300,function(){
                loadItem();
            })
        }else {
            delAllList(true);
            $(this).siblings('ul').children().hide(300,function(){
                loadItem();
            })
        }
    });
    // 完成事项
    $('.ongoing .list ul').on('change','input[type="checkbox"]',function(){
        $(this).siblings('label').toggleClass('icon-check-box-blank');
        $(this).siblings('label').toggleClass('icon-baseline-check_box-px');
        moveToDone($(this).parent());
    })
    // 完成事项置未完成
    $('.done .list ul').on('change','input[type="checkbox"]',function(){
        $(this).siblings('label').toggleClass('icon-check-box-blank');
        $(this).siblings('label').toggleClass('icon-baseline-check_box-px');
        moveToOn($(this).parent());
    })
    // 全部完成
    $('a.alldone').on('click',function(){
        $.each($('.ongoing input[type="checkbox"]'),function(i,e){
            $(this).change();
        });
        $('.ongoing a.clear').click();
    })
});

// 本地数据渲染到界面中
function loadItem(){
    let on = getLocalStorage(false);
    let ongoingList = $('.ongoing ul');
    ongoingList.empty();
    let done = getLocalStorage(true);
    let doneList = $('.done ul');
    doneList.empty();
    $.each(on,function(i,e){
        let li = $('<li></li>');
        li.append($('<label for="ongoing'+i+'" class="iconfont icon-check-box-blank"></label>'));
        li.append($('<input type="checkbox" name="" id="ongoing'+i+'" hidden>'));
        li.append($('<span>'+e.title+'</span>'));
        li.append($('<a class="iconfont icon-guanbi" href="javascript:;" hidden></a><a class="iconfont icon-xiugai" href="javascript:;" hidden></a>'));
        ongoingList.prepend(li);
    });
    $.each(done,function(i,e){
        let li = $('<li></li>');
        li.append($('<label for="done'+i+'" class="iconfont icon-baseline-check_box-px"></label>'));
        li.append($('<input type="checkbox" name="" id="done'+i+'" hidden checked>'));
        li.append($('<span>'+e.title+'</span>'));
        li.append($('<a class="iconfont icon-guanbi" href="javascript:;" hidden></a><a class="iconfont icon-xiugai" href="javascript:;" hidden></a>'));
        doneList.prepend(li);
    });
    $('.ongoing .title p').html(ongoingList.children().length);
    $('.done .title p').html(doneList.children().length);
}

// 新增待办事项
function addItem(event,ele){ 
    let item = null;
    if(ele) {
        item = ele;
        let list = getLocalStorage(ele.done);
        list.push(item);
        saveLocalStorage(JSON.stringify(list),ele.done);
    }else {
        item = {
            title:$('.input-area input').val(),
            done:false
        };
        if(item.title) {
            let list = getLocalStorage(false);
            list.push(item);
            saveLocalStorage(JSON.stringify(list),false);
            $('.input-area input').val('');
        }  
    }
    loadItem();
}

// 将未完成事项移动到已完成
function moveToDone(e) {
    console.log(e);
    e.hide(300,function(){
        e.children('input[type="checkbox"]').prop('checked',false);
        e.children('a.icon-guanbi').click();
        let item = {
            title: e.children('span').html(),
            done: true
        };
        addItem(null,item);
    });
}
// 将已完成的移动到未完成
function moveToOn(e) {
    console.log(e);
    e.hide(300,function(){
        e.children('input[type="checkbox"]').prop('checked',true);
        e.children('a.icon-guanbi').click();
        let item = {
            title: e.children('span').html(),
            done: false
        };
        addItem(null,item);
    });
}
// 本地存储相关操作
// 读取本地存储 
// return [{}]
function getLocalStorage(done) {
    let data = null;
    if(done) {
        data = localStorage.getItem('todoList-done');
    } else {
        data = localStorage.getItem('todoList-on');
    }
    if(data) {
        return JSON.parse(data);
    } else {
        return [];
    }
}
// 保存本地存储数据
// input {string,boolean}
function saveLocalStorage(data,done) {
    if(done) {
        localStorage.setItem('todoList-done',data);
    } else {
        localStorage.setItem('todoList-on',data);
    }
}
// 删除本地存储
function delLocalStorage(e) {
    let local = getLocalStorage(e.children('input[type="checkbox"]').prop('checked'));
    console.log(local);
    index = local.length - e.index() -1;
    local.splice(index,1);
    saveLocalStorage(JSON.stringify(local),e.children('input[type="checkbox"]').prop('checked'));
}
// 删除本地存储中未完成或完成的全部数据
function delAllList(done) {
    saveLocalStorage('',done);
}