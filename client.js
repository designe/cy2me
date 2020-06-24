var last_id,last_dt,tag_value,startdate,enddate,forder_id,airepageno,airecase,airelastdate;
var html = "";
var type = 'more';
var search = '';
var allMap = {};
var postIdx = 0;
var activateReply = true;

if(type == 'more'){
    last_id 	 = $(".hiddenId:last").data("id");
    last_dt 	 = '';
    airepageno   = $("#airepageno").val();
    airecase 	 = $("#airecase").val();
    airelastdate = $("#airelastdate").val();
    srchType     = $("#searchType").val();
    tag_value    = $("#tagname").val();
    forder_id 	 = $("#folderid").val();
}
else{
    home_idx = 0;
}


function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/jpg");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function printImageList() {
    var ret = "";
    var imageCount = 0;
    var allPosts = Object.values(allMap);
    for(var i = 0 ; i < allPosts.length; i++) {
        if(allPosts[i].type != "2")
            continue;
        imageCount++;
        ret += "http://nthumb.cyworld.com/thumb?v=0&width=810&url=" + allPosts[i].image + " " + allPosts[i].date.replace(/\./gi, "") + "_" + allPosts[i].time.replace(/\:/gi, "") + "00." + imageCount + "." + allPosts[i].image.split(".").pop() + " " + allPosts[i].date.replace(/\./gi, ":") + " " + allPosts[i].time + "\n";
    }
    return ret;
}

function saveAs(filename, file) {
    var a = document.createElement("a"),
        url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
    }, 0); 
}

function collectDiaries(comment=true) {
    activateReply = comment;
    console.log("Start diary backup :)");
    $("#diary-backup-status .backup-message").css("display", "none");
    $("#diary-backup-status .lds-hourglass").css("display", "inline-block");
    setTimeout(function() {
        readAllCyPosts("M");
        var allPosts = Object.values(allMap);
        var file = new Blob([JSON.stringify(allPosts, null, 1)], {type: "text/plain;charset=utf-8"});
        saveAs("MyCyDiary_" + Date().replace(/\ /gi, "_").split("_GMT")[0] + ".txt", file);
        $("#diary-backup-status .lds-hourglass").css("display", "none");
        $("#diary-backup-status .backup-message").css("display", "inline-block");
    }, 300);
}

function collectShareDiaries(comment=true) {
    activateReply = comment;
    console.log("Start diary backup :)");
    $("#share-diary-backup-status .backup-message").css("display", "none");
    $("#share-diary-backup-status .lds-hourglass").css("display", "inline-block");
    setTimeout(function() {
        readAllCyPosts("O");

        var tryCount = 1;
        console.log("Start Feeds Backup!");
        var intervalCtx = setInterval(function() {
            var finishTrigger = true;
            var successCnt = 0;
            var failCnt = 0;
            for(var key in allMap) {
                var v = allMap[key];
                if(v != {}) {
                    if(v.isCompleted) {
                        successCnt++;
                        continue;
                    } else {
                        failCnt++;
                        finishTrigger = false;
                        connectCyPost(key, v);
                    }
                }
            }
            if(tryCount > 100) finishTrigger = true;
            if(finishTrigger) {
                console.log("Backup Finished.");
                clearInterval(intervalCtx);
                var allPosts = Object.values(allMap);
                var file = new Blob([JSON.stringify(allPosts, null, 1)], {type: "text/plain;charset=utf-8"});
                saveAs("MyCyShareDiary_" + Date().replace(/\ /gi, "_").split("_GMT")[0] + ".txt", file);
                $("#share-diary-backup-status .lds-hourglass").css("display", "none");
                $("#share-diary-backup-status .backup-message").css("display", "inline-block");
            } else {
                console.log(tryCount + "번째 컨텐츠 수집 결과");
                console.log("총 " + (successCnt + failCnt) + "개 컨텐츠 중 " + successCnt + "개 성공하였습니다.");
                console.log("실패한 " + failCnt + "개 컨텐츠에 대해 재수집 시도합니다.");
            }
            tryCount++;
        }, 5000);
    }, 300);
}


