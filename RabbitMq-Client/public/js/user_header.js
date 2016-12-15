document.getElementById("header_menu").innerHTML= '<a href="/homepage"><img src="airbnb.png" width="33" height="50" style="float:left;padding-top:0.5cm;"></a>&nbsp;&nbsp;&nbsp;&nbsp;'+


    '<span class="header" style="padding-top:0.5cm;">'+
    '<a href="/editProfile_ab" style="float:right;padding-right:1cm;"><img src="default.png" width="28" height="28" class="img-circle"></a>'+
    '<a href="#" style="float:right;padding-right:1cm;color:#484848;">Help</a>'+
    '<a href="/user_messages" style="float:right;padding-right:1cm;color:#484848;">Messages</a>'+
    '<a href="/user_trips" style="float:right;padding-right:1cm;color:#484848;">Trips</a>'+
    '<div style="float:right;padding-right:1cm;">'+
    '<div class="dropdown">'+
    ' <button class="dropbtn">User</button>'+
    '<div class="dropdown-content">'+
    '<a href="/user_trips">Your Reservations</a>'+
    ' <a href="/user_transaction_history">Transactions History</a>'+
    '<a href="/user_reviews_ab">Reviews</a>'+
    '<a href="/search_BillsPage_sk">Search Bills</a>'+

    '<a href="/changePassword_ab">Change Password</a>'+
    '<a data-toggle="modal" data-target="#deleteModal">Delete my Account</a>'+
    '<a href="/logout_ab">Sign Out</a>'+

    '</div>'+
    '</div>'+
    '</div>'+
    '</span><br />'+


    '<div class="modal fade" id="deleteModal" role="dialog">'+
    '<div class="modal-dialog">'+
    '<div class="modal-content">'+

    '<div class="modal-header">'+
    '<h4 class="modal-title" style="text-align:center;">Delete Account</h4>'+
    '</div>'+

    '<div class="container-fluid">'+
    '<br>'+

    '<div class="modal-body">'+

    '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;'+
    'Are you sure?'+

    '<br><br>'+
    '<button type="button" class="btn btn-default" onclick="window.location.href=\'/deleteUser_ab\'">Yes</button>'+
    '<button type="button" class="btn btn-default" onclick="window.location.href=\'/homepage\'">No</button>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>';