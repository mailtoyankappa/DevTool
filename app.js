//var fs = require('fs');
function showStatus(result, label) {
  $(label).text("Status: " + result);
};

document.addEventListener('DOMContentLoaded', function () {
  $('#inputDatabaseName').on('input', function (e) {
    console.log("printing data");
    alert('Changed!');
  });

  //Read data from DB to the myServer
  $("#readDataFromDB").click(function () {
    var formData = {
      'intent': $('input[name=intent]').val(),
      'entity': $('input[name=entity]').val(),
      'selectResponse': $('select[name=selectResponse]').val(),
      'answertag': $('input[name=answertag]').val(),
      'answer': $('input[name=answer]').val(),
      'entitytype': $('input[name=entitytype]').val(),
      'linkarray': $('input[name=linkarray]').val(),
      'iconarray': $('input[name=iconarray]').val(),
      'descarray': $('input[name=descarray]').val()
    };
    //var myform = document.getElementById("NewIntent");
    //var formData = new FormData(myform);
    //var formData = JSON.stringify($("#NewIntent").serializeArray());
    $.ajax({
      type: "GET",
      url: "http://agentmaintenancetool.azurewebsites.net/readDataFromDB",
      data: formData,
      dataType: 'json',
      contentType: 'application/json',
      success: function (res) {
        //Show status
        console.log(res);
        showStatus(res.status, '#readDataFromDBLabel');
        alert("New Intent inserted Succesfully..!! " + formData.intent);
        window.location.href = 'http://agentmaintenancetool.azurewebsites.net/index.html';
      },
      error: function () {
        //Show status
        console.log(res);
        showStatus(res.status, '#readDataFromDBLabel');
        alert("Unable to insert New Intent try again..!! " + formData.intent);
        window.location.href = 'http://agentmaintenancetool.azurewebsites.net/NewIntent.html';
      }
    });

  });
  
  
 /*$("#login").click(function (event) {
   alert("Welcome");
    var formData = {
      'username': document.getElementById('username').value,
      'password': document.getElementById('password').value
    };
    $.ajax({
      type: "GET",
      url: "http://agentmaintenancetool.azurewebsites.net/login",
      data: formData,
      dataType: 'json',
      contentType: 'application/json',
      async : false,
      timeout: 60000,
      success: function (res) {
          if(res.data){
            window.location.href = 'http://agentmaintenancetool.azurewebsites.net/Home.html';
             alert("New Intent inserted Succesfully..!!" + formData.intent);
          }
        }, 
      error: function () {
        console.log(res);
        alert("Unable to save. Please check the inputs and retry" + formData.intent);
        window.location.href = 'http://agentmaintenancetool.azurewebsites.net/index.html';
      }
      });
  });*/ 

//NewLayOut
$("#addIntentDB").click(function (event) {
    var utterpath =  'D:\\home\\site\\wwwroot\\storageluis\\temp.csv';
    var entity ='NA';
    var entitytype = entity;
      //var answertag = document.getElementById('answer').value;
      //document.getElementById('intent').value
      //console.log(document.getElementById('selectResponse').value);
    if (document.getElementById('selectResponse').value != "") {
      if (document.getElementById('selectResponse').value == "Text") {
        if (document.getElementById('intent').value == '') {
          alert('Please Input The Required Fields');
          document.getElementById('intent').style.borderColor = "red";
          return false;
        } else
          document.getElementById('intent').style.borderColor = "black";
        if (document.getElementById('answer').value == '') {
          alert('Please Input The Required Fields');
          document.getElementById('answer').style.borderColor = "red";
          return false;
        } else
          document.getElementById('answer').style.borderColor = "black";
      }
      if (document.getElementById('selectResponse').value == "Hyperlink") {

        if (document.getElementById('intent').value == '') {
          alert('Please Input The Required Fields ');
          document.getElementById('intent').style.borderColor = "red";
          return false;
        } else
          document.getElementById('intent').style.borderColor = "black";
        if (document.getElementById('answer').value == '') {
          alert('Please Input The Required Fields ');
          document.getElementById('answer').style.borderColor = "red";
          return false;
        } else
          document.getElementById('answer').style.borderColor = "black";
          // console.log("link is " +localStorage.getItem('linkss'));
          // console.log(localStorage.getItem("linktagss"));
          // console.log(document.getElementById('linktag').value);
        if (document.getElementById('link').value == "undefined" || document.getElementById('linktag').value == "undefined" || document.getElementById('link').value == "" || document.getElementById('linktag').value == "") {
        
          alert("Please Add The Link");
          return false;
        }

      }
      if (document.getElementById('selectResponse').value == "MultimediaResponse") {
        if (document.getElementById('intent').value == '') {
          alert('Please Input The Required Fields');
          document.getElementById('intent').style.borderColor = "red";
          return false;
        } else
          document.getElementById('intent').style.borderColor = "black";
        if (document.getElementById('answer').value == '') {
          alert('Please Input The Required Fields');
          document.getElementById('answer').style.borderColor = "red";
          return false;
        } else
          document.getElementById('answer').style.borderColor = "black";
      
      console.log(document.getElementById('descarray').value);
       if (document.getElementById('descarray').value == '') {
          
          alert("Please Add The MultiMedia");
          return false;
        } 
      }
      }else {
        alert('Please add the   Required  Link Fields ');
            return false;
      }
    /* var Utterence = document.getElementById('Utterence');
     if(Utterence.textContent==""){
       alert('Please Input The Utterance Fields');
       return false;
     }
      /*if(!fs.existsSync(utterpath))
    	{
         alert('Please Input The Utterance Fields');
      }*/
      if(localStorage.getItem('uploadExcel')==null){
            alert('Please Input The Utterance Fields');
            return false;
      }
    var btn = document.getElementById('addIntentDB');
        btn.disabled = true;
        btn.innerText = 'Saving...';
    var formData = {
      'intent': document.getElementById('intent').value,
      'entity': entity,
      'selectResponse': document.getElementById('selectResponse').value,
      'answertag': document.getElementById('answertag').value,
      'answer': document.getElementById('answer').value,
      'entitytype': entitytype,
      'linkarray': document.getElementById('linkarray').value,
      'iconarray': document.getElementById('iconarray').value,
      'descarray': document.getElementById('descarray').value,
      'link': document.getElementById('link').value,
      'linktag': document.getElementById('linktag').value
    };
    $.ajax({
      type: "GET",
      url: "http://agentmaintenancetool.azurewebsites.net/readDataFromDB",
      data: formData,
      dataType: 'json',
      contentType: 'application/json',
      async : false,
      timeout: 60000,
      success: function (res) {
        document.getElementById("AddIntent").reset();
         //alert("New Intent inserted Succesfully..!! " + formData.intent); 
         //var url = "http://agentmaintenancetool.azurewebsites.net/index.html";
         // $(location).attr('href',url);
          // window.location.href.substr(0, window.location.href.indexOf('#'))
          event.preventDefault();
          window.location.href = 'http://agentmaintenancetool.azurewebsites.net/index.html';
           alert("New Intent inserted Succesfully..!!" + formData.intent);
        }, 
      error: function () {
        console.log(res);
        alert("Unable to save. Please check the inputs and retry" + formData.intent);
        window.location.href = 'http://agentmaintenancetool.azurewebsites.net/AddIntent.html';
      }
      });
  });
 

 //Selecting the Intent
  $(document).ready(function(){
  $(window).load(function(){
    var formData = {};
    $.ajax({
      type: "GET",
      url: "http://agentmaintenancetool.azurewebsites.net/selectDataIntent",
      data: formData,
      dataType: 'json',
      contentType: 'application/json',
      success: function (res) {
        $("#getIntent").empty();
        var list_Objects = jQuery.unique(res.data.sort());          
        $.each(list_Objects, function (key, value) {
          $('#getIntent')
            .append($("<option></option>")
            .attr("value", key)
            .text(value));
        });if($("#getIntent").length==1){
        alert("Intent has been loaded please select..!! ");}
      },
      error: function () {
        console.log(res.data);
        alert("Unable to Fetch Response based on Entity and Intent try again..!! ");
        window.location = 'http://agentmaintenancetool.azurewebsites.net/DeleteIntent.html';
      }
    });
   });
   
  });
  
  $("#getIntent").on('select', function (event) { 
    if($("#getIntent").val()=='Focus to fetch the Intent'){
       var formData = {};
       }else {
         var formData = {
              'intent': $("#getIntent option:selected").text()
            };
       }
    $.ajax({
      type: "GET",
      url: "http://agentmaintenancetool.azurewebsites.net/selectDataIntent",
      data: formData,
      dataType: 'json',
      contentType: 'application/json',
      success: function (res) {
        $("#getIntent").empty();
        var list_Objects = jQuery.unique(res.data.sort());    
        $.each(list_Objects, function (key, value) {
          $('#getIntent')
            .append($("<option></option>")
            .attr("value", key)
            .text(value));
        });
      },
      error: function () {
        console.log(res.data);
        alert("Unable to Fetch Response based on Entity and Intent try again..!! ");
        window.location = 'http://agentmaintenancetool.azurewebsites.net/DeleteIntent.html';
      }
    });   
  });
  
  //Selecting the response and entity
  $("#getIntent").on('blur change', function (event) {
    var formData = {
      //'intent': $('input[name=intent]').val()
      'intent': $("#getIntent option:selected").text()
    };
    $.ajax({
      type: "GET",
      url: "http://agentmaintenancetool.azurewebsites.net/selectData",
      data: formData,
      dataType: 'json',
      contentType: 'application/json',
      success: function (res) {
        $("#getEntity").empty();
        var list_Objects = jQuery.unique(res.data.sort()); 
        console.log("count of the entity in intent : "+list_Objects.length);  
        if(list_Objects.length==1){     
        $.each(list_Objects, function (key, value) {
          $('#getEntity')
            .append($("<option></option>")
            .attr("value", key)
            .text(value));
        });
       }else {
          alert("Connect with administrator to Edit this Intent as its having Multiple Entity..!! ");
          window.location = 'http://agentmaintenancetool.azurewebsites.net/index.html';
          return 0;
       }       
      },
      error: function () {
        console.log(res.data);
        alert("Unable to Fetch Response based on Entity and Intent try again..!! ");
        window.location = 'http://agentmaintenancetool.azurewebsites.net/DeleteIntent.html';
      }
    });

  });
  

  /*$("#getEntity").on('blur change select', function (event) {
    var formData = {
      'intent': $("#getIntent option:selected").text(),
      'entity': $("#getEntity option:selected").text()
    };
    $.ajax({
      type: "GET",
      url: "http://agentmaintenancetool.azurewebsites.net/selectDataResponse",
      data: formData,
      dataType: 'json',
      contentType: 'application/json',
      success: function (res) {
        var result = JSON.parse(res.data);
        //alert("Succesfully Fetched response based on Intent ..!! " + result.responsetag);
        //console.log("string : " + result.data);
        $("#selectResponse").empty();
        $("#answertag").empty();
        $("#answer").empty();
        $("#entitytype").empty();
        $("#linkarray").empty();
        $("#iconarray").empty();
        $("#descarray").empty();
        var selectedValue = result.responsetag;
        if (selectedValue == "MultimediaResponse") {
          $("#linkarray").css("visibility", "visible");
          $("#linkarray1").css("visibility", "visible");
          $("#iconarray").css("visibility", "visible");
          $("#iconarray1").css("visibility", "visible");
          $("#descarray").css("visibility", "visible");
          $("#descarray1").css("visibility", "visible");			
          //answertag.value = 'answer,linkarray,iconarray,entity_type,descarray';
        } else {
          if (selectedValue == "PromptsButtons") {
            //answertag.value = 'answer,buttons,entity_type';
            $("#linkarray").css("visibility", "hidden");
            $("#linkarray1").css("visibility", "hidden");
            $("#iconarray").css("visibility", "hidden");
            $("#iconarray1").css("visibility", "hidden");
            $("#descarray").css("visibility", "hidden");
            $("#descarray1").css("visibility", "hidden");
          }
          if (selectedValue == "Hyperlink") {
            //answertag.value = 'answer,link,linktag,entity_type';
            $("#linkarray").css("visibility", "visible");
            $("#linkarray1").css("visibility", "visible");
            $("#descarray").css("visibility", "visible");
            $("#descarray1").css("visibility", "visible");
            $("#linkarray").val(result.link);
            $("#descarray").val(result.linktag);
          }
          if (selectedValue == "Text") {
            //answertag.value = 'answer,entity_types';
            $("#linkarray").css("visibility", "hidden");
            $("#linkarray1").css("visibility", "hidden");
            $("#iconarray").css("visibility", "hidden");
            $("#iconarray1").css("visibility", "hidden");
            $("#descarray").css("visibility", "hidden");
            $("#descarray1").css("visibility", "hidden");
          }
        }
        $("#selectResponse").val(result.responsetag);
        $("#answertag").val(result.answertags);
        $("#answer").val(result.answer);
        if (selectedValue != "Hyperlink") {
          $("#linkarray").val(result.linkarray);
          $("#descarray").val(result.descarray);
        }
        $("#iconarray").val(result.iconarray);
        $("#entitytype").val(result.entity_type);  
      },
      error: function () {
        alert("Unable to Fetch Response based on Entity and Intent try again..!! ");
        window.location = 'http://agentmaintenancetool.azurewebsites.net/index.html';
      }
    });
  });*/

//deleteIntent
$("#intentDelete").click(function (event) {
      var flag = confirm("Are you sure you want to delete the intent?");
      if (flag) {
        var entity = "NA";
        var getIntents = document.getElementById('getIntents').value;
        var formData = {
          'intent': getIntents,
          'entity': entity
        };
        $.ajax({
          type: "GET",
          url: "http://agentmaintenancetool.azurewebsites.net/deleteChart",
          data: formData,
          async: false,
          cache: false,
          dataType: 'json',
          contentType: 'application/json',
          success: function (res) {
            console.log(res);
            alert("Succesfully Deleted the Intent ..!! " + formData.intent);
            event.preventDefault();
            window.location.href = 'http://agentmaintenancetool.azurewebsites.net/index.html';
            //$('#AddIntent').submit();
          },
          error: function () {
            console.log(res);
            alert("Unable to Delete Intent try again..!! " + formData.intent);
            window.location.href = 'http://agentmaintenancetool.azurewebsites.net/EditPolicy.html';
          }
        });
      } else {
        alert("Unable to Delete Intent try again..!! " + formData.intent);
        window.location.href = 'http://agentmaintenancetool.azurewebsites.net/EditPolicy.html';
      }
    });
  //Delete the chart
  $("#deleteChart").click(function () {
	   var formData = {
      'intent': $("#getIntent option:selected").text(),
      'entity': $("#getEntity option:selected").text()
    };
    $.ajax({
      type: "GET",
      url: "http://agentmaintenancetool.azurewebsites.net/deleteChart",
      data: formData,
      async: false,
      cache: false,
      timeout: 30000,
      dataType: 'json',
      contentType: 'application/json',
      success: function (res) {
        console.log(res);
        showStatus(res.status, '#deleteChartLabel');
        alert("Succesfully Deleted the Intent ..!! " + formData.intent);
        window.location.href = 'http://agentmaintenancetool.azurewebsites.net/index.html';
      },
      error: function () {
        console.log(res);
        showStatus(res.status, '#deleteChartLabel');
        alert("Unable to Delete Intent try again..!! " + formData.intent);
        window.location.href = 'http://agentmaintenancetool.azurewebsites.net/DeleteIntent.html';
      }
    });

  });
  
  //Update the chart
  $("#updateChart").click(function () {
	  var entity ='NA';
    var entitytype = entity;
    var answertags = document.getElementById('answer').value;
    console.log("the answer is "+answertags);
    var formData = {
      'intent': document.getElementById('getIntents').value,
      'entity': entity,
      'selectResponse': document.getElementById('selectResponse').value,
      'answertag': document.getElementById('answertag').value,
      'answer': document.getElementById('answer').value,
      'entitytype': entitytype,
      'linkarray': document.getElementById('linkarray').value,
      'iconarray': document.getElementById('iconarray').value,
      'descarray': document.getElementById('descarray').value,
      'link': document.getElementById('link').value,
      'linktag': document.getElementById('linktag').value
    };
    $.ajax({
      type: "GET",
      url: "http://agentmaintenancetool.azurewebsites.net/updateChart",
      data: formData,
      dataType: 'json',
      contentType: 'application/json',
      success: function (res) {
        console.log(res);
        showStatus(res.status, '#readDataFromDBLabel');
        alert("Updated Succesfully..!! " + formData.intent);
        window.location.href = 'http://agentmaintenancetool.azurewebsites.net/index.html';
      },
      error: function () {
        //Show status
        console.log(res);
        showStatus(res.status, '#deleteChartLabel');
      }
    });

  });
  
    //duplicate chart
  $("#upload").click(function () {     
      var data = new FormData();
    $.each($('#uploadFile')[0].files, function(i, file) {
        data.append('file-'+i, file);
    });
    $.ajax({
      type: "POST",
      url: "http://agentmaintenancetool.azurewebsites.net/uploadfileinazure",
      data: data,
      cache: false,
      processData: false,  // tell jQuery not to process the data
      contentType: false,  // tell jQuery not to set contentType
      success: function (res) {
       window.location.href = "http://agentmaintenancetool.azurewebsites.net/AddMultimediaFile.html";
       console.log(res);
       //alert(res);
      },
      error: function () {
        //Show status
        console.log(res);
      }
    });
  });
  
  
  //LUIS EXCEL
$("#uploadexc").click(function () {     
      var data = new FormData();
    $.each($('#uploadExcel')[0].files, function(i, file) {
        data.append('file-'+i, file);
    });
     // alert("Updated Succesfully..!! "+data);
    $.ajax({
      type: "POST",
      url: "http://agentmaintenancetool.azurewebsites.net/uploadexcelluis",
      data: data,
      cache: false,
      processData: false,  // tell jQuery not to process the data
      contentType: false,  // tell jQuery not to set contentType
      success: function (res) {
      // window.location = "http://agentmaintenancetool.azurewebsites.net/AddIntent.html";
       console.log(res);
       //alert(res);
      // alert("Luis Trained Successfully!! "+res.file.name);
      },
      error: function () {
        //Show status
        console.log(res);
      }
    });

  });
  
}, false);