function collectBoards(comment=true) {
    activateReply = comment;
    console.log("Start board backup :)");
    $("#board-backup-status .backup-message").css("display", "none");
    $("#board-backup-status .lds-hourglass").css("display", "inline-block");
    setTimeout(function() {
        readAllCyPosts("1");
        var allPosts = Object.values(allMap);
        var file = new Blob([JSON.stringify(allPosts, null, 1)], {type: "text/plain;charset=utf-8"});
        saveAs("MyCyBoards_" + Date().replace(/\ /gi, "_").split("_GMT")[0] + ".txt", file);
        $("#board-backup-status .lds-hourglass").css("display", "none");
        $("#board-backup-status .backup-message").css("display", "inline-block");
    }, 300);
}

function collectBlogs(comment=true) {
    activateReply = comment;
    console.log("Start blog backup :)");
    $("#blog-backup-status .backup-message").css("display", "none");
    $("#blog-backup-status .lds-hourglass").css("display", "inline-block");
    setTimeout(function() {
        readAllCyPosts("B");
        var allPosts = Object.values(allMap);
        var file = new Blob([JSON.stringify(allPosts, null, 1)], {type: "text/plain;charset=utf-8"});
        saveAs("MyCyBlogs_" + Date().replace(/\ /gi, "_").split("_GMT")[0] + ".txt", file);
        $("#blog-backup-status .lds-hourglass").css("display", "none");
        $("#blog-backup-status .backup-message").css("display", "inline-block");
    }, 300);
}


function collect2015(comment=true) {
    activateReply = comment;
    console.log("Start new content backup :)");
    $("#newcontent-backup-status .backup-message").css("display", "none");
    $("#newcontent-backup-status .lds-hourglass").css("display", "inline-block");
    setTimeout(function() {
        readAllCyPosts("P");
        var allPosts = Object.values(allMap);
        var file = new Blob([JSON.stringify(allPosts, null, 1)], {type: "text/plain;charset=utf-8"});
        saveAs("MyCyNewContents_" + Date().replace(/\ /gi, "_").split("_GMT")[0] + ".txt", file);
        $("#newcontent-backup-status .lds-hourglass").css("display", "none");
        $("#newcontent-backup-status .backup-message").css("display", "inline-block");
    }, 300);
}

function collectStatus(comment=true) {
    activateReply = comment;
    console.log("Start status backup :)");
    $("#status-backup-status .backup-message").css("display", "none");
    $("#status-backup-status .lds-hourglass").css("display", "inline-block");
    setTimeout(function() {
        readAllCyPosts("T");
        var allPosts = Object.values(allMap);
        var file = new Blob([JSON.stringify(allPosts, null, 1)], {type: "text/plain;charset=utf-8"});
        saveAs("MyCyStatus_" + Date().replace(/\ /gi, "_").split("_GMT")[0] + ".txt", file);
        $("#status-backup-status .lds-hourglass").css("display", "none");
        $("#status-backup-status .backup-message").css("display", "inline-block");
    }, 300);
}

function collectPhotos(comment=true) {
    activateReply = comment;
    console.log("Start photo backup :)");
    $("#photo-backup-status .backup-message").css("display", "none");
    $("#photo-backup-status .lds-hourglass").css("display", "inline-block");
    setTimeout(function() {
        readAllCyPosts("2");
        var allPosts = Object.values(allMap);
        var file = new Blob([JSON.stringify(allPosts, null, 1)], {type: "text/plain;charset=utf-8"});
        saveAs("MyCyPhotos_" + Date().replace(/\ /gi, "_").split("_GMT")[0] + ".txt", file);
        $("#photo-backup-status .lds-hourglass").css("display", "none");
        $("#photo-backup-status .backup-message").css("display", "inline-block");
    }, 300);
}

