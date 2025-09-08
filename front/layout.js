// * 사이드메뉴 열기
$(document).ready(function () {
  $('.menu').on('click', function () {
    $('.container-wrap').toggleClass('toggle-opened');
    $('.nav-wrap').toggleClass('opened');
  });
});


// * 사이드메뉴 동작처리
$(document).ready(function() {
  // 기본 .deps2 숨김 처리 (필요시)
  $('.deps2').hide();

  $('.deps1-link.multiple').click(function(e) {
    e.preventDefault();

    const $arrowIcon = $(this).find('.deps1-icon-arrow');
    const $subMenu = $(this).next('.deps2');

    // 토글 하위 메뉴 표시
    $subMenu.slideToggle(200);

    // 아이콘 토글 클래스
    if ($arrowIcon.hasClass('icon-arrow-bottom')) {
      $arrowIcon.removeClass('icon-arrow-bottom').addClass('icon-arrow-top');
    } else {
      $arrowIcon.removeClass('icon-arrow-top').addClass('icon-arrow-bottom');
    }
  });

  $('.deps2-link').click(function(e) {
    e.preventDefault();

    // 모든 활성화 초기화
    $('.deps1-link.active').removeClass('active');
    $('.deps2-link.active').removeClass('active');

    // 클릭한 deps2-link 활성화
    $(this).addClass('active');

    // 클릭한 deps2-link의 조상 deps2 바로 이전 형제 deps1-link에 active 추가
    const $deps2 = $(this).closest('.deps2');
    const $deps1Link = $deps2.prev('.deps1-link');
    if ($deps1Link.length) {
      $deps1Link.addClass('active');

      // 하위 메뉴가 닫혀있으면 열기 & 아이콘 토글
      if (!$deps2.is(':visible')) {
        $deps2.slideDown(200);
        const $arrowIcon = $deps1Link.find('.deps1-icon-arrow');
        $arrowIcon.removeClass('icon-arrow-bottom').addClass('icon-arrow-top');
      }
    }
  });

  // 만약 deps1-link.single 클릭 시 활성화 상태를 변경하려면 아래 추가 가능
  $('.deps1-link.single').click(function(e) {
    e.preventDefault();

    // 기존 활성화 모두 제거
    $('.deps1-link.active').removeClass('active');
    $('.deps2-link.active').removeClass('active');

    $(this).addClass('active');
  });
});


// * 사이드메뉴에서 메뉴 클릭했을때 탭 쌓이면서 컨텐츠 화면 전환
$(function () {
  $('.deps1-link').on('click', function (e) {
    e.preventDefault();

    const menuName = $(this).text().trim();
    const menuUrl = $(this).data('url');
    const tabId = 'tab-' + menuName.replace(/\s+/g, '-').toLowerCase();

    const $existingTab = $('#' + tabId);
    if ($existingTab.length) {
      $('.header-tab .nav-link').removeClass('active');
      $existingTab.addClass('active');
      loadContent($existingTab.data('url'));
      return;
    }

    const $newTab = $(`
      <li class="nav-item">
        <a class="nav-link active d-flex align-items-center" id="${tabId}" href="#" data-url="${menuUrl}">
          ${menuName}
          <button type="button" class="btn-close ms-2" aria-label="Close"></button>
        </a>
      </li>
    `);

    $('.header-tab .nav-link').removeClass('active');
    $('.header-tab').append($newTab);

    loadContent(menuUrl);

    $newTab.find('.nav-link').on('click', function (e) {
      e.preventDefault();
      $('.header-tab .nav-link').removeClass('active');
      $(this).addClass('active');
      loadContent($(this).data('url'));
    });

    $newTab.find('.btn-close').on('click', function (e) {
      e.stopPropagation();
      const $tab = $(this).closest('.nav-link');
      const wasActive = $tab.hasClass('active');
      const $li = $(this).closest('li');
      $li.remove();

      if (wasActive) {
        const $first = $('.header-tab .nav-link').first();
        if ($first.length) {
          $first.addClass('active');
          loadContent($first.data('url'));
        } else {
          $('.iframe-content').html(
              '<div class="p-3 text-muted">화면을 선택해주세요</div>');
        }
      }
    });
  });

  $('.header-tab .nav-link').on('click', function (e) {
    e.preventDefault();
    $('.header-tab .nav-link').removeClass('active');
    $(this).addClass('active');
    loadContent($(this).data('url'));
  });

  // ✅ HTML을 Ajax로 로딩하는 함수
  function loadContent(url) {
    if (!url || url === 'undefined') {
      $('.iframe-content').html('<div class="p-3 text-muted">화면을 선택해주세요</div>');
      return;
    }

    $.get(url)
    .done(function (html) {
      $('.iframe-content').html(html);
    })
    .fail(function () {
      $('.iframe-content').html(
          '<div class="p-3 text-danger">화면을 불러오는데 실패했어요😢</div>');
    });
  }

  // ✅ 초기 화면 로딩
  loadContent($('.deps1-link').first().data('url'));
});


