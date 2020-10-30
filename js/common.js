var GlobalData = {
    isMain:$("").hasClass("")
}

$(function(){

    var HEADER_OPAQUE_SCROLL_TOP = 200;
    var pausedScrollTop = 0;
    var timer ;
    if(!GlobalData.isMain) $("#footer .anim-group").addClass("in");

    /*common*/
    $('select.render-as--nice-select').niceSelect();


    /* header */
    $('#header .language .current').on('click', function(e){
        e.preventDefault();
    });

    $('#header .language').on('click', function(e){
        $(this).toggleClass('active');
        if(GlobalData.isMain){
            var gnbSubMenuHeight = $('#header .gnb-sub-menus-container').height();
            if ( $(window).scrollTop() < gnbSubMenuHeight ) {
                $('html,body').stop().animate({'scrollTop': gnbSubMenuHeight}, 600, 'easeOutQuint');
            }
        }
    
    });

    $(window).on('click', function(e){
        if (!$(e.target).closest('.language')[0]) {
            $('#header .language').removeClass('active');
        }
    });

    $('#header').on('mouseleave', function(e){
        $('#header').removeClass('gnb-sub-menu-opened');
        $('#header #nav .gnb li').removeClass('active inactive');
        $('#header .gnb-sub-menus .gnb-sub-menu').removeClass('active');
        clearTimeout(timer);
    });


    $('#header #nav a').on('mouseenter', function(e){
        $(this).closest('li').removeClass('inactive').addClass('active').siblings().removeClass('active').addClass('inactive');
        hideSearch();
        if(GlobalData.isMain){
            timer = setTimeout(function(){
                $('#header #gnbSubMenus').addClass('active');
            },200)
        }else{
            $('#header #gnbSubMenus').addClass('active');
        }

        //if ($('#header').hasClass('fixed')) {
        //  showGnbSubMenu();
        //}
    });

    $('#header #nav a').on('click', function(e){
        if(GlobalData.isMain){
            e.preventDefault();
            $(this).closest('li').removeClass('inactive').addClass('active').siblings().removeClass('active').addClass('inactive');
            showGnbSubMenu();
        }
    });

    function showGnbSubMenu() {
        hideSearch();
        $('#header #gnbSubMenus').addClass('active');
        if(GlobalData.isMain){
            var gnbSubMenuHeight = $('#header .gnb-sub-menus-container').height();
            if ( $(window).scrollTop() < gnbSubMenuHeight ) {

                $('html,body').stop().animate({'scrollTop': gnbSubMenuHeight}, 600, 'easeOutQuint');

            }
        }
    }

    function hideGnbSubMenu() {
        $('#header #gnbSubMenus').removeClass('active');
        $('#nav .gnb li').addClass('active').siblings().removeClass('active');
    }

    $('#header').on('mouseleave', function(e){
        hideGnbSubMenu();
    });

    $('#header .gnb-sub-menus .backdrop').on('mouseenter', function(e){
        hideGnbSubMenu();
    });

    $('#gnbSubMenus .menus > ul > li').on('mouseenter', function(e){
        var index = $(this).index();
        // console.log(index);
        $('#nav .gnb li:eq('+ index + ')').addClass('active').siblings().removeClass('active').addClass('inactive');
    });

    $('#gnbSubMenus .menus > ul > li').on('mouseleave', function(e){
        var index = $(this).index();
        // console.log(index);
        $('#nav .gnb li:eq('+ index + ')').removeClass('active').siblings().removeClass('inactive');
    });

    //search
    function showSearch() {
        hideGnbSubMenu();
        $('#header #search').addClass('active');
        setTimeout(function(){
            $('form[name="search_form"] input[name="query"]').focus();
        }, 1200);
        /*var searchBoxHeight = $('#header #search .search-box').innerHeight();
        if ( $(window).scrollTop() < searchBoxHeight ) {
            $('html,body').stop().animate({'scrollTop': searchBoxHeight}, 600, 'easeOutQuint');
        }*/

        $('#header .search .btn-close').show();
        $('#header .search .btn-close').css('opacity', '1');
        $('#header .search .btn-search').hide();
    }

    function hideSearch() {
        $('#header #search').removeClass('active');
        $('#header .search .btn-close').hide();
        $('#header .search .btn-search').show();
        $('form[name="search_form"] input[name="query"]').val('');
    }
    $('#header .btn-search').on('click', function(e){
        e.preventDefault();
        showSearch();

    });

    $('#header #search').on('click', function(e){
        if (!$(e.target).closest('.search-box')[0]) {
            hideSearch();
        }
    });

    $('form[name="search_form"] input[name="query"]').on('keydown keyup', function(){
        var val = $(this).val();
        if ( val != '') {
            $('#header #search form button').addClass('active');
        } else {
            $('#header #search form button').removeClass('active');
        }
    });

    $('#header .search .btn-close').on('click', function(e){
        e.preventDefault();
        hideSearch();
    });
    $('#header .search .btn-close').hide();

    

    /* resize */
    $(window).on('resize', function(){
        if ($('body').hasClass('loaded') == false) return;
        onResize();
    }).trigger('resize');

    function onResize() {
        var windowHeight = $(window).innerHeight();
        var homeSliderMinHeight = parseInt($('.home-slider').css('min-height'));
        var sliderHeight = (homeSliderMinHeight > 0) ? Math.max(homeSliderMinHeight, windowHeight) : windowHeight;

        if($("#BAND_BANNER").length > 0){
            sliderHeight -= $("#BAND_BANNER").height();
        }

       
        $('.home-slider').height(sliderHeight);
        $('.home-slider-item').height(sliderHeight);
    }




});