function connectCyPost(id, post) {
    try {
        $.ajax({
            url: "/home/" + homeTid + "/post/"+ id + "/layer",
            cache:false,
            async:true,
            dataType:'html',
            data:{},
            timeout:5000
        }).done(function(viewResult) {
            var output = $("<output>").append($.parseHTML(viewResult));
            if(typeof $(".textData", output)[0] === 'undefined'){
                return false;
            }
            
            if(post.type != "M" && post.type != "O")
                post.title = $("#cyco-post-title", output)[0].innerText.trim();
            var content = "";
            var imageObj = $("section .cyco-imagelet figure img", output);
for(var i = 0; i < imageObj.length; i++)
content += "<img src ='http://nthumb.cyworld.com/thumb?v=0&width=810&url=" + decodeURIComponent(imageObj[i].getAttribute("srctext")) + "'/>";
var contentObj = $(".textData", output);
            for(var i = 0; i < contentObj.length; i++)
                content += contentObj[i].innerHTML.trim();
            post.content = content;
            post.date = $(".view1", output)[0].innerText.trim().split(" ")[0].split('\t').pop();
            post.time = $(".view1", output)[0].innerText.trim().split(" ")[1];
            post.isCompleted = true;
            if(activateReply) {
                var commentCount = post.commentCount;
                if(commentCount != 0){
                    $.ajax({
                        url: "/home/" + homeTid + "/post/" + id + "/comment",
                        dataType:'json',
                        async:true,
                        data: {},
                    }).done(function(comments) {
                        post.comments = [];
                        for(comment_idx in comments.commentList) {
                            var temp = comments.commentList[comment_idx].contentModel[0];
                            temp.name = comments.commentList[comment_idx].writer.name;
                            post.comments.push(temp);
                        }
                        allMap[id] = post;
                    }).fail(function() {
                        console.log(id + " | Failed | 댓글 수집에 실패하였습니다. 댓글을 제외한 컨텐츠만 저장됩니다.");

                        allMap[id] = post;
                    });
                } else {
                    allMap[id] = post;
                }
            } else {
                allMap[id] = post;
            }
        }).fail(function(request, status ,error){
            console.log(id + " | Failed | 컨텐츠 수집 시간이 초과되었습니다.");
            post.isCompleted = false;
            allMap[id] = post;
        });
    }
    catch(e) {
        console.error(e);
    }
}

function readAllCyPosts(t) {
    // initialize global variables
    allPosts = [];
    postIdx = 0;
    last_dt = null;
    var totalCount = readCyPost(30, t);
    postIdx = totalCount;

    if(totalCount > 30) postIdx = 30;
    else return;

    do {
        readCyPost(totalCount - postIdx, t);
        postIdx += 30;
    } while (totalCount - postIdx > 0);
    console.log("Analyzation Finishd.");
}

function readCyPost(cnt, t) {
    var ret = 0;
    $.ajax({
        url: '/home/'+ homeTid + "/posts",		    
        data:{
            "startdate"   : startdate,
            "enddate"   : enddate,
            "folderid"    : "",
            "tagname"   : tag_value,
            "lastid"       : last_id,
            "lastdate"     : last_dt,
            "listsize"     : cnt,
            "homeId"       : homeTid,
            "airepageno"   : airepageno,
            "airecase"     : airecase,
            "airelastdate" : airelastdate,
            "searchType"   : srchType,
            "search" : search
        },
        cache: false,
        dataType: "json",
        async:false,
        success: function(data) {
            last_dt = data.lastdate;
            ret = data.totalCount;
            var baseIdx = postIdx;

            if(data.postList.length > 0) {
                data.postList.some(function(value, index) {
                    if(t && value.serviceType != t)
                        return false;
                    
                    allMap[value.identity] = {};

                    var post = {
                        "type" : value.serviceType,
                        "writer" : value.writer,
                        "viewCount" : value.viewCount,
                        "commentCount" : value.commentCount
                    };
                    
                    switch(post.type) {
                    case "2": /* include images */
                        post.image = value.summaryModel.image;
                        break;
                    case "1": /* Board */
                        break;
                    case "P": /* 2015 */
                        break;
                    case "T": /* Intro */
                        break;
                    case "M": /* Diary */
                        break;
                    case "O": /* Share Diary */
                        break;
                    case "B": /* Blog */
                        break;
                    case "7": 
                        //if(t) allPosts[baseIdx + index] = post;
                        //else allPosts.push(post);
                        return false;
                    }
                    
                    connectCyPost(value.identity, post);

                    var cal = ((baseIdx + index) / ret ) * 100;
                    console.log("Analyzing Feed | " + value.identity + " | " + cal.toFixed(2) + "% [" + (baseIdx + index) + " / " + ret + "] " );
                });
            }else {
                ret = 0;
            }
        }
    });
    return ret;
}

