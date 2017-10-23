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
 $("p").click();

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
$(".cherry-custom-filr").on("change", function(ev){
    var name = ev.target.value.split("\\").pop();
    $(this).find(".file-name").html(name);
})

// Ticket oldal
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});