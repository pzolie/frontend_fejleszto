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
            row.find("td").eq(0).html(index+1);
            row.find("td").eq(1).html(ticket.event);
            row.find("td").eq(2).html(ticket.time);
            row.find("td").eq(3).html(ticket.seller);
            row.find("td").eq(4).html(ticket.pcs);
            row.find("td").eq(5).html(ticket.event);
            tbody.append(row);
      });
    }

    // lista újratöltése ajax-al 
    // meghívja a fillTicketsTabele-t is
    function refreshTicketList(){
        var urlParams = [];
        var url = RESTURL + "/tickets";

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

    function refreshPaginate(){
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

    }


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
      
        paginatorUlElem.html(html.join(''));
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