function initializeCy2me() {

    var css = '<style>\n.lds-hourglass { display: none;  position: relative;  width: 22px;  height: 22px; }\n';
    css += ' .lds-hourglass:after {  content: " ";  display: block;  border-radius: 50%;  width: 0;  height: 0;  margin:6px;  box-sizing: border-box;  border: 10px solid #bbb;  border-color: #bbb transparent #bbb transparent;  animation: lds-hourglass 1.2s infinite;}\n';
    css += ' @keyframes lds-hourglass {  0% {    transform: rotate(0);    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);  }  50% {    transform: rotate(900deg); animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);  }  100% {    transform: rotate(1800deg);  }}\n';
    css += '.backup-btn { cursor:pointer; font-size:13px; line-height:25px; color:#777; }\n';
    css += '.backup-status { display:inline-block; font-weight:normal; color:#fe8536;} \n';
    css += '.backup-message { display:inline-block; padding-left:5px; display:none;} \n';
    css += "</style>";
    $(css).appendTo(document.head);

    $(".profile dfn:first").html("");
    var diaryBtn = $("<span class='backup-btn'>").text("다이어리 백업").click(collectDiaries);
    var diaryStatus = $("<div id='diary-backup-status' class='backup-status'> <div class='lds-hourglass'></div><div class='backup-message'>done</div></span>");
    var shareDiaryBtn = $("<span class='backup-btn'>").text("공유 다이어리 백업").click(collectShareDiaries);
    var shareDiaryStatus = $("<div id='share-diary-backup-status' class='backup-status'> <div class='lds-hourglass'></div><div class='backup-message'>done</div></span>");
    var boardBtn = $("<span class='backup-btn'>").text("게시판 백업").click(collectBoards);
    var boardStatus = $("<div id='board-backup-status' class='backup-status'><div class='lds-hourglass'></div><div class='backup-message'>done</div></span>");
    var blogBtn = $("<span class='backup-btn'>").text("블로그 백업").click(collectBlogs);
    var blogStatus = $("<div id='blog-backup-status' class='backup-status'><div class='lds-hourglass'></div><div class='backup-message'>done</div></span>");
    var photoBtn = $("<span class='backup-btn'>").text("사진첩 백업").click(collectPhotos);
    var photoStatus = $("<div id='photo-backup-status' class='backup-status'><div class='lds-hourglass'></div><div class='backup-message'>done</div></span>");
    var newContentBtn = $("<span class='backup-btn'>").text("2015 이후 백업").click(collect2015);
    var newContentStatus = $("<div id='newcontent-backup-status' class='backup-status'><div class='lds-hourglass'></div><div class='backup-message'>done</div></span>");
    var statusBtn = $("<span class='backup-btn'>").text("상태 메세지 백업").click(collectStatus);
    var statusStatus = $("<div id='status-backup-status' class='backup-status'><div class='lds-hourglass'></div><div class='backup-message'>done</div></span>");
    
    $(".profile dfn:first").append(diaryBtn);
    $(".profile dfn:first").append(diaryStatus);
    $(".profile dfn:first").append($("<em>"));
    $(".profile dfn:first").append(shareDiaryBtn);
    $(".profile dfn:first").append(shareDiaryStatus);
    $(".profile dfn:first").append($("<em>"));
    $(".profile dfn:first").append(boardBtn);
    $(".profile dfn:first").append(boardStatus);
    $(".profile dfn:first").append($("<em>"));
    $(".profile dfn:first").append(blogBtn);
    $(".profile dfn:first").append(blogStatus);
    $(".profile dfn:first").append($("<br>"));
    $(".profile dfn:first").append(photoBtn);
    $(".profile dfn:first").append(photoStatus);
    $(".profile dfn:first").append($("<em>"));
    $(".profile dfn:first").append(newContentBtn);
    $(".profile dfn:first").append(newContentStatus);
    $(".profile dfn:first").append($("<em>"));
    $(".profile dfn:first").append(statusBtn);
    $(".profile dfn:first").append(statusStatus);
}

initializeCy2me();
console.log("CY2ME : Cyworld 백업 준비 완료 :)");

