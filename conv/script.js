/*
**JsonSite**
バージョン:2ということにしておこうかな?
*/

var slideout;
function display_adjustment(){
if(window.innerWidth>425){
if("none"==document.getElementById("list").style.display){
document.getElementsByTagName("main")[0].style.width=(window.innerWidth-200)+"px";
}else{
document.getElementsByTagName("main")[0].style.width=(window.innerWidth-540)+"px";
}
}else{
if("none"==document.getElementById("list").style.display){
document.getElementsByTagName("main")[0].style.width=(window.innerWidth-0)+"px";
}else{
slideout = new Slideout({
'panel': document.getElementById('main'),
'menu': document.getElementById('list'),
'padding': 256,
'tolerance': 70
});
slideout.disableTouch();
list_hidden()
document.getElementsByTagName("main")[0].style.width=(window.innerWidth-40)+"px";
}
}
}
window.addEventListener('resize', function(){
display_adjustment()
})

var switch_temporary="";
function mobile_header_switch(){
if("100%"==document.getElementsByTagName("header")[0].style.height){
document.getElementsByTagName("header")[0].style.height="30px";
document.getElementById("selecting-contents-display").innerHTML=switch_temporary;
document.getElementById("nav-mobile").style.display="none";
}else{
document.getElementsByTagName("header")[0].style.height="100%";
switch_temporary=document.getElementById("selecting-contents-display").innerHTML;
document.getElementById("selecting-contents-display").innerHTML="閉じる";
document.getElementById("nav-mobile").style.display="block";
}
}

function list_hidden(){
if(slideout.isOpen()){
document.getElementById("list").style.visibility="visible"
}else{
document.getElementById("list").style.visibility="hidden"
}
}

function element_add(element_type,position,content,addclassname=null,onclick=null,data=null,src=null,id=null){
new_element=document.createElement(element_type);
new_element.innerHTML=content;
if(addclassname!==null){
new_element.setAttribute("class",addclassname);
}
if(onclick!==null){
new_element.setAttribute("onclick",onclick);
}
if(data!==null){
new_element.setAttribute("data-source",data);
}
if(src!==null){
new_element.setAttribute("src",src);
}
if(id!==null){
new_element.setAttribute("id",id);
}
document.getElementById(position).appendChild(new_element);
}

