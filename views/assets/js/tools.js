var getunitHtml = function(unit){
    var unitHtml='';
    unitHtml += "<option value=''></option>";
    for(var i=0;i<unit.length;i++){
        unitHtml += "<option value='"+unit[i].id+"'>"+unit[i].name+"</option>";
    }
    return unitHtml;
}

var getTypeHtml = function(type){
    var unitHtml='';
    unitHtml += "<option value=''></option>";
    for(var i=0;i<type.length;i++){
        unitHtml += "<option value='"+type[i].attrName+"'>"+type[i].attrValue+"</option>";
    }
    return unitHtml;
}





// var getAirListHtml = function(userlist,num){
//     var html = "<a href='#' class='li-all'> <i> > </i> 空情源列表</a>";
//     html += "<ul>";
//     var foo = function(data,n){
//         for(var i = 0;i<data.length;i++){
//             var zz =">",c='>';
//             if(data[i].hasOwnProperty("child") && data[i].child.length > 0){
//                 for(var a=0;a<n;a++){
//                     zz += c;
//                 }
//                 if(num == 1){
//                     html += "<li id='lis"+data[i].id+"' style='display:none'> <i> "+zz+"</i><input id='ins"+data[i].id+"' type='checkbox' name='kqys'  value='"+data[i].id+"'/>"+data[i].name+"</li><ul id='uls"+data[i].id+"'>";
//                 }else{
//                     html += "<li id='li"+data[i].id+"'> <i> "+zz+"</i><input type='checkbox' id='in"+data[i].id+"' name='kqy'  value='"+data[i].id+"'/>"+data[i].name+"</li><ul id='ul"+data[i].id+"'>";
//                 }
//                 n += 1;
//                 foo(data[i].child,n);
//                 n -= 1;
//                 html+="</ul>";
//
//             }else{
//                 for(var a=0;a<n;a++){
//                     zz += c;
//                 }
//                 if(num == 1){
//
//                     html += "<li id='lis"+data[i].id+"' style='display:none'> <i> "+zz+"<input id='ins"+data[i].id+"' type='checkbox'  name='kqys' value='"+data[i].id+"'/></i>"+data[i].name+"</li>";
//                 }else{
//
//                     html += "<li id='li"+data[i].id+"'> <i> "+zz+"<input type='checkbox' id='in"+data[i].id+"'  name='kqy' value='"+data[i].id+"'/></i>"+data[i].name+"</li>";
//                 }
//
//             }
//
//         }
//     };
//     foo(userlist,1);
//     html +='</ul>';
//
//     return html;
//
// };

// var getAirListHtml2 = function(userlist,num){
//     var html = "<a href='#' class='li-all'> <i> > </i> 空情用户和空情源列表</a>";
//     html += "<ul>";
//     var foo = function(data,n){
//         for(var i = 0;i<data.length;i++){
//             var zz =">",c='>';
//             if(data[i].hasOwnProperty("child") && data[i].child.length > 0){
//                 for(var a=0;a<n;a++){
//                     zz += c;
//                 }
//                 if(num == 1){
//                     html += "<li id='lis"+data[i].id+"' style='display:none'> <i> "+zz+"</i><input id='ins"+data[i].id+"' type='checkbox' name='kqys'  value='"+data[i].id+"'/>"+data[i].name+"</li><ul id='uls"+data[i].id+"'>";
//                 }else{
//                     html += "<li id='li"+data[i].id+"'> <i> "+zz+"</i><input type='checkbox' id='in"+data[i].id+"' name='kqy'  value='"+data[i].id+"'/>"+data[i].name+"</li><ul id='ul"+data[i].id+"'>";
//                 }
//                 n += 1;
//                 foo(data[i].child,n);
//                 n -= 1;
//                 html+="</ul>";
//             }else{
//                 for(var a=0;a<n;a++){
//                     zz += c;
//                 }
//                 if(num == 1){
//                     html += "<li id='lis"+data[i].id+"' style='display:none'> <i> "+zz+"<input id='ins"+data[i].id+"' type='checkbox'  name='kqys' value='"+data[i].id+"'/></i>"+data[i].name+"</li>";
//                 }else{
//                     html += "<li id='li"+data[i].id+"'> <i> "+zz+"<input type='checkbox' id='in"+data[i].id+"'  name='kqy' value='"+data[i].id+"'/></i>"+data[i].name+"</li>";
//                 }
//             }
//         }
//     };
//     foo(userlist,1);
//     html +='</ul>';
//     return html;
// };

//     var html = "<ul class='list'>";
//     var fosos = function(d){
//         for(var c=0;c< d.length;c++){
//             if(d[c].list && d[c].list.length > 0){
//                 html += "<li class='lista'>"+d[c].typeName+"</li>";
//                 html += "<ul class='list_2'>";
//                 fosos(d[c].list);
//                 html += "</ul>";
//             }else{
//                 html += "<li class='listb'><a href='Z_typePriviHtml?id="+d[c].Id+"'>"+d[c].typeName+"</a></li>";
//             }
//         }
//     }
//     fosos(dataA);
//     html += '</ul>';
//     return html;
// };
//
