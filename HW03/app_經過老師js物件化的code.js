function Sticky(value, color) {
    this.value = value;
    this.color = color;
}

function Storage(type) {
    if (type === "localStorage")
        this.storage = localStorage;
    else if (type === "sessionStorage")
        this.storage = sessionStorage;
    else
        this.storage = null;
}

Storage.prototype.getItem = function(key) {
    var item = this.storage.getItem(key);
    // 如果item不存在，我們就在localStorage set一個
    if (!item) {
        item = [];
        this.storage.setItem(key, JSON.stringify(item));
    } else {
        item = JSON.parse(item);
    }
    return item;
};

Storage.prototype.setItem = function(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
};

var appStorage = new Storage("localStorage");
// 初始化app的頁面

$(function() {



    var stickiesArray = getStickiesArray();

    for (var index = 0; index < stickiesArray.length; index++) {
        var key = stickiesArray[index];
        //var sticky = JSON.parse(localStorage[key]);
        var sticky = appStorage.getItem(key);
        addStickyToList(key, sticky);
    }

    $("#add_button").click(createSticky);
    $("#clear_button").click(clearStickies);

});
// 把已經存在的記事 加到ul中
// 把編號的陣列取出 取得所有記事的編號
// 再根據編號 從localStorage 取出記事的內容與顏色
function getStickiesArray() {

    return appStorage.getItem("stickiesArray");
}

// key: 記事的編號
// value: 記事的內容
function addStickyToList(key, sticky) {
    var $listItem =
        $("<li></li>")
        .attr("id", key)
        .text(sticky.value)
        .css("background-color", sticky.color)
        .click(deleteSticky);

    $("#stickies").append($listItem);

}

// 新增記事
// 將記事新增到清單的ul裡面
function createSticky() {
    // 新增之前 先取得現有的編號表
    var stickiesArray = getStickiesArray();

    // 產生記事的新編號 用日期的時間碼來代表
    var key = "sticky_" + (new Date()).getTime();

    // 取得使用者輸入的內容
    var value = $("#note_text").val();


    // 取得使用者選擇的顏色
    // 取得下拉選項的編號
    // 從編號取得選項的顏色值
    var color = $("#note_color").val();

    // 建立記事的物件
    var sticky = { "value": value, "color": color };

    // 把建立好的記事 存入localStorage
    appStorage.setItem(key, sticky);
    //localStorage.setItem(key, JSON.stringify(sticky));

    // 更新標號表
    stickiesArray.push(key);
    appStorage.setItem("stickiesArray", stickiesArray);
    //localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));

    // 更新畫面 加入新記事
    addStickyToList(key, sticky);
}



// 刪除記事
// 在清單中找到要刪除的li 將記事移除
function deleteSticky(event) {
    // 取得被點的li的id
    var key = event.target.id;

    // 取得現有的編號表
    var stickiesArray = getStickiesArray();


    if (stickiesArray) {

        var index = stickiesArray.indexOf(key);
        if (index != -1)
            stickiesArray.splice(index, 1);

        // 移除localStorage編號為key的資料
        localStorage.removeItem(key);

        // 更新編號表到localStorage
        appStorage.setItem("stickiesArray", stickiesArray);

        // 更新畫面 刪除點擊的記事
        removeStickyBy(key);
    }
}

function removeStickyBy(key) {
    $("#" + key).remove();
}

// 清空所有記事 (自爆)
function clearStickies() {
    var stickiesArray = getStickiesArray();
    for (var index = 0; index < stickiesArray.length; index++) {
        var key = stickiesArray[index];
        localStorage.removeItem(key);
        removeStickyBy(key);
    }
    appStorage.setItem("stickiesArray", []);
}