function navload(){
fetch(`./subject-list.json`)
.then(response => {
return response.text();
})
.then(data => {
JSON.parse(data).forEach(function(element){
if(element.display==undefined||element.display=="nav"){
if(element.mode=="json"){
element_add("div","nav-pc",element.title,"select-button",`jsonload("${element.source}")`,`${element.mode}-${element.source}`);
element_add("div","nav-mobile",element.title,"select-button",`jsonload("${element.source}")`,`${element.mode}-${element.source}`);
}else if(element.mode=="html"){
element_add("div","nav-pc",element.title,"select-button",`htmlload("${element.source}")`,`${element.mode}-${element.source}`);
element_add("div","nav-mobile",element.title,"select-button",`htmlload("${element.source}")`,`${element.mode}-${element.source}`);
}else if(element.mode=="iflame"){
element_add("div","nav-pc",element.title,"select-button",`iflameload("${element.source}")`,`${element.mode}-${element.source}`);
element_add("div","nav-mobile",element.title,"select-button",`iflameload("${element.source}")`,`${element.mode}-${element.source}`);
}
}
if(element.display=="menu"){
var add="";
var line=false;
element.contents.forEach(function(element2){
if(element2=="theme"){
add=add+`
<svg width="30px" height="30px" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="background-color:black;cursor : pointer;" class='nav-menu-button theme' onclick="dark_theme()">
</svg>`
}
if(element2=="line"){
add=add+`
<div class="line-it-button" data-lang="ja" data-type="share-b" data-ver="3" data-url="${location.href}" data-color="default" data-size="small" data-count="false" style="display: none;width:45px;"></div>
`
}
if(element2=="twitter"){
add=add+`
<a onclick="share('twitter')"><img src="./icon/twitter.svg" width="30" height="30" class="nav-menu-button"></a>`
}
if(element2=="hatenabookmark"){
add=add+`
<a onclick="share('hatenabookmark')"><img src="./icon/hatenabookmark.png" width="30" height="30" class="nav-menu-button"></a>
`
}
if(element2=="pocket"){
add=add+`
<a onclick="share('pocket')"><img src="./icon/pocket.png" width="30" height="30" class="nav-menu-button"></a>
`
line=true
}
})
element_add("div","nav-pc",add,"nav-menu");
element_add("div","nav-mobile",add,"nav-menu");
if(line){
//LineIt.loadButton();
}
}
if(element.default&&getParam("display")==null){
if(element.mode=="json"){
jsonload(element.source,false);
}else if(element.mode=="html"){
htmlload(element.source,false);
}else if(element.mode=="iflame"){
iflameload(element.source,false);
}
}
})
if("json"==getParam("mode")){
jsonload(getParam("display"),false);
}else if("html"==getParam("mode")){
htmlload(getParam("display"),false);
}
if(window.matchMedia('(prefers-color-scheme: dark)').matches === true){
dark_theme()
}else{
light_theme()
}
})
.catch(error => {
console.log(error);
console.log("失敗しました");
});
}
function share(site){
if(site=="twitter"){
window.location.href=`https://twitter.com/share?url=${encodeURIComponent(location.href)}&text=${page_title}`
}else if(site=="hatenabookmark"){
window.location.href=`http://b.hatena.ne.jp/add?mode=confirm&url=${encodeURIComponent(location.href)}&title=${page_title}`
}else if(site=="pocket"){
window.location.href=`http://getpocket.com/edit?url=${encodeURIComponent(location.href)}&title=${page_title}`
}
}

navload();
var page_title;
var theme;

