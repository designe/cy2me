# CY2ME
 깔끔하고 안전하게 싸이월드 백업할 수 있는 방법을 공유한다.  
 일반적으로 싸이월드 백업을 프로그램화하게 되면 ID와 비밀번호를 검증되지 않은 프로그램에 입력해야 한다.  
 이는 백업을 하려는 사용자들로 하여금 불안함을 유발할 수 있는 원인이 된다.  
 본 방법은 따로 프로그램화하지 않고, 간단하게 브라우저만으로 백업할 수 있는 솔루션을 제공한다.  
 
 * 다이어리, 게시판, 사진첩에 있는 컨텐츠를 모두 보관 가능  
 * 사진첩은 포스팅한 날짜를 기준으로 Google Photos나 안드로이드 갤러리 등의 사진첩에서 쉽게 관리 가능
 
 **본 페이지에서는 MAC OS에서의 방법을 설명드립니다.**


 ## 필요한 도구
 - MAC OS : MAC OS 가 설치된 모든 PC에서 가능
 - Chrome Browser : Microsoft Edge, Firefox도 상관없음.


### 아래 순서를 잘 따라하면 쉽게 백업이 가능합니다.


## 1. 싸이월드 접속 https://cy.cyworld.com/cyMain
 ![cyworld1](https://github.com/designe/cy2me/blob/master/assets/cy1.PNG?raw=true)
 
 싸이월드 계정을 까먹었을꺼다.  
 얼른 아이디/비밀번호부터 찾아서 로그인하자.
 

## 2. 싸이월드에 홈피 접속
![cyworld2](https://github.com/designe/cy2me/blob/master/assets/cy2.PNG?raw=true)
 
 백업을 하려면 예전의 미니홈피를 접속해야하는데  
 오른쪽 상단에 파란 동그라미 쳐놓은 프로필 이미지를 선택


## 3. Chrome Devtool 실행
![image](https://user-images.githubusercontent.com/1748714/71323798-9ce74100-251a-11ea-9bf7-afb6e926d6f3.png)

 홈피 접속된 상태에서 F12를 눌러보자.  
 Chrome Devtool 이라는게 실행된다. 이 툴은 dock처럼 페이지 바로 옆에 실행이 되거나 독립된 창으로 실행되는데 기본 세팅은 옆에 탭처럼 켜진다. (설정으로 바꿀 수 있음)  
 
 이제 거의 다 왔다.


## 4) Console 탭 선택
아래 스크립트를 세번 빠르게 클릭하면 전체 선택이 가능하다.  
Chrome Devtool의 Console Tab을 선택한 후 복사한 스크립트를 붙여넣고 엔터를 치면 된다.
```js
var last_id,last_dt,tag_value,startdate,enddate,forder_id,airepageno,airecase,airelastdate,html="",type="more",search="",allPosts=[],postIdx=0,activateReply=!0;function getBase64Image(t){var a=document.createElement("canvas");return a.width=t.width,a.height=t.height,a.getContext("2d").drawImage(t,0,0),a.toDataURL("image/jpg").replace(/^data:image\/(png|jpg);base64,/,"")}function printImageList(){for(var t="",a=0,s=0;s<allPosts.length;s++)"2"==allPosts[s].type&&(a++,t+="http://nthumb.cyworld.com/thumb?v=0&width=810&url="+allPosts[s].image+" "+allPosts[s].date.replace(/\./gi,"")+"_"+allPosts[s].time.replace(/\:/gi,"")+"00."+a+"."+allPosts[s].image.split(".").pop()+" "+allPosts[s].date.replace(/\./gi,":")+" "+allPosts[s].time+"\n");return t}function saveAs(t,a){var s=document.createElement("a"),e=URL.createObjectURL(a);s.href=e,s.download=t,document.body.appendChild(s),s.click(),setTimeout((function(){document.body.removeChild(s),window.URL.revokeObjectURL(e)}),0)}function collectDiaries(t=!0){activateReply=t,console.log("Start diary backup :)"),$("#diary-backup-status .backup-message").css("display","none"),$("#diary-backup-status .lds-hourglass").css("display","inline-block"),setTimeout((function(){readAllCyPosts("M");var t=new Blob([JSON.stringify(allPosts,null,1)],{type:"text/plain;charset=utf-8"});saveAs("MyCyDiary_"+Date().replace(/\ /gi,"_").split("_GMT")[0]+".txt",t),$("#diary-backup-status .lds-hourglass").css("display","none"),$("#diary-backup-status .backup-message").css("display","inline-block")}),300)}function collectBoards(t=!0){activateReply=t,console.log("Start board backup :)"),$("#board-backup-status .backup-message").css("display","none"),$("#board-backup-status .lds-hourglass").css("display","inline-block"),setTimeout((function(){readAllCyPosts("1");var t=new Blob([JSON.stringify(allPosts,null,1)],{type:"text/plain;charset=utf-8"});saveAs("MyCyBoards_"+Date().replace(/\ /gi,"_").split("_GMT")[0]+".txt",t),$("#board-backup-status .lds-hourglass").css("display","none"),$("#board-backup-status .backup-message").css("display","inline-block")}),300)}function collectBlogs(t=!0){activateReply=t,console.log("Start blog backup :)"),$("#blog-backup-status .backup-message").css("display","none"),$("#blog-backup-status .lds-hourglass").css("display","inline-block"),setTimeout((function(){readAllCyPosts("B");var t=new Blob([JSON.stringify(allPosts,null,1)],{type:"text/plain;charset=utf-8"});saveAs("MyCyBlogs_"+Date().replace(/\ /gi,"_").split("_GMT")[0]+".txt",t),$("#blog-backup-status .lds-hourglass").css("display","none"),$("#blog-backup-status .backup-message").css("display","inline-block")}),300)}function collectPhotos(){activateReply=!1,console.log("Start photo backup :)"),$("#photo-backup-status .backup-message").css("display","none"),$("#photo-backup-status .lds-hourglass").css("display","inline-block"),setTimeout((function(){readAllCyPosts("2");var t=new Blob([printImageList()],{type:"text/plain;charset=utf-8"});saveAs("MyCyPhotos_"+Date().replace(/\ /gi,"_").split("_GMT")[0]+".txt",t),$("#photo-backup-status .lds-hourglass").css("display","none"),$("#photo-backup-status .backup-message").css("display","inline-block")}),300)}function readAllCyPosts(t){allPosts=[],postIdx=0,last_dt=null;var a=readCyPost(30,t);if(postIdx=a,a>30){postIdx=30;do{readCyPost(a-postIdx,t),postIdx+=30}while(a-postIdx>0);console.log("Finish")}}function readCyPost(t,a){var s=0;return $.ajax({url:"/home/"+homeTid+"/posts",data:{startdate:startdate,enddate:enddate,folderid:"",tagname:tag_value,lastid:last_id,lastdate:last_dt,listsize:t,homeId:homeTid,airepageno:airepageno,airecase:airecase,airelastdate:airelastdate,searchType:srchType,search:search},cache:!1,dataType:"json",async:!1,success:function(t){last_dt=t.lastdate,s=t.totalCount;var e=postIdx;t.postList.length>0?t.postList.some((function(t,i){if(a&&t.serviceType!=a)return!1;var l={type:t.serviceType,writer:t.writer,viewCount:t.viewCount};switch(l.type){case"2":l.image=t.summaryModel.image,$("#photo-backup-status");break;case"1":$("#board-backup-status");break;case"M":$("#diary-backup-status");break;case"B":$("#blog-backup-status");break;case"7":return a?allPosts[e+i]=l:allPosts.push(l),!1}try{$.ajax({url:"/home/"+homeTid+"/post/"+t.identity+"/layer",cache:!1,async:!1,dataType:"html",data:{},success:function(a,s,e){var i=$("<output>").append($.parseHTML(a));if(void 0===$(".textData",i)[0])return!1;"M"!=l.type&&(l.title=$("#cyco-post-title",i)[0].innerText.trim());for(var o="",n=$("section .cyco-imagelet figure img",i),c=0;c<n.length;c++)o+="<img src ='http://nthumb.cyworld.com/thumb?v=0&width=810&url="+decodeURIComponent(n[c].getAttribute("srctext"))+"'/>";var r=$(".textData",i);for(c=0;c<r.length;c++)o+=r[c].innerHTML.trim();(l.content=o,l.date=$(".view1",i)[0].innerText.trim().split(" ")[0].split("\t").pop(),l.time=$(".view1",i)[0].innerText.trim().split(" ")[1],activateReply)?0!=t.commentCount?$.ajax({url:"/home/"+homeTid+"/post/"+t.identity+"/comment",dataType:"json",async:!1,data:{},success:function(t,a,s){for(comment_idx in l.comments=[],t.commentList){var e=t.commentList[comment_idx].contentModel[0];e.name=t.commentList[comment_idx].writer.name,l.comments.push(e)}allPosts.push(l)}}):allPosts.push(l):allPosts.push(l)}})}catch(t){console.error(t)}var o=(e+i)/s*100;console.log("Collecting | "+t.identity+" | "+o.toFixed(2)+"% ["+(e+i)+" / "+s+"] ")})):s=0}}),s}function initializeCy2me(){$('<style>\n.lds-hourglass { display: none;  position: relative;  width: 22px;  height: 22px; }\n .lds-hourglass:after {  content: " ";  display: block;  border-radius: 50%;  width: 0;  height: 0;  margin:6px;  box-sizing: border-box;  border: 10px solid #bbb;  border-color: #bbb transparent #bbb transparent;  animation: lds-hourglass 1.2s infinite;}\n @keyframes lds-hourglass {  0% {    transform: rotate(0);    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);  }  50% {    transform: rotate(900deg); animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);  }  100% {    transform: rotate(1800deg);  }}\n.backup-btn { cursor:pointer; line-height:25px; color:#777; }\n.backup-status { display:inline-block; font-weight:normal; color:#fe8536;} \n.backup-message { display:inline-block; padding-left:5px; display:none;} \n</style>').appendTo(document.head),$(".profile dfn:first").html("");var t=$("<span class='backup-btn'>").text("다이어리 백업").click(collectDiaries),a=$("<div id='diary-backup-status' class='backup-status'> <div class='lds-hourglass'></div><div class='backup-message'>done</div></span>"),s=$("<span class='backup-btn'>").text("게시판 백업").click(collectBoards),e=$("<div id='board-backup-status' class='backup-status'><div class='lds-hourglass'></div><div class='backup-message'>done</div></span>"),i=$("<span class='backup-btn'>").text("블로그 백업").click(collectBlogs),l=$("<div id='blog-backup-status' class='backup-status'><div class='lds-hourglass'></div><div class='backup-message'>done</div></span>"),o=$("<span class='backup-btn'>").text("사진첩 백업").click(collectPhotos),n=$("<div id='photo-backup-status' class='backup-status'><div class='lds-hourglass'></div><div class='backup-message'>done</div></span>");$(".profile dfn:first").append(t),$(".profile dfn:first").append(a),$(".profile dfn:first").append($("<em>")),$(".profile dfn:first").append(s),$(".profile dfn:first").append(e),$(".profile dfn:first").append($("<em>")),$(".profile dfn:first").append(i),$(".profile dfn:first").append(l),$(".profile dfn:first").append($("<em>")),$(".profile dfn:first").append(o),$(".profile dfn:first").append(n)}"more"==type?(last_id=$(".hiddenId:last").data("id"),last_dt="",airepageno=$("#airepageno").val(),airecase=$("#airecase").val(),airelastdate=$("#airelastdate").val(),srchType=$("#searchType").val(),tag_value=$("#tagname").val(),forder_id=$("#folderid").val()):home_idx=0,initializeCy2me(),console.log("CY2ME : Cyworld 백업 준비 완료 :)");
```

백업 준비 완료되었다는 메세지가 뜰 것이다.
![cyworld8](https://github.com/designe/cy2me/blob/master/assets/cy8.png?raw=true)

## 5) 다이어리, 게시판, 블로그에 쓴 글 백업
홈피의 방문자 기록을 보면 아래와 같이 백업 메뉴가 활성화된 모습을 볼 수 있다.

![image](https://user-images.githubusercontent.com/1748714/71323608-6c9ea300-2518-11ea-9bfc-f3bcf518fdda.png)

남은 일은? 원하는 버튼을 누르기만 하면 된다 :)

![image](https://user-images.githubusercontent.com/1748714/71323712-a45a1a80-2519-11ea-966c-a1abb6b75fd4.png)

버튼을 누르면 위와 같이 콘솔창에는 현재 상태가 뜨고, Finish가 뜨면 자동으로 백업 파일이 다운로드 된다.  
MyCyDiary_현재시간.txt 파일로 저장이 되어 있다.  브라우저 다운로드 목록을 확인해보자.  


## 5-1) 백업 파일 뷰어로 확인
https://dev.jbear.co/cy2me  
위 링크에 접속해 다운로드 받은 파일을 선택하면 깔끔하게 정리되어 확인할 수 있다.  

다음은 사진 저장 방법이다.  
이건 조금 어려우니 집중해서 따라하길 바란다.


## 6. 사진 수집 시작 (Windows에서의 사용법)

시작은 비슷하다. 사진첩 백업 버튼을 클릭해보자.    
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

