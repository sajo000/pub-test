
// 넘쳤을때 딤처리 되는거
$(function () {
  const $slider = $('.slider-outer');
  const $inner = $slider.find('.slider-inner');
  const $slides = $inner.find('.slide-item');

  // viewWidth를 슬라이더 컨테이너 너비로 동적으로 가져오기
  let viewWidth = $slider.width();
  let slideWidth = $slides.outerWidth(true);
  let totalWidth = slideWidth * $slides.length;
  let scrollPos = 0;

  function updateNav() {
    if (scrollPos > 0) {
      $slider.find('.slider-btn.left').show();
      $slider.find('.slider-dim.left').show();
    } else {
      $slider.find('.slider-btn.left').hide();
      $slider.find('.slider-dim.left').hide();
    }
    if (scrollPos < totalWidth - viewWidth) {
      $slider.find('.slider-btn.right').show();
      $slider.find('.slider-dim.right').show();
    } else {
      $slider.find('.slider-btn.right').hide();
      $slider.find('.slider-dim.right').hide();
    }
  }

  $slider.find('.slider-btn.left').on('click', function () {
    scrollPos = Math.max(0, scrollPos - viewWidth);
    $inner.css('transform', 'translateX(-' + scrollPos + 'px)');
    updateNav();
  });

  $slider.find('.slider-btn.right').on('click', function () {
    scrollPos = Math.min(totalWidth - viewWidth, scrollPos + viewWidth);
    $inner.css('transform', 'translateX(-' + scrollPos + 'px)');
    updateNav();
  });

  function resize() {
    viewWidth = $slider.width();  // 컨테이너 너비 동기화
    slideWidth = $slides.outerWidth(true);
    totalWidth = slideWidth * $slides.length;
    if (scrollPos > totalWidth - viewWidth) {
      scrollPos = Math.max(0,
          totalWidth - viewWidth);
    }
    $inner.css('transform', 'translateX(-' + scrollPos + 'px)');
    updateNav();
  }

  resize();

  // 창 리사이즈 시 자동으로 넓이 재계산
  $(window).on('resize', resize);
});

// 테이블 딤처리
$(function () {
  $('.table-container').each(function () {
    const $container = $(this);
    const $wrap = $container.find('.my-table-wrap');
    const $fadeLeft = $container.find('.my-table-fade-left');
    const $fadeRight = $container.find('.my-table-fade-right');

    function updateFade() {
      const scrollLeft = $wrap.scrollLeft();
      const scrollWidth = $wrap[0].scrollWidth;
      const clientWidth = $wrap.width();

      // 스크롤 안 생기는 경우: fade 모두 숨김
      if (scrollWidth <= clientWidth) {
        $fadeLeft.removeClass('show');
        $fadeRight.removeClass('show');
        return;
      }

      // 스크롤 생기면 기존 조건대로 fade 처리
      if (scrollLeft > 0) {
        $fadeLeft.addClass('show');
      } else {
        $fadeLeft.removeClass('show');
      }

      if (scrollLeft + clientWidth < scrollWidth - 1) {
        $fadeRight.addClass('show');
      } else {
        $fadeRight.removeClass('show');
      }
    }

    updateFade();
    $wrap.on('scroll', updateFade);
    $(window).on('resize', updateFade);
  });
});

// 드롭다운, 다중선택 셀렉트 테스트
$(function () {
// 드롭다운 토글
  $(".multi-select-wrap").on("click", function (e) {
    $("#multiSelectDropdown").toggleClass("d-none");
    e.stopPropagation();
  });

// 옵션 선택/해제
  var selected = [];

  $(".multi-option").on("click", function (e) {
    var val = $(this).data("value");
    if (val === "전체") {
      selected = ["전체"];
      $(".multi-option").removeClass("selected");
      $(".check-mark").addClass("d-none");
      $(this).addClass("selected").find(".check-mark").removeClass("d-none");
    } else {
      if (selected.includes("전체")) {
        selected = [];
        $(".multi-option[data-value='전체']").removeClass("selected").find(
            ".check-mark").addClass("d-none");
      }
      // 토글
      if (selected.includes(val)) {
        selected = selected.filter(v => v !== val);
        $(this).removeClass("selected").find(".check-mark").addClass("d-none");
      } else {
        selected.push(val);
        $(this).addClass("selected").find(".check-mark").removeClass("d-none");
      }
    }
    // "전체" 외에 아무것도 선택 안됐을 때 전체 체크 해제
    if (selected.length === 0) {
      selected = ["선택"];
      $(".multi-option[data-value='전체']").addClass("selected").find(
          ".check-mark").removeClass("d-none");
    }

    // 표시영역 업데이트
    let disp = selected.join(",");
    $("#multiSelectDisplay").text(
        disp.length > 25 ? disp.slice(0, 23) + "..." : disp);
    e.stopPropagation();
  });

// 외부 클릭 시 닫기
  $(document).on("click", function () {
    $("#multiSelectDropdown").addClass("d-none");
  });
});

// 모든 data-bs-toggle="tooltip" 속성을 가진 요소에 툴팁 활성화
$(function () {
  const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  });
});

// datepicker
$(function () {
  const elem = document.getElementById('myDatepicker');
  const datepicker = new Datepicker(elem, {
    buttonClass: 'btn', // Ensures buttons are styled with Bootstrap's 'btn' class
    autohide: true,// 날짜 선택 후 자동 닫힘
    format: 'yyyy-mm-dd',     // 날짜 포맷 지정
    todayHighlight: true, //오늘 날짜에 하이라이팅 기능 기본값 :false
    // Add other options as needed (e.g., format, minDate, maxDate)
  });
});