/** COMMON */
var CommonJs = (function() {
    var g_fHashIdx = 0,
    
        g_$gnbDepth2 = $('#gnbSubMenus'),
   
        g_headerHeight = g_$header.height(),
        g_prevSt = 0,
        g_isWheel = false,
        g_isWheelUp = false,
        _lang;

    function init() {
        gnbActive();
        addEvents();
        loadCheckHash();
        if ($('#SUB_KEYVISUAL').length > 0) {
            motionKV();
        }
    }

    function addEvents() {
        if(!GlobalData.isMain){
            $(window).scroll(scroll);
            scroll();

            $('html, body').on('mousewheel DOMMouseScroll', wheel);
        }


        /* 3,4depth center, active */
        if ($('.gu_tab_depth3').length > 0) centerTab($('.gu_tab_depth3'));

        if ($('.gu_tab_depth4').length > 0) {
            /* mobile - scrollbar hide */
            if (isMobile() === true) $('.gu_tab_depth4').addClass('mobile');

            /* tab click */
            $('.gu_tab_depth4 ul li a').on('click',function() {
                g_fHashIdx = $(this).parent('li').index();
                tabActive(g_fHashIdx);
                setScrollIcon();
            });
        }


        // pc / mobile �대�吏� 遺꾧린
        // ex) <img class="gu_img" src="../img.jpg" alt="" data-tablet="../t_img.jpg" data-mobile="../m_img.jpg">
        $(".gu_img").each(function() {
            if (Modernizr.mq('all and (max-width: 767px)')) {
                $(this).attr("src", $(this).attr("data-mobile"));
            } else if (Modernizr.mq('all and (max-width: 1080px)')) {
                $(this).attr("src", $(this).attr("data-tablet"));
            }
        });


        // gnb search
        $(g_$searchInput).on('keydown', function(e){
            if(e.keyCode == 13){
                e.preventDefault();
                searchGnb('web');
            }
        });

        g_$searchBtn.on('click',function(e){
            e.preventDefault();
            searchGnb('web');
        });

        $(g_$searchInputMobile).on('keydown', function(e){
            if(e.keyCode == 13){
                e.preventDefault();
                searchGnb('mobile');
            }
        });

        g_$searchBtnMobile.on('click',function(e){
            e.preventDefault();
            searchGnb('mobile');
        });

    }

    function scroll(){
        var m_st = $(window).scrollTop();

        if(!g_isWheel) g_isWheelUp = false;

        if(m_st > g_headerHeight){
            g_$header.addClass("small");
            g_$header.find(".gnb-sub-menu.on").addClass("active");

            if(!g_isWheelUp && m_st < g_prevSt) g_isWheelUp = true;
            if(g_isWheelUp) g_$header.removeClass("small").addClass("up");
        }else{
            g_$header.removeClass("small").removeClass("up");
            g_$header.find(".gnb-sub-menu.on").removeClass("active");
        }

        g_prevSt = m_st;
    }

    function wheel(e){
        var m_event = e.originalEvent,
            m_delta = 0;

        g_isWheel = true;

        if (m_event.detail) m_delta = m_event.detail * -40;
        else m_delta = m_event.wheelDelta;

        if(m_delta > 0) g_isWheelUp = true;
        else g_isWheelUp = false;
    }

    function getLocale() {
        _lang = $('html').attr('lang');

        switch(_lang) {
            case "ko" : _lang = "kr"; break;
            case "zh" : _lang = "cn"; break;
            default   : _lang = "en";
        }

        return _lang;
    }


    function tabActive(_idx) {
        $('.gu_tab_depth4 ul li').removeClass('on');
        $('.gu_tab_depth4 ul li').eq(_idx).addClass('on');
        $('.gu_contents_depth4').removeClass('on');
        $('.gu_contents_depth4').eq(_idx).addClass('on');

        centerTab($('.gu_tab_depth4'));
    }

    function gnbActive() {
        var m_$container = $(".container"),
            m_classStr = m_$container.attr("class"),
            m_className = m_classStr.split(" ")[1],
            m_bnavi = false;

        if(m_className) {
            m_bnavi = true;
        }

        if(m_bnavi) {
            g_$gnbDepth1.find('li').removeClass('on');
            g_$gnbDepth2.find('li > ul.sub-menu li').removeClass('on');

            var fixDepthArr = m_className.split('_');

            if(fixDepthArr[0]=='subNavi') {
                $('.naviDepth1_'+fixDepthArr[1]).addClass('on');
                $('.naviDepth1_'+fixDepthArr[1]).addClass('on');
                $('.naviDepth2_'+fixDepthArr[1]+'_'+fixDepthArr[2]).addClass('on');
                centerTab($('.gnb-sub-menu.naviDepth1_' + fixDepthArr[1]));
            }
        }
    }

    function centerTab(_tab) {
        var scrollX = _tab.find("ul").scrollLeft(),
            currentBtn = _tab.find("ul>li.on"),
            currentX = currentBtn.offset().left,
            currentW = currentBtn.width(),
            posx = scrollX+currentX,
            halfW = ($(window).width() - currentW) / 2 + 13;

        TweenMax.to(_tab.find("ul"), 0.7, {scrollLeft: posx - halfW, ease: Expo.easeOut});
    }


    function setScrollIcon() {
        $(window).off('scroll.table');
        if (!$('.gu_table.scrollX:visible').length) return;
        if (!$('.gu_ico_drag').length) {
            var dom = '<div class="gu_ico_drag active">' +
                      '   <img src="/img/common/ico_drag.png">' +
                      '</div>';
            $('.gu_table.scrollX').eq(0).append(dom);
        } else {
            $('.gu_ico_drag').addClass('active');
        }
        removeScrollIcon();
    }


})();
