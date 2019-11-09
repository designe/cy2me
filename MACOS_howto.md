# CY2ME
 깔끔하고 안전하게 싸이월드 백업할 수 있는 방법을 공유한다.  
 다이어리, 게시판, 사진첩에 있는 컨텐츠를 모두 보관 가능  
 사진첩은 포스팅한 날짜를 기준으로 Google Photos나 안드로이드 갤러리 등의 사진첩에서 쉽게 관리 가능
 
 **본 페이지에서는 MAC OS에서의 방법을 설명드립니다.**


 ## 필요한 도구
 - MAC OS : MAC OS 가 설치된 모든 PC에서 가능
 - Chrome Browser : Microsoft Edge, Firefox도 상관없음.


### 아래 순서를 잘 따라하면 쉽게 백업이 가능합니다.


## 1. 싸이월드 접속 https://cy.cyworld.com/cyMain
 ![cyworld1](https://github.com/designe/cy2me/blob/master/assets/cy1.PNG?raw=true)
 
 싸이월드 계정을 까먹었을꺼다.  
 얼른 아이디/비밀번호부터 찾아서 로그인하자.
 
p
## 2. 싸이월드에 홈피 접속
![cyworld2](https://github.com/designe/cy2me/blob/master/assets/cy2.PNG?raw=true)
 
 로그인되면 타임라인이라는 새로운 개념이 생겨있음.  
 백업을 하려면 예전의 미니홈피를 접속해야하는데 오른쪽 상단에 파란 동그라미 쳐놓은 프로필 이미지를 선택


## 3. Chrome Devtool 실행
![cyworld3](https://github.com/designe/cy2me/blob/master/assets/cy3.PNG?raw=true)

 홈피 접속된 상태에서 F12 또는 ctrl+shift+i 를 눌러보자.  
 Chrome Devtool 이라는게 실행된다. 이 툴은 dock처럼 페이지 바로 옆에 실행이 되거나 독립된 창으로 실행되는데 기본 세팅은 옆에 탭처럼 켜진다. (설정으로 바꿀 수 있음)  
 이제 거의 다 왔다.


## 4. Console 탭 선택
아래 스크립트를 복사한 후 Console에 붙여넣기하고 엔터!
```js
var last_id,last_dt,tag_value,startdate,enddate,forder_id,airepageno,airecase,airelastdate,html="",type="more",search="",allPosts=[],postIdx=0,activateReply=!0;function getBase64Image(t){var e=document.createElement("canvas");return e.width=t.width,e.height=t.height,e.getContext("2d").drawImage(t,0,0),e.toDataURL("image/jpg").replace(/^data:image\/(png|jpg);base64,/,"")}function printImageList(){for(var t="",e=0,a=0;a<allPosts.length;a++)"2"==allPosts[a].type&&(e++,t+="http://nthumb.cyworld.com/thumb?v=0&width=810&url="+allPosts[a].image+" "+allPosts[a].date.replace(/\./gi,"")+"_"+allPosts[a].time.replace(/\:/gi,"")+"00."+e+"."+allPosts[a].image.split(".").pop()+" "+allPosts[a].date.replace(/\./gi,":")+" "+allPosts[a].time+"\n");return t}function saveAs(t,e){var a=document.createElement("a"),s=URL.createObjectURL(e);a.href=s,a.download=t,document.body.appendChild(a),a.click(),setTimeout((function(){document.body.removeChild(a),window.URL.revokeObjectURL(s)}),0)}function collectDiaries(t=!0){activateReply=t,readAllCyPosts("M");var e=new Blob([JSON.stringify(allPosts,null,1)],{type:"text/plain;charset=utf-8"});saveAs("MyCyDiary_"+Date().replace(/\ /gi,"_").split("_GMT")[0]+".txt",e),console.log(allPosts)}function collectBoards(t=!0){activateReply=t,readAllCyPosts("1");var e=new Blob([JSON.stringify(allPosts,null,1)],{type:"text/plain;charset=utf-8"});saveAs("MyCyBoards_"+Date().replace(/\ /gi,"_").split("_GMT")[0]+".txt",e),console.log(allPosts)}function collectBlogs(t=!0){activateReply=t,readAllCyPosts("B");var e=new Blob([JSON.stringify(allPosts,null,1)],{type:"text/plain;charset=utf-8"});saveAs("MyCyBlogs_"+Date().replace(/\ /gi,"_").split("_GMT")[0]+".txt",e),console.log(allPosts)}function collectPhotos(){activateReply=!1,readAllCyPosts("2");var t=new Blob([printImageList()],{type:"text/plain;charset=utf-8"});saveAs("MyCyPhotos_"+Date().replace(/\ /gi,"_").split("_GMT")[0]+".txt",t)}function readAllCyPosts(t){allPosts=[],postIdx=0,last_dt=null;var e=readCyPost(30,t);if(postIdx=e,e>30){postIdx=30;do{readCyPost(e-postIdx,t),postIdx+=30}while(e-postIdx>0);console.log("Finish")}}function readCyPost(t,e){var a=0;return $.ajax({url:"/home/"+homeTid+"/posts",data:{startdate:startdate,enddate:enddate,folderid:"",tagname:tag_value,lastid:last_id,lastdate:last_dt,listsize:t,homeId:homeTid,airepageno:airepageno,airecase:airecase,airelastdate:airelastdate,searchType:srchType,search:search},cache:!1,dataType:"json",async:!1,success:function(t){last_dt=t.lastdate,a=t.totalCount;var s=postIdx;t.postList.length>0?t.postList.some((function(t,l){if(e&&t.serviceType!=e)return!1;var o={type:t.serviceType,writer:t.writer,viewCount:t.viewCount};switch(o.type){case"2":o.image=t.summaryModel.image;break;case"1":case"M":break;case"7":return e?allPosts[s+l]=o:allPosts.push(o),!1}try{$.ajax({url:"/home/"+homeTid+"/post/"+t.identity+"/layer",cache:!1,async:!1,dataType:"html",data:{},success:function(e,a,s){var l=$("<output>").append($.parseHTML(e));if(void 0===$(".textData",l)[0])return!1;"M"!=o.type&&(o.title=$("#cyco-post-title",l)[0].innerText.trim());for(var i="",r=$(".textData",l),n=0;n<r.length;n++)i+=r[n].innerText.trim();(o.content=i,o.date=$(".view1",l)[0].innerText.trim().split(" ")[0].split("\t").pop(),o.time=$(".view1",l)[0].innerText.trim().split(" ")[1],activateReply)?0!=t.commentCount?$.ajax({url:"/home/"+homeTid+"/post/"+t.identity+"/comment",dataType:"json",async:!1,data:{},success:function(t,e,a){for(comment_idx in o.comments=[],t.commentList){var s=t.commentList[comment_idx].contentModel[0];s.name=t.commentList[comment_idx].writer.name,o.comments.push(s)}allPosts.push(o)}}):allPosts.push(o):allPosts.push(o)}})}catch(t){console.error(t)}var i=(s+l)/a*100;console.log("Collecting | "+t.identity+" | "+i.toFixed(2)+"% ["+(s+l)+" / "+a+"] ")})):a=0}}),a}"more"==type?(last_id=$(".hiddenId:last").data("id"),last_dt="",airepageno=$("#airepageno").val(),airecase=$("#airecase").val(),airelastdate=$("#airelastdate").val(),srchType=$("#searchType").val(),tag_value=$("#tagname").val(),forder_id=$("#folderid").val()):home_idx=0,console.log("CY2ME : Cyworld 백업 준비 완료 :)");
```

백업 준비 완료되었다는 메세지가 뜰 것이다.


## 5. 다이어리 수집 (게시판, 블로그에 쓴 글들)
```js
collectDiaries();
/* 기본적으로 댓글까지 모두 수집한다.
대신 속도가 조금 느림. 빠르게 받으려면 인자로
false를 넣게 되면 댓글 제외한 상태에서 수집이 됨. */
// collectDiaries(false); // 요렇게 쓰는거다
```
100%가 완료되면 자동으로 소리소문없이 MyCyDiary_현재시간.txt 파일로 저장이 되어 있다.  브라우저 다운로드 목록을 확인해보자.  

다이어리 수집 방법과 마찬가지로 아래 함수들 또한 지원한다.
* collectDiaries() : 다이어리를 수집한다.
* collectBoards() : 게시판에 쓴 글들을 수집한다.
* collectBlogs() : 블로그에 쓴 글들을 수집한다.

위 함수를 사용하면 게시판, 블로그, 클럽에 썼던 글들도 동일하게 백업이 가능하다.

다음은 사진 저장 방법이다.  
이건 조금 어려우니 집중해서 따라하길 바란다.


## 6. 사진 수집 시작 (Windows에서의 사용법)

시작은 비슷하다.
```js
collectPhotos();
```
위처럼 복사해서 Console에 넣어보자. 사진 정보 수집을 시작한다.  
수집이 완료되면 MyCyPhotos_현재시간.txt가 다운로드된다.  
일반적으로 MAC OS에서는 아래 위치에 저장될 것이다.
```bash
~/Downloads/MyCyPhotos_***.txt # 사용자 폴더의 Downloads 폴더내 저장
```

terminal 을 실행해보자.  
우선 사진을 저장하고 싶은 폴더를 만든다.  
```bash
mkdir cyphotos
```
만들어진 cyphotos라는 폴더에 collectPhotos() 명령으로 받았던 MyCyPhotos 텍스트 파일을 이동시킨다.
```bash
cd cyphotos
mv ~/Downloads/MyCyPhotos_***.txt ./
```

마지막으로 아래의 명령어를 따라치면 싸이월드의 컨텐츠들이 컴퓨터에 저장이 된다.
![cyworld6](https://github.com/designe/cy2me/blob/master/assets/cy6.PNG?raw=true)
```bash
awk '{print $1 " -O " $2}' MyCyPhotos_***.txt | xargs -n3 wget
```

**추가 팁 : 고급 Option**  
exiftool을 쓰면 사진 찍은 날짜를 포스팅 올린 날짜로 일괄 변경해준다.  
https://www.sno.phy.queensu.ca/~phil/exiftool/  
위 사이트에 접속하면 MAC용 exiftool을 받을 수 있고, 관리자 권한으로 실행하여 설치한다.  
아래 명령어로 해당 이미지 폴더에서 실행하시면 끝!  
![cyworld7](https://github.com/designe/cy2me/blob/master/assets/cy7.PNG?raw=true)
```bash
exiftool "-AllDates<filename" *.jpg
```

