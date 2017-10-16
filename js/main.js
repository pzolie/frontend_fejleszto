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
    time: "2018-08-03 18:00:00",
    seller: "Kiss Márton",
    pcs: 5,
    link: "licit/1"
  },  
  {
    event: "Diótörő",
    time: "2018-08-03 18:00:00",
    seller: "Kiss Márton",
    pcs: 5,
    link: "licit/1"
  },  
  {
    event: "MOMA Party",
    time: "2018-08-03 18:00:00",
    seller: "Kiss Márton",
    pcs: 5,
    link: "licit/1"
  },  
  {
    event: "A kékszakállú herceg vára",
    time: "2018-08-03 18:00:00",
    seller: "Kiss Márton",
    pcs: 5,
    link: "licit/1"
  },  
  {
    event: "Balett mindenkinek",
    time: "2018-08-03 18:00:00",
    seller: "Kiss Márton",
    pcs: 5,
    link: "licit/1"
  },  
  {
    event: "Macskák",
    time: "2018-08-03 18:00:00",
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
