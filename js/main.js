//Callback függvény fade után
function fadeDone() {
    console.log(this);  
}

//Eseménykezelő beállítása
$("p").click(function(){
    $(this).hide();
    $(this).slideDown(3500).css("color","blue");
//    $(this).fadeTo(5000,1,fadeDone);
});

//Esemény kiváltása


 //Kattintás megelőzése
  $("nav a.nav-link").click(function(ev){
    ev.preventDefault();
    var link = $(this);
    var prop = link.data("prop") || "opacity";
    var val = link.data("value") || "0";
    var speed = link.data("speed") || 1000;
    var settings = {}; //objektum létrehozása
    settings[prop] = val; //animate első paramétere

    $(document.body).animate(settings, speed, function(){
        document.location = link.attr("href");
    });
 }); 


 //Events script
  $(".events-search-row input").on("keyup",function(ev) {
    $.each($(".events-card-deck .card .card-title"), function(index,elem){
      var elem = $(elem);
      var search = ev.target.value.toLowerCase();
      var content = elem.html().toLowerCase();
      if ( content.indexOf(search) == -1 ) {
        elem.parents(".card").hide();
      } else {
        elem.parents(".card").show();
      }
    });
  }); 

// regiszter oldal
$(".cherry-custom-file").on("change", function(ev){
    var name = ev.target.value.split("\\").pop();
    $(this).find(".file-name").html(name);
})

// Ticket oldal
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});
var alertBox =  $(".alert.alert-primary");
function showInvalidMessage() {
 alertBox
 .removeClass("alert-primary")
 .addClass("alert-danger")
 .find(".alert-message")
 .text("Sikertelen belépés");
}

// ticket oldal
$(function(){
  $('[data-toggle="tooltip"]').tooltip();
});

// Jegyek tömbje
var tickets = [
  {
    event: "Sziget Fesztivál",
    time: "2018-06-03 18:00:00",
    seller: "Kiss Márton",
    pcs: 10,
    link: "licit/1"
  },  
  {
    event: "Diótörő",
    time: "2018-10-03 18:00:00",
    seller: "Tóth Pál",
    pcs: 5,
    link: "licit/1"
  },  
  {
    event: "MOMA Party",
    time: "2017-08-03 18:00:00",
    seller: "Ádám Éva",
    pcs: 4,
    link: "licit/1"
  },  
  {
    event: "A kékszakállú herceg vára",
    time: "2017-11-03 18:00:00",
    seller: "Papp Zoltán",
    pcs: 12,
    link: "licit/1"
  },  
  {
    event: "Balett mindenkinek",
    time: "2018-08-10 18:00:00",
    seller: "Nagy János",
    pcs: 3,
    link: "licit/1"
  },  
  {
    event: "Macskák",
    time: "2018-12-11 18:00:00",
    seller: "Kiss Márton",
    pcs: 5,
    link: "licit/1"
  }  
];

// Jegyek táblájának generálása
var ticketTable = $("table.table.table-striped").eq(0);
function fillTicketsTable(currentTickets) {
  currentTickets = currentTickets || tickets;
  var tbody = ticketTable.find("tbody");
  tbody.html("");
  $.each(currentTickets, function (index, ticket) {
    var row = $(".templates .ticket-row").clone();
    row.find("td").eq(0).html(index+1);
    row.find("td").eq(1).html(ticket.event);
    row.find("td").eq(2).html(ticket.time);
    row.find("td").eq(3).html(ticket.seller);
    row.find("td").eq(4).html(ticket.pcs);
    row.find("td").eq(5).html(ticket.event);
    tbody.append(row);
  });
}

 fillTicketsTable();

 // Jegyek táblázat szűrése
 $(".tickets-search-row input").on("keyup", filterTickets); 
 function filterTickets() {
  var currentValue = $(this).val().toLowerCase();
  var filteredTickets = [];
  if(currentValue == ""){
    filteredTickets = tickets;
  } else {
    filteredTickets = tickets.filter (function(item){
      var done = false;
      for (var k in item) {
        if (item[k].toString().toLowerCase().indexOf(currentValue) > -1) {
          done = true;
        }
      }
      return done;
    });
  }
  fillTicketsTable(filteredTickets);
} 

// Jegyek táblázat rendezése
ticketTable.find("thead th[data-key]").on("click", orderTicketTable);
function orderTicketTable() {
  var th = $(this);
  $.each(ticketTable.find('thead th[data-key]'), function (index, elem){
    var currentTh = $(elem);
    if (th.data("key") != currentTh.data("key")) {
      currentTh.removeClass("asc").removeClass("desc");
    }
  });
  var key = th.data("key");
  var sortedTickets = tickets.map(function(item) {
    return item;
  });

  if(th.hasClass("asc")) {
    th.removeClass("asc").addClass("desc");
  } else {
    th.removeClass("desc").addClass("asc");
  }

  sortedTickets.sort(function(a,b) {
    if(th.hasClass("asc")) {
      return a[key].toString().localeCompare(b[key].toString());
    } else {
      return b[key].toString().localeCompare(a[key].toString())
    }
  
    
  });
  fillTicketsTable(sortedTickets)
}