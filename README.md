# CY2ME
 깔끔하고 안전하게 싸이월드 백업할 수 있는 방법을 공유드립니다 :)  
 다이어리, 게시판, 사진첩에 있는 컨텐츠를 모두 깔끔하게 보관할 수 있습니다.  

 ## 필요한 도구
 - 컴퓨터 : 스마트폰이 제일 편하겠지만ㅠ 컨텐츠 백업할때는 컴퓨터가 필요해요! (OS는 상관없습니다)
 - 크롬 브라우저 : 다이어리, 게시판은 크롬 브라우저만 있으면 됩니다.
 - wget : 리눅스를 써보신 분이라면 다들 아시는 wget입니다. 사진첩의 컨텐츠를 wget을 이용해 신속하게 다운로드 합니다.
 - exiftool (option) : 다운로드 받은 날짜, 시간으로 사진이 저장되기 때문에 컨텐츠를 등록한 날짜 시간으로 이미지의 정보를 수정하는 역할을 합니다.

## 지금부터 백업을 시작해보겠습니다.

### 1) 싸이월드에 접속합니다. https://cy.cyworld.com/cyMain
 ![cyworld1](https://github.com/designe/cy2me/blob/master/assets/cy1.PNG?raw=true)
 ```
 아마 많은 분들이 싸이월드 계정을 까먹었을거에요. (저는 심지어 세이클럽 이메일이었다는..) 얼른 아이디/비밀번호부터 찾아서 로그인을 합니다.
 ```

### 2) 싸이월드에 홈피에 접속해봅시다.
![cyworld2](https://github.com/designe/cy2me/blob/master/assets/cy2.PNG?raw=true)
 ```
 로그인되면 타임라인이라는 새로운 개념이 생겨있어요. 백업을 하려면 예전의 미니홈피를 접속해야하는데 오른쪽 상단에 파란 동그라미 쳐놓은 프로필 이미지를 선택하시면 들어가집니다.
```

### 3) Chrome Devtool 실행
![cyworld3](https://github.com/designe/cy2me/blob/master/assets/cy3.PNG?raw=true)
```
 홈피 접속된 상태에서 F12 또는 ctrl+shift+i 를 누르면 Chrome Devtool 이 실행됩니다. 
 (미니 홈피 아무곳이나 오른쪽 클릭 후 검사(N)를 누르면 동일하게 실행 가능)
 Chrome Devtool은 dock처럼 페이지 바로 옆에 실행이 되거나 독립된 창으로 실행되기도 합니다. (설정으로 바꿀 수 있음)
 여기까지 접속하셨다면 이제 거의 다 오셨습니다.
```
 ### 4) Console 탭 선택
 아래의 스크립트를 복사한 후 Console에 붙여넣기하고 Enter를 칩니다.
 ```js
 var last_id,last_dt,tag_value,startdate,enddate,forder_id,airepageno,airecase,airelastdate,html="",type="more",search="",allPosts=[],allDiary=[],sizeOfAllPosts=0,postIdx=0,allPostCount=0;function getBase64Image(t){var e=document.createElement("canvas");return e.width=t.width,e.height=t.height,e.getContext("2d").drawImage(t,0,0),e.toDataURL("image/jpg").replace(/^data:image\/(png|jpg);base64,/,"")}function printImageList(){for(var t="",e=0,a=0;a<allPosts.length;a++)"2"==allPosts[a].type&&(e++,t+="http://nthumb.cyworld.com/thumb?v=0&width=810&url="+allPosts[a].image+" "+e+"_"+allPosts[a].date.replace(/\./gi,"")+"_"+allPosts[a].time.replace(/\:/gi,"")+".jpg "+allPosts[a].date.replace(/\./gi,":")+" "+allPosts[a].time+"\n");return t}function readAllCyPosts(t){var e=readCyPost(30,t);if(postIdx=e,e>30){postIdx=30;do{readCyPost(e-postIdx,t),postIdx+=30}while(e-postIdx>0)}}function readCyPost(t,e){var a=0;return $.ajax({url:"/home/"+homeTid+"/posts",data:{startdate:startdate,enddate:enddate,folderid:"",tagname:tag_value,lastid:last_id,lastdate:last_dt,listsize:t,homeId:homeTid,airepageno:airepageno,airecase:airecase,airelastdate:airelastdate,searchType:srchType,search:search},cache:!0,dataType:"json",async:!1,success:function(s){console.log(t),last_dt=s.lastdate,a=s.totalCount;var o=postIdx;s.postList.length>0?s.postList.some((function(t,a){if(console.log(o+a+"번째 컨텐츠 수집중입니다."),console.log(t),e&&t.serviceType!=e)return!1;var s={type:t.serviceType,writer:t.writer,viewCount:t.viewCount};switch(s.type){case"2":s.image=t.summaryModel.image;break;case"1":case"M":break;case"7":return e?allPosts[o+a]=s:allPosts.push(s),!1}$.ajax({url:"/home/"+homeTid+"/post/"+t.identity+"/layer",dataType:"html",data:{},success:function(i,l,r){var d=$("<output>").append($.parseHTML(i));if(void 0===$(".textData",d)[0])return!1;"M"!=s.type&&(s.title=$("#cyco-post-title",d)[0].innerText.trim()),s.content=$(".textData",d)[0].innerText.trim(),s.date=$(".view1",d)[0].innerText.trim().split(" ")[0].split("\t").pop(),s.time=$(".view1",d)[0].innerText.trim().split(" ")[1],0!=t.commentCount?$.ajax({url:"/home/"+homeTid+"/post/"+t.identity+"/comment",dataType:"json",data:{},success:function(t,i,l){for(comment_idx in s.comments=[],t.commentList){var r=t.commentList[comment_idx].contentModel[0];r.name=t.commentList[comment_idx].writer.name,s.comments.push(r)}e?allPosts[o+a]=s:allPosts.push(s)}}):e?allPosts[o+a]=s:allPosts.push(s)}})})):a=0}}),a}"more"==type?(last_id=$(".hiddenId:last").data("id"),last_dt="",airepageno=$("#airepageno").val(),airecase=$("#airecase").val(),airelastdate=$("#airelastdate").val(),srchType=$("#searchType").val(),tag_value=$("#tagname").val(),forder_id=$("#folderid").val()):home_idx=0,readAllCyPosts();
 ```
 데이터를 수집한다는 log를 볼 수 있을 것이고, 이것이 완료되면 완성입니다 :)
 이렇게 수집된 데이터를 스트링화해서 저장하면 백업은 완료됩니다.

 이제는 사진 저장 방법을 알려드리도록 하겠습니다.
 