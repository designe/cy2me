    var last_id,last_dt,tag_value,startdate,enddate,forder_id,airepageno,airecase,airelastdate;
    var html = "";
    var type = 'more';
    var search = '';
    var allPosts = [];
    var postIdx = 0;
    var allPostCount = 0;

    if(type == 'more'){
        last_id 	 = $(".hiddenId:last").data("id");
        last_dt 	 = '';//$(".hiddenDt:last").data("id");
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
        for(var i = 0 ; i < allPosts.length; i++) {
            if(allPosts[i].type != "2")
                continue;
            imageCount++;
            ret += "http://nthumb.cyworld.com/thumb?v=0&width=810&url=" + allPosts[i].image + " "+ imageCount + "_" + allPosts[i].date.replace(/\./gi, "") + "_" + allPosts[i].time.replace(/\:/gi, "") + ".jpg" + " " + allPosts[i].date.replace(/\./gi, ":") + " " + allPosts[i].time + "\n";
        }
        return ret;
    }

    function readAllCyPosts() {
        var reloadPosts = function(totalCount) {
            postIdx += 30;
            if(postIdx > totalCount) {
                console.log(allPosts);
                return;
            } else {
                readCyPost(totalCount - postIdx, reloadPosts);
            }
        }
        readCyPost(30, reloadPosts);
    }

    function readCyPost(cnt, callback) {
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
                //console.log('data ::: ' + JSON.stringify(data));
                console.log(cnt);
                last_dt = data.lastdate;
                var baseIdx = postIdx;

                if(data.postList.length > 0) {
                    data.postList.some(function(value, index) {
                        console.log(baseIdx + index);
                        console.log(value);
                        var post = {
                            "type" : value.serviceType,
                            "writer" : value.writer,
                            "viewCount" : value.viewCount,
                        }
                        
                        switch(post.type) {
                            case "2": /* include images */
                                post.image = value.summaryModel.image;
                                break;
                            case "1": /* Board */
                            case "M": break; /* Diary */
                            case "7": 
                                allPosts[baseIdx + index] = post;
                                return false;
                        }

                        $.ajax({
                            url: "/home/" + homeTid + "/post/"+ value.identity + "/layer",
                            dataType:'html',
                            data:{},
                            success:function(viewResult, status, xhr) {
                                var output = $("<output>").append($.parseHTML(viewResult));
                                if(typeof $(".textData", output)[0] === 'undefined'){
                                    return false;
                                }
    
                                if(post.type != "M")
                                    post.title = $("#cyco-post-title", output)[0].innerText.trim();
                                post.content = $(".textData", output)[0].innerText.trim();
                                post.date = $(".view1", output)[0].innerText.trim().split(" ")[0].split('\t').pop();
                                post.time = $(".view1", output)[0].innerText.trim().split(" ")[1];

                                var commentCount = value.commentCount;
                                if(commentCount != 0){
                                    $.ajax({
                                        url: "/home/" + homeTid + "/post/" + value.identity + "/comment",
                                        dataType:'json',
                                        data: {},
                                        success: function(comments, status, xhr) {
                                            post.comments = [];
                                            for(comment_idx in comments.commentList) {
                                                var temp = comments.commentList[comment_idx].contentModel[0];
                                                temp.name = comments.commentList[comment_idx].writer.name;
                                                post.comments.push(temp);
                                            }
                                            allPosts[baseIdx + index] = post;
                                        }
                                    });
                                } else {
                                    allPosts[baseIdx + index] = post;
                                }
                            }
                        });
                    });
                }else {
                    return false;
                }
                if(callback) callback(200);
            }
        });
    }

readAllCyPosts();
