    var last_id,last_dt,tag_value,startdate,enddate,forder_id,airepageno,airecase,airelastdate;
    var html = "";
    var type = 'more';
    var search = '';
    var allPosts = [];
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
        for(var i = 0 ; i < allPosts.length; i++) {
            if(allPosts[i].type != "2")
                continue;
            imageCount++;
            ret += "http://nthumb.cyworld.com/thumb?v=0&width=810&url=" + allPosts[i].image + " " + imageCount + "_" + allPosts[i].date.replace(/\./gi, "") + "_" + allPosts[i].time.replace(/\:/gi, "") + "." + allPosts[i].image.split(".").pop() + " " + allPosts[i].date.replace(/\./gi, ":") + " " + allPosts[i].time + "\n";
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
        readAllCyPosts("M");
        var file = new Blob([JSON.stringify(allPosts, null, 1)], {type: "text/plain;charset=utf-8"});
        saveAs("MyCyDiary_" + Date().replace(/\ /gi, "_").split("_GMT")[0] + ".txt", file);
        console.log(allPosts);
    }

    function collectPhotos() {
        activateReply = false;
        readAllCyPosts("2");
        var file = new Blob([printImageList()], {type: "text/plain;charset=utf-8"});
        saveAs("MyCyPhotos_" + Date().replace(/\ /gi, "_").split("_GMT")[0] + ".txt", file);
    }

    function readAllCyPosts(t) {
        // initialize global variables
        allPosts = [];
        postIdx = 0;
        var totalCount = readCyPost(30, t);
        postIdx = totalCount;

        if(totalCount > 30) postIdx = 30;
        else return;

        do {
            readCyPost(totalCount - postIdx, t);
            postIdx += 30;
        } while (totalCount - postIdx > 0);
        console.log("Finish");
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
                                if(t) allPosts[baseIdx + index] = post;
                                else allPosts.push(post);
                                return false;
                        }
                        try {
                            $.ajax({
                                url: "/home/" + homeTid + "/post/"+ value.identity + "/layer",
                                cache:false,
                                async:false,
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

                                    if(activateReply) {
                                        var commentCount = value.commentCount;
                                        if(commentCount != 0){
                                            $.ajax({
                                                url: "/home/" + homeTid + "/post/" + value.identity + "/comment",
                                                dataType:'json',
                                                async:false,
                                                data: {},
                                                success: function(comments, status, xhr) {
                                                    post.comments = [];
                                                    for(comment_idx in comments.commentList) {
                                                        var temp = comments.commentList[comment_idx].contentModel[0];
                                                        temp.name = comments.commentList[comment_idx].writer.name;
                                                        post.comments.push(temp);
                                                    }
                                                    allPosts.push(post); 
                                                }
                                            });
                                        } else {
                                            allPosts.push(post); 
                                        }
                                    } else {
                                        allPosts.push(post); 
                                    }
                                }
                            });
                            }
                        catch(e) {
                            console.error(e);
                        }
                        var cal = ((baseIdx + index) / ret ) * 100;
                        console.log("Collecting | " + value.identity + " | " + cal.toFixed(2) + "% [" + (baseIdx + index) + " / " + ret + "] " );
                    });
                }else {
                    ret = 0;
                }
            }
        });
        return ret;
    }

    console.log("CY2ME : Cyworld 백업 준비 완료 :)");