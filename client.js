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

var backupStartTime = 0;
var backupEndTime = 0;

var CY2ME_CATEGORY_INFO = {
    "M": {'type': "M", 'title': "Diary", 'backup_status': "#diary-backup-status" },
    "O": {'type': "O", 'title': "ShareDiary", 'backup_status': "#share-diary-backup-status" },
    "1": {'type': "1",'title': "Board",'backup_status': "#board-backup-status" },
    "2": {'type': "2", 'title': "Photo",'backup_status': "#photo-backup-status" },
    "B": {'type': "B", 'title': "Blog", 'backup_status': "#blog-backup-status" },
    "P": {'type': "P", 'title': "After2015", 'backup_status': "#newcontent-backup-status" },
    "T": {'type': "T", 'title': "Status",'backup_status': "#status-backup-status" }
};

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

function collectFeeds(t, comment=true) {
    backupStartTime = Date.now();
    var typeFeed = CY2ME_CATEGORY_INFO[t];

    activateReply = comment;
    console.log("Start " + typeFeed.title + " backup :)");
    $(typeFeed.backup_status + " .backup-message").css("display", "none");
    $(typeFeed.backup_status + " .lds-hourglass").css("display", "inline-block");

    setTimeout(function() {
        readAllCyPosts(t);

        var totalFeeds = Object.entries(allMap);
        var totalFeedsCount = totalFeeds.length;
        var startIdx = 0;
        var endIdx = 30;

        var tryCount = 0;
        
        console.log("All " + typeFeed.title + " Feeds Count : " + totalFeedsCount);
        console.log("Start Feeds Backup!");
        var intervalCtx = setInterval(function() {
            var finishTrigger = true;
            var successCnt = 0;
            var failCnt = 0;
            var startCnt = 0;
            var noStartCnt = 0;

            for(var key in allMap) {
                var v = allMap[key];
                if(v != {}) {
                    if(v.isStarted){
                        startCnt++;
                        if(v.isCompleted) {
                            successCnt++;
                            continue;
                        } else {
                            failCnt++;
                            finishTrigger = false;
                        }
                    } else {
                        finishTrigger = false;
                        noStartCnt++;
                    }
                } else {
                    finishTrigger = false;
                }
            }

            if(totalFeedsCount != startCnt) {
                var subFeeds = (startIdx == endIdx-1) ? totalFeeds.slice(startIdx, endIdx-1) : totalFeeds.slice(startIdx, endIdx);
                subFeeds.some(function(data) {
                    if(data[1].isCompleted) 
                        return false;
                    else
                        connectCyPost(data[0], JSON.parse(JSON.stringify(data[1])));
                });
                
                startIdx = endIdx - 1;
                endIdx = ((startIdx + 30) > totalFeedsCount) ? totalFeedsCount : startIdx + 30;
            } else {
                for(var key in allMap) {
                    if(allMap[key].isCompleted)
                        continue;
                    else {
                        allMap[key].isStarted = false;
                    }
                }

                totalFeeds = Object.entries(allMap);
                
                startIdx = 0;
                endIdx = 30;
                tryCount++;

                if(tryCount > 0 && tryCount <= 5)
                    console.log("CY2ME | 백업에 실패한 컨텐츠에 대하여 재시도합니다 | " + tryCount + "회 시도" );
                else if(tryCount > 5) 
                    finishTrigger = true; 
            }
            
            if(finishTrigger) {
                clearInterval(intervalCtx);
                console.log("CY2ME | Backup is going to be finished after 15 seconds. | Thank you");
                setTimeout(function() {
                    var backupTime = Date.now() - backupStartTime;
                    console.log("총 " + (backupTime / 1000.0) + "초 동안 백업이 진행되었습니다.");
                    console.log("Backup Finished.");
                    var allPosts = Object.values(allMap);
                    var file = new Blob([JSON.stringify(allPosts, null, 1)], {type: "text/plain;charset=utf-8"});
                    saveAs("MyCy" + typeFeed.title +"_" + Date().replace(/\ /gi, "_").split("_GMT")[0] + ".txt", file);
                    $(typeFeed.backup_status + " .lds-hourglass").css("display", "none");
                    $(typeFeed.backup_status + " .backup-message").css("display", "inline-block");
                }, 15000);
            } else {
                var hitCal = (successCnt / totalFeedsCount) * 100.0;
                console.log("Collecting Feed | " + (Date.now() - backupStartTime) + "ms | Eval " + tryCount + " startCnt = " + startCnt + " noStartCnt = " + noStartCnt + " successCnt = " + successCnt + " failCnt = " + failCnt + " | " + hitCal.toFixed(2) + "% [" + successCnt + " / " + totalFeedsCount + "] " );
            }
        }, 10000);
    }, 300);
}

function collectShareDiaries(comment=true) { collectFeeds("O", comment); }
function collectBoards(comment=true) { collectFeeds("1", comment); }
function collectBlogs(comment=true) { collectFeeds("B", comment); }
function collectDiaries(comment=true) { collectFeeds("M", comment); }
function collectPhotos(comment=true) { collectFeeds("2", comment); }
function collect2015(comment=true) { collectFeeds("P", comment); }
function collectStatus(comment=true) { collectFeeds("T", comment); }

var connectCyPostCnt = 0;
function connectCyPost(id, post, time=0) {
    
    try {
        var ajaxOption = {
            url: "/home/" + homeTid + "/post/"+ id + "/layer",
            cache:false,
            async:true,
            dataType:'html',
            data:{},
            beforeSend: function() {
                post.isStarted = true;
            } 
        };
        
        if(time != 0)
            ajaxOption["timeout"] = time;
        
        $.ajax(ajaxOption).done(function(viewResult) {
            var output = $("<output>").append($.parseHTML(viewResult));
            if(typeof $(".textData", output)[0] === 'undefined'){
                post.isCompleted = false;
                allMap[id] = post;
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
                            if(typeof temp.name === 'undefined'){
                                temp.name = comments.commentList[comment_idx].writer.nickname;
                            }
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
            //console.log(id + " | Failed | 컨텐츠 수집 시간이 초과되었습니다.");
            post.isCompleted = false;
            allMap[id] = post;
        });
    }
    catch(e) {
        console.error(e);
        console.log("try catch error : " + e);
        //allMap[id] = post;
    }
}

function readAllCyPosts(t) {
    // initialize global variables
    allMap = {};
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
                //for(value in data.postList) {
                    if(t && value.serviceType != t)
                        return;
                
                    var post = {
                        "id" : value.identity,
                        "type" : value.serviceType,
                        "writer" : value.writer,
                        "viewCount" : value.viewCount,
                        "commentCount" : value.commentCount,
                        "isStarted" : false
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

                    allMap[value.identity] = post;

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

    console.log("CY2ME : Cyworld 백업 준비 완료 | 웹페이지에 보시면 백업 메뉴가 활성화되어 있습니다.");
}

initializeCy2me();