// * 헤더 스크롤러블 탭메뉴
$(function() {
  let tabIdx = 1;

  function updateArrows() {
    const $wrap = $('.tab-scroll-wrap');
    const $ul = $('.tab-list');
    const scrollLeft = $wrap.scrollLeft();
    const maxScroll = $wrap[0].scrollWidth - $wrap.width(); // scrollWidth로 변경

    $('.scroll-arrow.left').toggle(scrollLeft > 0);
    $('.scroll-arrow.right').toggle(scrollLeft < maxScroll - 1 && maxScroll > 0);
  }

  // 탭 추가 버튼
  $('#addTabBtn').on('click', function() {
    const tabTitle = '탭' + tabIdx++;
    const $li = $(`
      <li class="nav-item">
        <a class="nav-link${$('.tab-list .nav-link').length ? '' : ' active'}" href="#">
          ${tabTitle}<button class="tab-close-btn" title="닫기">&times;</button>
        </a>
      </li>
    `);
    $('.tab-list').append($li);
    if($('.tab-list .nav-link.active').length === 0){
      $li.find('.nav-link').addClass('active');
    }
    // requestAnimationFrame 사용해 렌더링 후 updateArrows 호출
    requestAnimationFrame(updateArrows);
  });

  // 탭 닫기
  $('.tab-list').on('click', '.tab-close-btn', function(e){
    e.stopPropagation();
    const $tab = $(this).closest('.nav-item');
    const isActive = $tab.find('.nav-link').hasClass('active');
    $tab.remove();
    if(isActive){
      $('.tab-list .nav-link').removeClass('active').eq(0).addClass('active');
    }
    updateArrows();
  });

  // 탭 클릭시 active
  $('.tab-list').on('click', '.nav-link', function(e){
    e.preventDefault();
    $('.tab-list .nav-link').removeClass('active');
    $(this).addClass('active');
  });

  // 스크롤 감지
  $('.tab-scroll-wrap').on('scroll', updateArrows);

  // 화살표 클릭
  $('.scroll-arrow.left').on('click', function(){
    $('.tab-scroll-wrap').animate({scrollLeft: '-=200'}, 200, updateArrows);
  });
  $('.scroll-arrow.right').on('click', function(){
    $('.tab-scroll-wrap').animate({scrollLeft: '+=200'}, 200, updateArrows);
  });

  $(window).on('resize', updateArrows);

  // 초기 탭 3개 추가
  $('#addTabBtn').trigger('click').trigger('click').trigger('click');
});


// $(function() {
//   let tabIdx = 1;
//
//   function updateArrows() {
//     const $wrap = $('.tab-scroll-wrap');
//     const $ul = $('.tab-list');
//     const scrollLeft = $wrap.scrollLeft();
//     const maxScroll = $ul.width() - $wrap.width();
//     $('.scroll-arrow.left').toggle(scrollLeft > 0);
//     $('.scroll-arrow.right').toggle(scrollLeft < maxScroll - 1);
//   }
//
//   // 탭 추가 버튼
//   $('#addTabBtn').on('click', function() {
//     const tabTitle = '탭' + tabIdx++;
//     const $li = $(`
//       <li class="nav-item">
//         <a class="nav-link${$('.tab-list .nav-link').length ? '' : ' active'}" href="#">
//           ${tabTitle}<button class="tab-close-btn" title="닫기">&times;</button>
//         </a>
//       </li>
//     `);
//     $('.tab-list').append($li);
//     if($('.tab-list .nav-link.active').length === 0){
//       $li.find('.nav-link').addClass('active');
//     }
//     setTimeout(updateArrows, 10);
//   });
//
//   // 탭 닫기
//   $('.tab-list').on('click', '.tab-close-btn', function(e){
//     e.stopPropagation();
//     const $tab = $(this).closest('.nav-item');
//     const isActive = $tab.find('.nav-link').hasClass('active');
//     $tab.remove();
//     // 삭제 후 오른쪽탭이나 왼쪽탭에 active
//     if(isActive){
//       $('.tab-list .nav-link').removeClass('active').eq(0).addClass('active');
//     }
//     updateArrows();
//   });
//
//   // 탭 클릭시 active
//   $('.tab-list').on('click', '.nav-link', function(e){
//     e.preventDefault();
//     $('.tab-list .nav-link').removeClass('active');
//     $(this).addClass('active');
//   });
//
//   // 스크롤 감지
//   $('.tab-scroll-wrap').on('scroll', updateArrows);
//
//   // 화살표 클릭
//   $('.scroll-arrow.left').on('click', function(){
//     $('.tab-scroll-wrap').animate({scrollLeft: '-=200'}, 200, updateArrows);
//   });
//   $('.scroll-arrow.right').on('click', function(){
//     $('.tab-scroll-wrap').animate({scrollLeft: '+=200'}, 200, updateArrows);
//   });
//
//   $(window).on('resize', updateArrows);
//
//   // 초기 탭 3개
//   $('#addTabBtn').trigger('click').trigger('click').trigger('click');
// });