function dark_theme(){
theme="dark";
document.getElementById("css").href="dark-theme.css";
for(var i=0;i<2;i++){
document.getElementsByClassName("theme")[i].style.backgroundColor="white";
document.getElementsByClassName("theme")[i].setAttribute("onclick","light_theme()");
document.getElementsByClassName("theme")[i].innerHTML=`
<path d="M36.4734 29.146C38.7655 28.4012 41.2346 28.4012 43.5268 29.146C45.819 29.8907 47.8165 31.342 49.2331 33.2919C50.6498 35.2417 51.4128 37.59 51.4128 40.0001C51.4128 42.4102 50.6498 44.7585 49.2331 46.7083C47.8165 48.6581 45.819 50.1094 43.5268 50.8542C41.2346 51.599 38.7655 51.599 36.4734 50.8542C34.1812 50.1094 32.1837 48.6581 30.767 46.7083C29.3504 44.7585 28.5874 42.4102 28.5874 40.0001C28.5874 37.59 29.3504 35.2417 30.767 33.2919C32.1837 31.342 34.1812 29.8907 36.4734 29.146Z" stroke="#C2CCDE" stroke-linecap="round" stroke-linejoin="round" />
<path d="M40.0001 14L40.025 22.0079L40.0006 22L39.9751 22.0083L40.0001 14Z" stroke="#C2CCDE" stroke-linecap="round" stroke-linejoin="round" />
<path d="M29.445 25.4297L24.7176 18.9656L29.4047 25.4593L29.4204 25.4377L29.445 25.4297Z" stroke="#C2CCDE" stroke-linecap="round" stroke-linejoin="round" />
<path d="M22.8969 34.4166L15.2726 31.9656L22.8815 34.4641V34.4377L22.8969 34.4166Z" stroke="#C2CCDE" stroke-linecap="round" stroke-linejoin="round" />
<path d="M22.8815 45.5359L15.2726 48.0344L22.8969 45.5834L22.8816 45.5623L22.8815 45.5359Z" stroke="#C2CCDE" stroke-linecap="round" stroke-linejoin="round" />
<path d="M29.4047 54.5407L24.7176 61.0344L29.445 54.5703L29.4205 54.5623L29.4047 54.5407Z" stroke="#C2CCDE" stroke-linecap="round" stroke-linejoin="round" />
<path d="M39.9751 57.9917L40.0001 66L40.025 57.9921L40.0006 58L39.9751 57.9917Z" stroke="#C2CCDE" stroke-linecap="round" stroke-linejoin="round" />
<path d="M50.5553 54.5706L55.2825 61.0344L50.5959 54.5414L50.5807 54.5623L50.5553 54.5706Z" stroke="#C2CCDE" stroke-linecap="round" stroke-linejoin="round" />
<path d="M57.1041 45.5837L64.7275 48.0344L57.1196 45.5362V45.5623L57.1041 45.5837Z" stroke="#C2CCDE" stroke-linecap="round" stroke-linejoin="round" />
<path d="M57.1196 34.4377L57.1196 34.4638L64.7275 31.9656L57.1041 34.4163L57.1196 34.4377Z" stroke="#C2CCDE" stroke-linecap="round" stroke-linejoin="round" />
<path d="M50.5959 25.4586L55.2825 18.9656L50.5553 25.4294L50.5807 25.4377L50.5959 25.4586Z" stroke="#C2CCDE" stroke-linecap="round" stroke-linejoin="round" />
`;
}
}
function light_theme(){
theme="light";
document.getElementById("css").href="light-theme.css";
for(var i=0;i<2;i++){
document.getElementsByClassName("theme")[i].style.backgroundColor="black";
document.getElementsByClassName("theme")[i].setAttribute("onclick","dark_theme()");
document.getElementsByClassName("theme")[i].innerHTML='<path d="M49.8987 16.1007C43.5601 13.4752 36.4382 13.4752 30.0997 16.1007C23.7611 18.7262 18.7252 23.7622 16.0997 30.1007C13.4742 36.4393 13.4742 43.5612 16.0997 49.8997C18.7252 56.2383 23.7611 61.2742 30.0997 63.8997C36.4382 66.5252 43.5601 66.5252 49.8987 63.8997C50.1666 63.7887 50.4322 63.6735 50.6954 63.5539C52.4693 62.7484 51.7084 60.1519 49.8243 59.6557C48.9428 59.4236 48.0732 59.1312 47.2215 58.7784C42.2412 56.7155 38.2844 52.7587 36.2215 47.7784C34.1586 42.7981 34.1586 37.2024 36.2215 32.2221C38.2844 27.2418 42.2412 23.285 47.2215 21.2221C48.0732 20.8693 48.9429 20.5769 49.8244 20.3447C51.7084 19.8486 52.4694 17.2521 50.6955 16.4465C50.4322 16.327 50.1666 16.2117 49.8987 16.1007Z" stroke="#C2CCDE" stroke-linecap="round" stroke-linejoin="round" />';
}
}

function jsonload(url,autoclose=true){
history.replaceState('','',`?display=${url}&mode=json`);
document.getElementById("main").innerHTML="";
fetch(`./${url}.json`)
.then(response => {
if(response.statusText!=="OK"){
errorload(response.statusText,autoclose)
}
return response.text();
})
.then(data => {
document.getElementById("list").style.display="block";
display_adjustment();
var content_list=[];
var meta_title="wawa";
document.getElementById("main").innerHTML="";
JSON.parse(data).forEach(function(element){
if(element.display!==false){
var content_output="";
element.content.forEach(function(content){
content_output=content_output+`${content}<br>
`;
})
element_add("section","main",`<h1>${element.title}</h1>${marked(content_output)}`);
content_list.push(element.title);
}
if(element.meta_title!==undefined){
page_title=element.meta_title;
meta_title=element.meta_title;
}
})
document.getElementById("selecting-contents-display").innerHTML=meta_title;
content_list_display(content_list);
document.title=meta_title;
if(window.innerWidth<425 && autoclose==true){
switch_temporary=meta_title;
mobile_header_switch();
slideout.close();
list_hidden()
}
if(window.innerWidth<425){
switch_temporary=meta_title;
document.getElementById("main").style.margin="50px 0px 0px";
if(document.getElementById("list-open-invalid")!= null){
document.getElementById("list-open-invalid").setAttribute("onclick","slideout.toggle();list_hidden();");
document.getElementById("list-open-invalid").id="list-open";
}
}
})
.catch(error => {
console.log("失敗しました");
console.log(error);
});
for(var i=0;i<document.getElementsByClassName("select-button").length;i++){
document.getElementsByClassName("select-button")[i].classList.remove("selecting");
}
for(var i=0;i<document.getElementsByClassName("select-button").length;i++){
if(`json-${url}`==document.getElementsByClassName("select-button")[i].dataset.source){
document.getElementsByClassName("select-button")[i].classList.add("selecting");
}
}

}


