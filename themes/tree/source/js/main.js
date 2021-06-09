/**
 * created by lvfan
 * 2018-09-04
 */


 function drawBg() {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  const starDensity = 0.216;
  const speedCoeff = 0.05;
  let width;
  let height;
  let starCount;
  /* no-unused-vars */
  // let circleRadius;
  // let circleCenter;
  let first = true;
  let giantColor = '180,184,240';
  let starColor = '226,225,142';
  let cometColor = '226,225,224';
  const canva = document.getElementById('universe');
  let stars = [];
  let universe;
  windowResizeHandler();
  window.addEventListener('resize', windowResizeHandler, false);

  function windowResizeHandler() {
      width = window.innerWidth;
      height = window.innerHeight;
      starCount = width * starDensity;
      // circleRadius = (width > height ? height / 2 : width / 2);
      // circleCenter = {
      //   x: width / 2,
      //   y: height / 2
      // };
      canva.setAttribute('width', width);
      canva.setAttribute('height', height);
  }

  createUniverse();

  function createUniverse() {
      universe = canva.getContext('2d');
      for (let i = 0; i < starCount; i++) {
          stars[i] = new Star();
          stars[i].reset();
      }
      draw();
  }

  function draw() {
      universe.clearRect(0, 0, width, height);
      let starsLength = stars.length;
      for (let i = 0; i < starsLength; i++) {
          let star = stars[i];
          star.move();
          star.fadeIn();
          star.fadeOut();
          star.draw();
      }
      window.requestAnimationFrame(draw);
  }

  function Star() {
      this.reset = function () {
          this.giant = getProbability(3);
          this.comet = this.giant || first ? false : getProbability(10);
          this.x = getRandInterval(0, width - 10);
          this.y = getRandInterval(0, height);
          this.r = getRandInterval(1.1, 2.6);
          this.dx = getRandInterval(speedCoeff, 6 * speedCoeff) + (this.comet + 1 - 1) * speedCoeff * getRandInterval(50, 120) + speedCoeff * 2;
          this.dy = -getRandInterval(speedCoeff, 6 * speedCoeff) - (this.comet + 1 - 1) * speedCoeff * getRandInterval(50, 120);
          this.fadingOut = null;
          this.fadingIn = true;
          this.opacity = 0;
          this.opacityTresh = getRandInterval(0.2, 1 - (this.comet + 1 - 1) * 0.4);
          this.do = getRandInterval(0.0005, 0.002) + (this.comet + 1 - 1) * 0.001;
      };
      this.fadeIn = function () {
          if (this.fadingIn) {
              this.fadingIn = !(this.opacity > this.opacityTresh);
              this.opacity += this.do;
          }
      };
      this.fadeOut = function () {
          if (this.fadingOut) {
              this.fadingOut = !(this.opacity < 0);
              this.opacity -= this.do / 2;
              if (this.x > width || this.y < 0) {
                  this.fadingOut = false;
                  this.reset();
              }
          }
      };
      this.draw = function () {
          universe.beginPath();
          if (this.giant) {
              universe.fillStyle = 'rgba(' + giantColor + ',' + this.opacity + ')';
              universe.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
          } else if (this.comet) {
              universe.fillStyle = 'rgba(' + cometColor + ',' + this.opacity + ')';
              universe.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, false);
              // comet tail
              for (let i = 0; i < 30; i++) {
                  universe.fillStyle = 'rgba(' + cometColor + ',' + (this.opacity - (this.opacity / 20) * i) + ')';
                  universe.rect(this.x - this.dx / 4 * i, this.y - this.dy / 4 * i - 2, 2, 2);
                  universe.fill();
              }
          } else {
              universe.fillStyle = 'rgba(' + starColor + ',' + this.opacity + ')';
              universe.rect(this.x, this.y, this.r, this.r);
          }
          universe.closePath();
          universe.fill();
      };
      this.move = function () {
          this.x += this.dx;
          this.y += this.dy;
          if (this.fadingOut === false) {
              this.reset();
          }
          if (this.x > width - (width / 4) || this.y < 0) {
              this.fadingOut = true;
          }
      };
      (function () {
          setTimeout(function () {
              first = false;
          }, 50);
      })();
  }

  function getProbability(percents) {
      return ((Math.floor(Math.random() * 1000) + 1) < percents * 10);
  }

  function getRandInterval(min, max) {
      return (Math.random() * (max - min) + min);
  }
}

