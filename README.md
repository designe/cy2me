# CY2ME
 깔끔하고 안전하게 싸이월드 백업할 수 있는 방법을 공유한다.
 다이어리, 게시판, 사진첩에 있는 컨텐츠를 모두 보관 가능


 ## 필요한 도구
 - 컴퓨터 : 스마트폰이 제일 편하겠지만ㅠ 컨텐츠 백업할때는 컴퓨터가 필요!
 - 크롬 브라우저 : 제일 중요한 준비물이 크롬 브라우저! 파이어폭스도 상관없음.
 - wget : 리눅스를 써보신 분이라면 한번쯤 써봤을 wget. 사진첩의 컨텐츠를 wget을 이용해 신속하게 다운로드.
 - exiftool (option) : 다운로드 받은 날짜, 시간으로 사진이 저장되기 때문에 컨텐츠를 등록한 날짜 시간으로 이미지의 정보를 수정하는 역할


### 아래 순서를 잘 따라하면 쉽게 백업이 가능하다.


## 1) 싸이월드 접속 https://cy.cyworld.com/cyMain
 ![cyworld1](https://github.com/designe/cy2me/blob/master/assets/cy1.PNG?raw=true)
 
 싸이월드 계정을 까먹었을꺼다.  
 얼른 아이디/비밀번호부터 찾아서 로그인하자.
 

## 2) 싸이월드에 홈피 접속
![cyworld2](https://github.com/designe/cy2me/blob/master/assets/cy2.PNG?raw=true)
 
 로그인되면 타임라인이라는 새로운 개념이 생겨있음.
 백업을 하려면 예전의 미니홈피를 접속해야하는데 오른쪽 상단에 파란 동그라미 쳐놓은 프로필 이미지를 선택


## 3) Chrome Devtool 실행
![cyworld3](https://github.com/designe/cy2me/blob/master/assets/cy3.PNG?raw=true)

 홈피 접속된 상태에서 F12 또는 ctrl+shift+i 를 눌러보자.
 Chrome Devtool 이라는게 실행된다. 이 툴은 dock처럼 페이지 바로 옆에 실행이 되거나 독립된 창으로 실행되는데 기본 세팅은 옆에 탭처럼 켜진다. (설정으로 바꿀 수 있음)  
 이제 고지가 보인다.


## 4) Console 탭 선택
아래 스크립트를 복사한 후 Console에 붙여넣기하고 엔터!
```js
var last_id,last_dt,tag_value,startdate,enddate,forder_id,airepageno,airecase,airelastdate,html="",type="more",search="",allPosts=[],postIdx=0,activateReply=!0;function getBase64Image(t){var e=document.createElement("canvas");return e.width=t.width,e.height=t.height,e.getContext("2d").drawImage(t,0,0),e.toDataURL("image/jpg").replace(/^data:image\/(png|jpg);base64,/,"")}function printImageList(){for(var t="",e=0,a=0;a<allPosts.length;a++)"2"==allPosts[a].type&&(e++,t+="http://nthumb.cyworld.com/thumb?v=0&width=810&url="+allPosts[a].image+" "+e+"_"+allPosts[a].date.replace(/\./gi,"")+"_"+allPosts[a].time.replace(/\:/gi,"")+"."+allPosts[a].image.split(".").pop()+" "+allPosts[a].date.replace(/\./gi,":")+" "+allPosts[a].time+"\n");return t}function saveAs(t,e){var a=document.createElement("a"),s=URL.createObjectURL(e);a.href=s,a.download=t,document.body.appendChild(a),a.click(),setTimeout((function(){document.body.removeChild(a),window.URL.revokeObjectURL(s)}),0)}function collectDiaries(t=!0){activateReply=t,readAllCyPosts("M");var e=new Blob([JSON.stringify(allPosts,null,1)],{type:"text/plain;charset=utf-8"});saveAs("MyCyDiary_"+Date().replace(/\ /gi,"_").split("_GMT")[0]+".txt",e),console.log(allPosts)}function collectPhotos(){activateReply=!1,readAllCyPosts("2");var t=new Blob([printImageList()],{type:"text/plain;charset=utf-8"});saveAs("MyCyPhotos_"+Date().replace(/\ /gi,"_").split("_GMT")[0]+".txt",t)}function readAllCyPosts(t){allPosts=[],postIdx=0;var e=readCyPost(30,t);if(postIdx=e,e>30){postIdx=30;do{readCyPost(e-postIdx,t),postIdx+=30}while(e-postIdx>0);console.log("Finish")}}function readCyPost(t,e){var a=0;return $.ajax({url:"/home/"+homeTid+"/posts",data:{startdate:startdate,enddate:enddate,folderid:"",tagname:tag_value,lastid:last_id,lastdate:last_dt,listsize:t,homeId:homeTid,airepageno:airepageno,airecase:airecase,airelastdate:airelastdate,searchType:srchType,search:search},cache:!1,dataType:"json",async:!1,success:function(t){last_dt=t.lastdate,a=t.totalCount;var s=postIdx;t.postList.length>0?t.postList.some((function(t,o){if(e&&t.serviceType!=e)return!1;var i={type:t.serviceType,writer:t.writer,viewCount:t.viewCount};switch(i.type){case"2":i.image=t.summaryModel.image;break;case"1":case"M":break;case"7":return e?allPosts[s+o]=i:allPosts.push(i),!1}try{$.ajax({url:"/home/"+homeTid+"/post/"+t.identity+"/layer",cache:!1,async:!1,dataType:"html",data:{},success:function(e,a,s){var o=$("<output>").append($.parseHTML(e));if(void 0===$(".textData",o)[0])return!1;("M"!=i.type&&(i.title=$("#cyco-post-title",o)[0].innerText.trim()),i.content=$(".textData",o)[0].innerText.trim(),i.date=$(".view1",o)[0].innerText.trim().split(" ")[0].split("\t").pop(),i.time=$(".view1",o)[0].innerText.trim().split(" ")[1],activateReply)?0!=t.commentCount?$.ajax({url:"/home/"+homeTid+"/post/"+t.identity+"/comment",dataType:"json",async:!1,data:{},success:function(t,e,a){for(comment_idx in i.comments=[],t.commentList){var s=t.commentList[comment_idx].contentModel[0];s.name=t.commentList[comment_idx].writer.name,i.comments.push(s)}allPosts.push(i)}}):allPosts.push(i):allPosts.push(i)}})}catch(t){console.error(t)}var l=(s+o)/a*100;console.log("Collecting | "+t.identity+" | "+l.toFixed(2)+"% ["+(s+o)+" / "+a+"] ")})):a=0}}),a}"more"==type?(last_id=$(".hiddenId:last").data("id"),last_dt="",airepageno=$("#airepageno").val(),airecase=$("#airecase").val(),airelastdate=$("#airelastdate").val(),srchType=$("#searchType").val(),tag_value=$("#tagname").val(),forder_id=$("#folderid").val()):home_idx=0,console.log("CY2ME : Cyworld 백업 준비 완료 :)");
```

Console에 붙여넣고 Enter를 누르면 아래 메세지가 뜬다.
```
CY2ME : Cyworld 백업 준비 완료 :)
```


## 5) 다이어리 수집은 정말 쉽다
```js
collectDiaries();
/* 기본적으로 댓글까지 모두 수집한다.
대신 속도가 조금 느림. 빠르게 받으려면 인자로
false를 넣게 되면 댓글 제외한 상태에서 수집이 됨. */
// collectDiaries(false); // 요렇게 쓰는거다
```
100%가 완료되면 자동으로 소리소문없이 MyCyDiary_현재시간.txt 파일로 저장이 되어 있다. 브라우저 다운로드 목록을 확인해보자.


다음은 사진 저장 방법이다. 이건 조금 어려우니 집중해서 따라하길 바란다.


## 6) 사진 수집 시작 (Windows에서의 사용법)

시작은 비슷하다.
```js
collectPhotos();
```
위처럼 복사해서 Console에 넣어보자. 사진 정보 수집을 시작한다.  
수집이 완료되면 MyCyPhotos_현재시간.txt가 다운로드될꺼다.  
이걸 복사해서 사용자 폴더(일반적으로 C:\Users\사용자이름 )에 저장해보자.  

지금부터가 어렵다. 집중!  
Powershell 이라는걸 실행해야 한다.  
Win + R 을 누르면 실행창이 뜨고, 여기다가 powershell을 누르면 실행된다.  
모르겠으면 시작 누르고 찾다보면 나온다. 

```bash
Get-Content .\MyCyPhotos_현재시간.txt | %{ wget $_.split(" ")[0] -OutFile $_.split(" ")[1];}
```

위에 명령어 치면 막 다운로드 받아지는게 느껴진다.

* 추가 팁 : 고급 Option
exiftool을 쓰면 사진 찍은 날짜를 포스팅 올린 날짜로 일괄 변경해준다.

아래 명령어로 해당 이미지 폴더에서 실행하시면 끝!
```bash
exiftool "-AllDates<filename" *.jpg
```
