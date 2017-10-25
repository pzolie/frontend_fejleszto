$(document).ready(function(){
    var RESTURL = "http://localhost:3000";
    var searchString = '';
    var sortKey = '';
    var sortDirection ='';
    var ticketListTable = $("#ticket-list");
    //lapozáshoz globális változók
    var pageLimit = 4; // hány egyed jelenjen meg
    var currentPage = 1;
    var maxPage = 0;
    var totalCount = 0;

    // tábla kitöltése javascript objektumból 
    function fillTicketsTable(currentTickets) {
        var tbody = $("#ticket-list tbody");
        tbody.html('');

        $.each(currentTickets, function (index, ticket) {
            var row = $(".templates .ticket-row").clone();
//            row.find("td").eq(0).html(index+1);
            row.find("td").eq(0).html(index+1);
            row.find("td").eq(1).html(ticket.event);
            row.find("td").eq(2).html(ticket.time);
            row.find("td").eq(3).html(ticket.seller);
            row.find("td").eq(4).html(ticket.pcs);
            row.find("td").eq(5).html(ticket.link);
            tbody.append(row);
      });
    }

    // lista újratöltése ajax-al 
    // meghívja a fillTicketsTabele-t is
    function refreshTicketList(){
        var urlParams = [];
        var url = RESTURL + "/tickets";
        var reg = /\?.*event\=([0-9]*)/;
        var eventId = 0;

        // lapozó adatok kezelése
        urlParams.push('_limit=' + pageLimit);
        urlParams.push('_page=' + currentPage);

        // ez a sima szoveges kerese kezelese
        if (searchString.length > 0){
            urlParams.push('q='+searchString);
        }

        // rendezes kezelese
        if(sortKey.length > 0) {
            urlParams.push('_sort=' + sortKey);
            urlParams.push('_order=' + sortDirection);

        }
        eventId = window.location.toString().match(reg)[1]; 
        urlParams.push('eventId = ' + eventId);

        $("#ticket-list-paginator > ul > li").on('click', function(){
            currentPage = $(this).text();
         }); 

        // ha van url parameter akkor osszefuzuk az url valtozoba
        if(urlParams.length > 0) {
            url = url + "?" + urlParams.join('&');
        }

        $.getJSON(url).done(function(ticketList, textStatus, request){
            var oldMaxPage = maxPage;
            totalCount = request.getResponseHeader('X-Total_Count');
            maxPage = totalCount / pageLimit;
            if (maxPage % 1 !== 0 ) {
                maxPage = parseInt(maxPage) + 1;
            }
            if (oldMaxPage != maxPage) {
                renderTicketTablePaginator();
            }
            refreshPaginate();
            fillTicketsTable(ticketList);
        });
    }

    function refreshPaginate() {
        var paginatorElem = $('#ticket-list-paginator');

        // bal oldali nyilacska elem referencia
        var firstElem = paginatorElem.find('ul > li:first-child');
        // jobb oldali nyilacska elem referencia
        var lastElem = paginatorElem.find('ul > li:last-child');

        if (currentPage == 1) {
            // bal oldali nyilacska tiltasa
            firstElem.addClass('disabled');

            // ha tiltva van a jobb oldali nyilacska akkor levesszuk a tiltast
            lastElem.removeClass('disabled');
        } else if (currentPage == maxPage) {
            firstElem.removeClass('disabled');
            lastElem.addClass('disabled');
        } else {
            // kozepen vagyunk a lapozoban ezert az elso es utolso elem tiltasokat elvesszuk
            firstElem.removeClass('disabled');

            lastElem.removeClass('disabled');
        }

        // Megnezzuk hogy van-e most olyan elem a paginatorban ami active
        var currentActiveElem = paginatorElem.find('ul > li.active');
        if (currentActiveElem.length > 0) {
            // ha van olyan elem akkor levesszuk rola az active class-t
            currentActiveElem.removeClass('active');
        }

        // jelenlegi oldalszamot tartalmazo li elemet megjeloljuk az active class-val
        paginatorElem.find('ul > li').eq(currentPage).addClass('active');
    }

    /*    function refreshPaginate(){
        var paginatorElem = $("#ticket-list-paginator");
        var firstElem = paginatorElem.find("ul > li:first-child");
        var lastElem = paginatorElem.find("ul > li:last-child");

        if (currentPage == 1 ){
            // bal oldali nyíl tiltása
            firstElem.addClass('disabled');

            lastElem.removeClass('disabled');
            lastElem.prev().removeClass('disabled');
        } else {
            firstElem.removeClass('disabled');
            firstElem.next().removeClass('disabled');
            lastElem.addClass('disabled');

        }
        paginatorElem.find('ul > li').eq(currentPage).addClass('active');

    } */


    function renderTicketTablePaginator(){
        var paginatorUlElem = $('#ticket-list-paginator > ul');
        paginatorUlElem.html("");

        var html = [];
        html.push('<li class="page-item"><a class="page-link" href="#" aria-label="Previous" data-paginate-size="prev"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>');
        // belső elemek 
        for(var i=1; i <= maxPage; i++){
            html.push('<li class="page-item"><a class="page-link" href="#" data-paginate-size="'+i+'">'+i+'</a></li>');      
        }

        html.push('<li class="page-item"><a class="page-link" href="#" aria-label="Next" data-paginate-size="next"><span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span></a></li>');
      
        // tomb osszefuzese ures szoveggel es utana az UL elem-be toltese
        paginatorUlElem.html(html.join(''));

        // mivel kicsereltuk a lapozo teljes html-t igy az esemenykezeloket is ujra hozza kell adni
        bindPaginatorEvents();
    }

  /*
     * erre itt azert van szukseg mert amikor renderTicketTabletPaginator() metodus lefut
     * akkor mi toroltuk az UL -ben levo osszes elemet igy az eddig felvett click 
     * esemenyek torlodtek es ujra fel kell hogy vegyuk oket mivel renderTicketTabletPaginator() -ban 
     * teljesen ujra generaljuk a paginatorban levo LI elemeket es benne az A elemeket
    */
    function bindPaginatorEvents() {
        // Paginatorban levo gombok lekezelese
        $('#ticket-list-paginator > ul > li > a').click(
            function (event) {
                var oldCurrentPage = currentPage;
                // click esemeny megallitasa, igy nem fut le az A elemben megadott href attributum url keres
                event.preventDefault();
                // data-paginate-size kiolvasasa
                var paginateSize = $(this).data('paginate-size');
                if (paginateSize == 'prev') {
                    // ha prev gombra nyomtak akkor csokkentjuk a "globalis" currentPage erteket
                    currentPage--;
                } else if (paginateSize == 'next') {
                    // ha next gombra nyomtak akkor noveljuk a "globalis" currentPage erteket
                    currentPage++;
                } else {
                    currentPage = parseInt(paginateSize);
                }
                if (oldCurrentPage != currentPage) {
                    // lista frissitese
                    refreshTicketList();
                }
            }
        );
    }


    $(".tickets-search-row input").on("keyup", function () {
        searchString = $(this).val();
        refreshTicketList();
    });


    ticketListTable.find("thead th[data-key]").on("click", function () {
        var th = $(this);
        $.each(ticketListTable.find('thead th[data-key]'), function (index, elem){
            var currentTh = $(elem);
            if (th.data("key") != currentTh.data("key")) {
            currentTh.removeClass("asc").removeClass("desc");
            }
        });

        sortKey = th.data("key");

        
        if(th.hasClass("asc")) {
            sortDirection = 'desc';
            th.removeClass("asc").addClass("desc");
        } else {
            sortDirection = 'asc';
            th.removeClass("desc").addClass("asc");
        }
            refreshTicketList();
        });


    // innen indult az alkalmazás
    refreshTicketList();


});