$(document).ready(function () {
  drawBg()
  hljs.initHighlightingOnLoad();
  clickTreeDirectory();
  serachTree();
  pjaxLoad();
  showArticleIndex();
  switchTreeOrIndex();
  scrollToTop();

  wrapImageWithFancyBox();
  $("body").mCustomScrollbar({scrollInertia:100,mouseWheel:{ scrollAmount:100 },
    callbacks:{
      whileScrolling:function(e){
       
        pageScroll()
        var anchorList = $(".anchor");
       
        anchorList.each(function () {
          var tocLink = $('.article-toc a[href="#' + $(this).attr("id") + '"]');
          var anchorTop = $(this).offset().top;
          var windowTop = Math.abs($('#mCSB_1_container').offset().top) ;
    
          if (anchorTop <= 100) {
            tocLink.addClass("read");
            
          } else {
            tocLink.removeClass("read");
          }
       
        });
       if($('.read').length){
         $('#tree').mCustomScrollbar('scrollTo', '.'+ $('.read')[$('.read').length-1].classList[0], {
           scrollInertia: 500
       });
       }

      
      },
     
  }
  });
  $("#tree").mCustomScrollbar();
});


// 页面滚动
var start_hight = 0;
function pageScroll() {
 
    var end_hight =  $('#mCSB_1_dragger_vertical').offset().top ;
    var distance = end_hight - start_hight;
    start_hight = end_hight;
    var $header = $('#header');
    if (distance > 0 && end_hight > 50) {
      $header.hide();
    } else if (distance < 0) {
      $header.show();
    } else {
      return false;
    } 
}

// 回到顶部
function scrollToTop() {
  $("#totop-toggle").on("click", function (e) {
      $('body').mCustomScrollbar('scrollTo', 'top', {
        scrollInertia: 1000,
        scrollEasing: 'easeInOut'
    });
  });
}

// 侧面目录
function switchTreeOrIndex() {
  $('#sidebar-toggle').on('click', function () {
    if ($('#sidebar').hasClass('on')) {
      scrollOff();
    } else {
      scrollOn();
    }
  });
  $('body').click(function (e) {
    if (window.matchMedia("(max-width: 1100px)").matches) {
      var target = $(e.target);
      if (!target.is('#sidebar *')) {
        if ($('#sidebar').hasClass('on')) {
          scrollOff();
        }
      }
    }
  });
  if (window.matchMedia("(min-width: 1100px)").matches) {
    scrollOn();
  } else {
    scrollOff();
  }
  ;
}

//生成文章目录
function showArticleIndex() {
  $(".article-toc").empty();
  $(".article-toc").hide();
  $(".article-toc.active-toc").removeClass("active-toc");
  $("#tree .active").next().addClass('active-toc');

  var labelList = $("#article-content").children();
  var content = "<ul>";
  var max_level = 4;
  for (var i = 0; i < labelList.length; i++) {
    var level = 5;
    if ($(labelList[i]).is("h1")) {
      level = 1;
    } else if ($(labelList[i]).is("h2")) {
      level = 2;
    } else if ($(labelList[i]).is("h3")) {
      level = 3;
    } else if ($(labelList[i]).is("h4")) {
      level = 4;
    }
    if (level < max_level) {
      max_level = level;
    }
  }
  for (var i = 0; i < labelList.length; i++) {
    var level = 0;
    if ($(labelList[i]).is("h1")) {
      level = 1 - max_level + 1;
    } else if ($(labelList[i]).is("h2")) {
      level = 2 - max_level + 1;
    } else if ($(labelList[i]).is("h3")) {
      level = 3 - max_level + 1;
    } else if ($(labelList[i]).is("h4")) {
      level = 4 - max_level + 1;
    }
    if (level != 0) {
      $(labelList[i]).before(
          '<span class="anchor" id="_label' + i + '"></span>');
      content += '<li class="level_' + level
          + '"><i class="fa fa-circle" aria-hidden="true"></i><a href="#_label'
          + i + '" class="label'
          + i + '"> ' + $(labelList[i]).text() + '</a></li>';
    }
  }
  content += "</ul>"

  $(".article-toc.active-toc").append(content);

  if (null != $(".article-toc a") && 0 != $(".article-toc a").length) {

    // 点击目录索引链接，动画跳转过去，不是默认闪现过去
    $(".article-toc a").on("click", function (e) {
      e.preventDefault();
      // 获取当前点击的 a 标签，并前触发滚动动画往对应的位置
      var target = $(this.hash);
      let _id = $(this).attr('href');
      $('body').mCustomScrollbar('scrollTo', _id, {
          scrollInertia: 500
      });
    });
    // $("body").mCustomScrollbar()

  }
  $(".article-toc.active-toc").show();
  $(".article-toc.active-toc").children().show();
}

