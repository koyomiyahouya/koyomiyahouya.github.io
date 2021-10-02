/*
            **JsonSite**
    バージョン:1ということにしておこうかな?
    作成者:表口
    discord:e331#4378
*/
$("a[href^='http']:not([href*='" + location.hostname + "'])").attr('target', '_blank');
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

function element_add(element_type,position,content,addclassname=null,onclick=null,data=null,src=null){
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
    document.getElementById(position).appendChild(new_element);
}

function navload(){
    fetch(`./subject-list.json`)
        .then(response => {
            return response.text();
        })
        .then(data => {
            JSON.parse(data).forEach(function(element){
                if(element.mode=="json"){
                    element_add("div","nav-pc",element.title,"select-button",`jsonload(\"${element.source}\")`,`${element.mode}-${element.source}`);
                    element_add("div","nav-mobile",element.title,"select-button",`jsonload(\"${element.source}\")`,`${element.mode}-${element.source}`);
                }else if(element.mode=="html"){
                    element_add("div","nav-pc",element.title,"select-button",`htmlload(\"${element.source}\")`,`${element.mode}-${element.source}`);
                    element_add("div","nav-mobile",element.title,"select-button",`htmlload(\"${element.source}\")`,`${element.mode}-${element.source}`);
                }else if(element.mode=="iflame"){
                    element_add("div","nav-pc",element.title,"select-button",`iflameload(\"${element.source}\")`,`${element.mode}-${element.source}`);
                    element_add("div","nav-mobile",element.title,"select-button",`iflameload(\"${element.source}\")`,`${element.mode}-${element.source}`);
                }
            })
        })
        .catch(error => {
            console.log("失敗しました");
        });
}




function jsonload(url,autoclose=true){
    document.getElementById("main").innerHTML=""
    fetch(`./${url}.json`)
        .then(response => {
            return response.text();
        })
        .then(data => {
            document.getElementById("list").style.display="block";
            display_adjustment();
            var content_list=[];
            var meta_title="wawa";
            JSON.parse(data).forEach(function(element){
                if(element.display!==false){
                    var content_output="";
                    element.content.forEach(function(content){
                        content_output=content_output+`${content}<br>\n`;
                    })
                    element_add("section","main",`<h1>${element.title}</h1>${marked(content_output)}`);
                    content_list.push(element.title);
                }
                if(element.meta_title!==undefined){
                    meta_title=element.meta_title;
                }
            })
            for(var i=0;i<document.getElementsByClassName("select-button").length;i++){
                document.getElementsByClassName("select-button")[i].classList.remove("selecting");
            }
            for(var i=0;i<document.getElementsByClassName("select-button").length;i++){
                if(`json-${url}`==document.getElementsByClassName("select-button")[i].dataset.source){
                    document.getElementsByClassName("select-button")[i].classList.add("selecting");
                }
            }
            history.replaceState('','',`?display=${url}&mode=json`);
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
                document.getElementById("list-open").style.color="black";
                document.getElementById("list-open").setAttribute("onclick","slideout.toggle();list_hidden();");
            }
        })
        .catch(error => {
            console.log("失敗しました");
            console.log(error);
        });
}


function htmlload(url,autoclose=true){
    document.getElementById("main").innerHTML=""
    fetch(`./${url}.html`)
        .then(response => {
            return response.text();
        })
        .then(data => {
            element_add("div","main",data);
            document.getElementById("list").style.display="none";
            display_adjustment();
            for(var i=0;i<document.getElementsByClassName("select-button").length;i++){
                document.getElementsByClassName("select-button")[i].classList.remove("selecting");
            }
            for(var i=0;i<document.getElementsByClassName("select-button").length;i++){
                if(`html-${url}`==document.getElementsByClassName("select-button")[i].dataset.source){
                    document.getElementsByClassName("select-button")[i].classList.add("selecting");
                }
            }
            if(window.innerWidth<425 && autoclose==true){
                console.log(switch_temporary);
                mobile_header_switch();
                slideout.close();
                list_hidden()
            }
            if(window.innerWidth<425){
                switch_temporary=data.match(/<title>.*<\/title>/)[0].slice(7,-8);
                document.getElementById("main").style.margin="40px 0px 0px";
                document.getElementById("list-open").style.color="gainsboro";
                document.getElementById("list-open").setAttribute("onclick","");
            }

            document.title=data.match(/<title>.*<\/title>/)[0].slice(7,-8);
            history.replaceState('','',`?display=${url}&mode=html`);
            document.getElementById("selecting-contents-display").innerHTML=meta_title;
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
                document.getElementById("list-open").style.color="gainsboro";
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

var test='<title>html</title><div style="background-color: red;width: 100%;height: 100%;;">a</div>';
display_adjustment();
navload();
if(getParam("display")==null){
    jsonload("./source/1",false);
}else{
    if("json"==getParam("mode")){
        jsonload(getParam("display"),false);
    }else if("html"==getParam("mode")){
        htmlload(getParam("display"),false);
    }
}
