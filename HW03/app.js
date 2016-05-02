var chosenArray = [];


// 初始化app的頁面
$(function() {

    // $("#add_button").click(function(){
    // 	//$("#stickies").append("<li>test</li>");
    // 	addStickyToList("1234", {value:"aaaaaaa", color:"Blue"});
    // });

    var stickiesArray = getStickiesArray();
    for (var index = 0; index < stickiesArray.length; index++) {
        var key = stickiesArray[index];
        var sticky = JSON.parse(localStorage[key]);
        addStickyToList(key, sticky);
    }

    $("#add_button").click(createSticky);
    $("#clear_button").click(clearStickies);
    $("#clear_sel_button").click(clearSelStickies);

});



//window.onload = init; //傳統js寫法

// 把已經存在的記事，加到ul中
// 把編碼的陣列取出，取得所有記事的編號
// 再根據編號，從localStorage取出記事的內容與顏色
function getStickiesArray() {
    // stickiesArray 編號的表格
    var stickiesArray = localStorage.getItem("stickiesArray");
    //如果stickiesArray不存在，我們就在localStorage set一個
    if (!stickiesArray) { //如果stickiesArray不是存在的東西(第一次打開app，沒有stickiesArray這個東西)
        stickiesArray = []; //陣列不是string
        localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray)); //要放值的文字
        //JSON.stringify()<--可以轉成文字
    } else {
        stickiesArray = JSON.parse(stickiesArray); //stickiesArray不是陣列，透過JSON.parse()轉成陣列
    }
    return stickiesArray;
}

// key: 記事的編號
// value: 記事的內容
//function addStickyToList(key, value){
function addStickyToList(key, sticky) {
    $("#stickies").append("<li class='sticky' id=" + key + "></div>" + sticky.value + "</li>");

    $("#" + key).css("background-color", sticky.color);

    //$("#" + key).click(deleteSticky);
    $("#" + key).click(selectNote);
}

// 新增記事
// 將記事新增到清單的ul裡面
function createSticky() {
    // 新增之前，先取得現有的編號表
    var stickiesArray = getStickiesArray();

    // 產生記事的新編號，用日期的時間碼來代表
    var key = "sticky_" + (new Date()).getTime();

    // 取得使用者輸入的內容
    var value = $("#note_text").val();

    // 取得使用者選擇的顏色
    //取得下拉選項的編號
    //從編號取得選項的顏色值
    var color = $("#note_color :selected").val();

    // 建立記事的物件
    var sticky = { "value": value, "color": color };

    // 把建立好的記事，存入localStorage
    localStorage.setItem(key, JSON.stringify(sticky));

    // 更新編號表
    stickiesArray.push(key);
    localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));

    //更新畫面，加入新記事
    addStickyToList(key, sticky);
}

// 刪除記事
// 在清單中找到要刪除的li，將記事移除
function deleteSticky(event) {
    //取得被點擊的li的id
    var key = event.target.id;

    //取得現有的編號表
    var stickiesArray = getStickiesArray();

    if (stickiesArray) { //看是否真的有這個東西，有才作事。
        for (var index = 0; index < stickiesArray.length; index++) {
            //如果key等於編號表的第index個的編號
            if (key === stickiesArray[index]) {
                stickiesArray.splice(index, 1); //用這個來刪它，把這個東西刪掉後，其他的東西接在上一個後面。
            }
        }
        //移除localStorage編號為key的資料
        localStorage.removeItem(key);

        //更新編號表到localStorage
        localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));

        //更新畫面，刪除點擊的記事
        removeStickyBy(key);
    }
}

function removeStickyBy(key) {
    $("#" + key).remove();
}

//清空所有記事(自爆)
function clearStickies(event) {
    //取得現有的編號表
    var stickiesArray = getStickiesArray();

    for (var index = 0; index < stickiesArray.length; index++) {
        var key = stickiesArray[index];
        localStorage.removeItem(key);
        removeStickyBy(key);
    }
    localStorage.setItem("stickiesArray", JSON.stringify([]));
}

function selectNote(event) {
    //取得被點擊的li的id
    var key = event.target.id;
    $("#" + key).append("<div class='myCheck'>");

    var isExist = true;
    for (var index = 0; index < chosenArray.length; index++) {
        var chosenKey = chosenArray[index];
        if (key == chosenKey) {
            $("#" + key + ">div").remove();
            isExist = false;
            chosenArray.splice(key);
            break;
        }
    }
    if (isExist) {
        chosenArray.push(key);
    }
}

function clearSelStickies(event) {

    //取得現有的編號表
    var stickiesArray = getStickiesArray();
    //alert("chosenArray=" + chosenArray);
    //alert("stickiesArray=" + stickiesArray);

    for (var index = 0; index < stickiesArray.length; index++) {
        var stickiesKey = stickiesArray[index];
        for (var chosenIndex = 0; chosenIndex < chosenArray.length; chosenIndex++) {
            var chosenKey = chosenArray[chosenIndex];
            if (stickiesKey == chosenKey) {
                stickiesArray.splice(index, 1);
                chosenArray.splice(chosenIndex, 1);
                localStorage.removeItem(stickiesKey);

                //更新畫面，刪除點擊的記事
                $("#" + stickiesKey).remove();
                break;
            }
        }
    }
    localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));


}