function pjaxLoad() {
  $(document).pjax('#menu a', '#content',
      {fragment: '#content', timeout: 8000});
  $(document).pjax('#tree a', '#content',
      {fragment: '#content', timeout: 8000});
  $(document).pjax('#index a', '#content',
      {fragment: '#content', timeout: 8000});
  $(document).on({
    "pjax:complete": function (e) {
      $("pre code").each(function (i, block) {
        hljs.highlightBlock(block);
      });
      // 添加 active
      $("#tree .active").removeClass("active");
      var title = $("#article-title").text().trim();
      if (title.length) {
        var searchResult = $("#tree li.file").find(
            "a:contains('" + title + "')");
        if (searchResult.length) {
          $(".fa-minus-square-o").removeClass("fa-minus-square-o").addClass(
              "fa-plus-square-o");
          $("#tree ul").css("display", "none");
          if (searchResult.length > 1) {
            var categorie = $("#article-categories span:last a").html();
            if (typeof categorie != "undefined") {
              categorie = categorie.trim();
              searchResult = $("#tree li.directory a:contains('" + categorie
                  + "')").siblings().find("a:contains('" + title + "')");
            }
          }
          searchResult[0].parentNode.classList.add("active");
          showActiveTree($("#tree .active"), true)
        }
        showArticleIndex();
      }
      wrapImageWithFancyBox();
    }
  });
}

// 搜索框输入事件
function serachTree() {
  // 解决搜索大小写问题
  jQuery.expr[':'].contains = function (a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
  };

  $("#search-input").on("input", function (e) {
    e.preventDefault();

    // 获取 inpiut 输入框的内容
    var inputContent = e.currentTarget.value;

    // 没值就收起父目录，但是得把 active 的父目录都展开
    if (inputContent.length === 0) {
      $(".fa-minus-square-o").removeClass("fa-minus-square-o").addClass(
          "fa-plus-square-o");
      $("#tree ul").css("display", "none");
      if ($("#tree .active").length) {
        showActiveTree($("#tree .active"), true);
      } else {
        $("#tree").children().css("display", "block");
      }
    }
    // 有值就搜索，并且展开父目录
    else {
      $(".fa-plus-square-o").removeClass("fa-plus-square-o").addClass(
          "fa-minus-square-o");
      $("#tree ul").css("display", "none");
      var searchResult = $("#tree li").find(
          "a:contains('" + inputContent + "')");
      if (searchResult.length) {
        showActiveTree(searchResult.parent(), false)
      }
    }
  });

  $("#search-input").on("keyup", function (e) {
    e.preventDefault();
    if (event.keyCode == 13) {
      var inputContent = e.currentTarget.value;

      if (inputContent.length === 0) {
      } else {
        window.open(searchEngine + inputContent + "%20site:" + homeHost,
            "_blank");
      }
    }
  });
}