function errorload(errorcode,autoclose=true){
var url=""
console.log("error:"+errorcode)
document.getElementById("list").style.display="none";
if(errorcode=="Not Found"){
url="error/404"
}
document.getElementById("main").innerHTML=""
if(window.innerWidth<425 && autoclose==true){
console.log(switch_temporary);
mobile_header_switch();
slideout.close();
list_hidden()
}
if(window.innerWidth<425){
mobile_header_switch();
}
fetch(`./${url}.html`)
.then(response => {
return response.text();
})
.then(data => {
if(window.innerWidth<425){
console.log(switch_temporary);
mobile_header_switch();
slideout.close();
list_hidden()
}
page_title=JSON.parse(data.match(/<%.*%>/)[0].slice(2,-2)).title;
document.title=JSON.parse(data.match(/<%.*%>/)[0].slice(2,-2)).title;
document.getElementById("selecting-contents-display").innerHTML=document.title=JSON.parse(data.match(/<%.*%>/)[0].slice(2,-2)).title;

document.getElementById("main").innerHTML="";
element_add("div","main",data);
document.getElementById("list").style.display="none";
var script = document.createElement('script');
if(JSON.parse(data.match(/<%.*%>/)[0].slice(2,-2)).script_src==null){
JSON.parse(data.match(/<%.*%>/)[0].slice(2,-2)).script_src
document.body.appendChild(script);
}
display_adjustment();
if(window.innerWidth<425){
switch_temporary=JSON.parse(data.match(/<%.*%>/)[0].slice(2,-2)).title;
document.getElementById("main").style.margin="40px 0px 0px";
if(document.getElementById("list-open")!= null){
document.getElementById("list-open").setAttribute("onclick","");
document.getElementById("list-open").id="list-open-invalid";
}
}
})
.catch(error => {
console.log("失敗しました");
console.log(error);
});
}
var aaaaa="";
function htmlload(url,autoclose=true){
for(var i=0;i<document.getElementsByClassName("select-button").length;i++){
document.getElementsByClassName("select-button")[i].classList.remove("selecting");
}
for(var i=0;i<document.getElementsByClassName("select-button").length;i++){
if(`html-${url}`==document.getElementsByClassName("select-button")[i].dataset.source){
document.getElementsByClassName("select-button")[i].classList.add("selecting");
}
}
history.replaceState('','',`?display=${url}&mode=html`);
fetch(`./${url}`)
.then(response => {
if(response.statusText!=="OK"){
errorload(response.statusText,autoclose)
}
return response.text();

})
.then(data => {
document.getElementById("main").innerHTML="";
element_add("div","main",data);
page_title=JSON.parse(data.match(/<%.*%>/)[0].slice(2,-2)).title;
document.title=JSON.parse(data.match(/<%.*%>/)[0].slice(2,-2)).title;
document.getElementById("selecting-contents-display").innerHTML=document.title=JSON.parse(data.match(/<%.*%>/)[0].slice(2,-2)).title;
document.getElementById("list").style.display="none";
var script = document.createElement('script');
script.src = JSON.parse(data.match(/<%.*%>/)[0].slice(2,-2)).script_src;
document.body.appendChild(script);
aaaaa=data;
display_adjustment();
if(window.innerWidth<425){
switch_temporary=JSON.parse(data.match(/<%.*%>/)[0].slice(2,-2)).title;
document.getElementById("main").style.margin="40px 0px 0px";
if(document.getElementById("list-open")!= null){
document.getElementById("list-open").setAttribute("onclick","");
document.getElementById("list-open").id="list-open-invalid";
}
}
if(window.innerWidth<425 && autoclose==true){
mobile_header_switch();
slideout.close();
list_hidden()
}
})
.catch(error => {
console.log("失敗しました");
console.log(error);
});
}

