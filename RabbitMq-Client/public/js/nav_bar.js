document.getElementById("navMenu").innerHTML =
    '<nav class="navbar navbar-inverse">'+
'<div style="background:#484848;">'+
  '<div class="container-fluid">'+
    '<div class="navbar-header" >'+
      '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">'+
        '<span class="icon-bar"></span>'+
        '<span class="icon-bar"></span>'+
        '<span class="icon-bar"></span>'+
      '</button>'+   
    '</div>'+
    '<div class="collapse navbar-collapse" id="myNavbar">'+
     ' <ul class="nav navbar-nav">'+
        '<li><a href="/gethostdash" style="color:white;">Dashboard</a></li>'+
        '<li><a href="/host_home" style="color:white;">Your Listings</a></li>'+
        '<li><a href="/host_trips" style="color:white;">Your Trips</a></li>'+
        '<li><a href="/host_profile" style="color:white;">Profile</a></li>'+
      '</ul>'+    
    '</div>'+
  '</div>'+
'</div>'+
'</nav>';