// 点击目录事件
function clickTreeDirectory() {
  // 判断有 active 的话，就递归循环把它的父目录打开
  var treeActive = $("#tree .active");
  if (treeActive.length) {
    showActiveTree(treeActive, true);
  }

  // 点击目录，就触发折叠动画效果
  $(document).on("click", "#tree a[class='directory']", function (e) {
    // 用来清空所有绑定的其他事件
    e.preventDefault();

    var icon = $(this).children(".fa");
    var iconIsOpen = icon.hasClass("fa-minus-square-o");
    var subTree = $(this).siblings("ul");

    icon.removeClass("fa-minus-square-o").removeClass("fa-plus-square-o");

    if (iconIsOpen) {
      if (typeof subTree != "undefined") {
        subTree.slideUp({duration: 100});
      }
      icon.addClass("fa-plus-square-o");
    } else {
      if (typeof subTree != "undefined") {
        subTree.slideDown({duration: 100});
      }
      icon.addClass("fa-minus-square-o");
    }
  });
}

// 循环递归展开父节点
function showActiveTree(jqNode, isSiblings) {
  if (jqNode.attr("id") === "tree") {
    return;
  }
  if (jqNode.is("ul")) {
    jqNode.css("display", "block");

    // 这个 isSiblings 是给搜索用的
    // true 就显示开同级兄弟节点
    // false 就是给搜索用的，值需要展示它自己就好了，不展示兄弟节点
    if (isSiblings) {
      jqNode.siblings().css("display", "block");
      jqNode.siblings("a").css("display", "inline");
      jqNode.siblings("a").find(".fa-plus-square-o").removeClass(
          "fa-plus-square-o").addClass("fa-minus-square-o");
    }
  }
  jqNode.each(function () {
    showActiveTree($(this).parent(), isSiblings);
  });
}

function scrollOn() {
  var $sidebar = $('#sidebar'),
      $content = $('#content'),
      $contentBox = $('#content-box'),
      $header = $('#header'),
      $footer = $('#footer'),
      $togglei = $('#sidebar-toggle i');

  $togglei.addClass('fa-close');
  $togglei.removeClass('fa-arrow-right');
  $sidebar.addClass('on');
  $sidebar.removeClass('off');

  if (window.matchMedia("(min-width: 1100px)").matches) {
    $contentBox.addClass('content-on');
    $contentBox.removeClass('content-off');
    $header.addClass('header-on');
    $header.removeClass('off');
    $footer.addClass('header-on');
    $footer.removeClass('off');
  }
}

function scrollOff() {
  var $sidebar = $('#sidebar'),
      $content = $('#content'),
      $contentBox = $('#content-box'),
      $header = $('#header'),
      $footer = $('#footer'),
      $togglei = $('#sidebar-toggle i');

  $togglei.addClass('fa-arrow-right');
  $togglei.removeClass('fa-close');
  $sidebar.addClass('off');
  $sidebar.removeClass('on');

  $contentBox.addClass('off');
  $contentBox.removeClass('content-on');
  $header.addClass('off');
  $header.removeClass('header-on');
  $footer.addClass('off');
  $footer.removeClass('header-on');
}

/**
 * Wrap images with fancybox support.
 */
function wrapImageWithFancyBox() {
  $('img').not('#header img').each(function () {
    var $image = $(this);
    var imageCaption = $image.attr('alt');
    var $imageWrapLink = $image.parent('a');

    if ($imageWrapLink.length < 1) {
      var src = this.getAttribute('src');
      var idx = src.lastIndexOf('?');
      if (idx != -1) {
        src = src.substring(0, idx);
      }
      $imageWrapLink = $image.wrap('<a href="' + src + '"></a>').parent('a');
    }

    $imageWrapLink.attr('data-fancybox', 'images');
    if (imageCaption) {
      $imageWrapLink.attr('data-caption', imageCaption);
    }

  });

  $('[data-fancybox="images"]').fancybox({
    buttons: [
      'slideShow',
      'thumbs',
      'zoom',
      'fullScreen',
      'close'
    ],
    thumbs: {
      autoStart: false
    }
  });
}