function iflameload(url,autoclose=true){
document.getElementById("main").innerHTML=""
element_add("iflame","main","",null,null,null,url)
document.getElementById("list").style.display="none";
display_adjustment();

document.getElementById("main").innerHTML=""
fetch(`${url}`)
.then(response => {
return response.text();
})
.then(data => {
document.title=data.match(/<title>.*<\/title>/)[0].slice(7,-8);
if(window.innerWidth<425){
switch_temporary=data.match(/<title>.*<\/title>/)[0].slice(7,-8);
document.getElementById("main").style.margin="40px 0px 0px";
document.getElementById("list-open").id="list-open-invalid";
document.getElementById("list-open").setAttribute("onclick","");
}
if(window.innerWidth<425 && autoclose==true){
console.log(switch_temporary);
mobile_header_switch();
slideout.close();
list_hidden()
}

})
.catch(error => {
console.log("失敗しました");
console.log(error);
});
if(window.innerWidth<425 && autoclose==true){
console.log(switch_temporary);
mobile_header_switch();
slideout.close();
list_hidden()
}
for(var i=0;i<document.getElementsByClassName("select-button").length;i++){
document.getElementsByClassName("select-button")[i].classList.remove("selecting");
}
for(var i=0;i<document.getElementsByClassName("select-button").length;i++){
if(`iflame-${url}`==document.getElementsByClassName("select-button")[i].dataset.source){
document.getElementsByClassName("select-button")[i].classList.add("selecting");
}
}
history.replaceState('','',`?display=${url}&mode=iflame`);
document.getElementById("selecting-contents-display").innerHTML=meta_title;
}


function getParam(name, url) {
if (!url) url = window.location.href;
name = name.replace(/[\[\]]/g, "\\$&");
var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
results = regex.exec(url);
if (!results) return null;
if (!results[2]) return '';
return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function content_list_display(content_list){
document.getElementById("contents-list").innerHTML="";
var i=0;
content_list.forEach(function(element){
element_add("li","contents-list",element,null,`document.getElementsByTagName("section")[${i}].scrollIntoView(true);slideout.close();`);
i++
})
}
const yougo_area = document.getElementsByTagName("main")[0]
const yougo_parts = document.getElementsByTagName("section")
const input = document.getElementById('search_word');

input.addEventListener('input',()=>{
reset();
const sword = input.value;
if(sword==''){return}
const regexp = new RegExp(`(?<=>)[^<>]*?(${sword})[^<>]*?(?=<)`,'gi');
const regexp2 = new RegExp(sword,'gi');
[...yougo_parts].forEach(part=>{
if(part.textContent.indexOf(sword)==-1){
part.classList.add('hide');
}else{
part.innerHTML=part.innerHTML.replace(regexp,function(){
return arguments[0].replace(regexp2,`<span class="highlight">${sword}</span>`);
});
}
});
});

function reset(){
console.log('reset');
[...document.getElementsByClassName('highlight')].forEach(el=>{
el.outerHTML=el.textContent;
});
[...document.getElementsByClassName('hide')].forEach(el=>{
el.classList.remove('hide');
});
}


display_adjustment();
