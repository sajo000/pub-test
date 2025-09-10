
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
  // startDate 데이트피커 초기화
  const $startInput = $('#startDate');
  $startInput.datepicker({
    format: 'yyyy-mm-dd',
    todayHighlight: true,
    autoclose: true
  }).on('show', function () {
    // 데이트피커가 보일 때 좌우 화살표 변경
    $('.datepicker .prev').html('<i class="icon is-16 icon-arrow-left bg-black"></i>');
    $('.datepicker .next').html('<i class="icon is-16 icon-arrow-right bg-black"></i>');

    // 데이트피커가 보일 때 헤더 순서 재배치
    $('.datepicker thead tr').each(function() {
      const $tr = $(this);
      const $prev = $tr.find('.prev').detach();
      const $switch = $tr.find('.datepicker-switch').detach();
      const $next = $tr.find('.next').detach();
      $tr.append($switch).append($prev).append($next);
    });
  });

  // endDate 데이트피커 초기화
  const $endInput = $('#endDate');
  $endInput.datepicker({
    format: 'yyyy-mm-dd',
    todayHighlight: true,
    autoclose: true
  }).on('show', function () {
    // 데이트피커가 보일 때 좌우 화살표 변경
    $('.datepicker .prev').html('<i class="icon is-16 icon-arrow-left bg-black"></i>');
    $('.datepicker .next').html('<i class="icon is-16 icon-arrow-right bg-black"></i>');

    // 데이트피커가 보일 때 헤더 순서 재배치
    $('.datepicker thead tr').each(function() {
      const $tr = $(this);
      const $prev = $tr.find('.prev').detach();
      const $switch = $tr.find('.datepicker-switch').detach();
      const $next = $tr.find('.next').detach();
      $tr.append($switch).append($prev).append($next);
    });
  });

  // startDate 아이콘 버튼 클릭 시 캘린더 열기
  $startInput.siblings('.form-group-append').find('button').on('click', function() {
    $startInput.datepicker('show');
  });

  // endDate 아이콘 버튼 클릭 시 캘린더 열기
  $endInput.siblings('.form-group-append').find('button').on('click', function() {
    $endInput.datepicker('show');
  });
});

// 다중셀렉트 select2
$(document).ready(function() {
  const $select = $('#goodsType');
  const allValue = 'all';

  $select.select2({
    theme: 'bootstrap-5',
    width: '100%',
    placeholder: '전체',
    closeOnSelect: false
  });

  let isSyncing = false; // 이벤트 중복 방지 플래그

  $select.on('select2:select select2:unselect', function(e) {
    if (isSyncing) return; // 리커시브 방지

    isSyncing = true;
    let values = $select.val() || [];

    if (e.params.data.id === allValue) {
      if (values.includes(allValue)) {
        // 전체 선택: 모든 옵션 선택
        const allOptions = $select.find('option').map(function() { return this.value; }).get();
        $select.val(allOptions).trigger('change');
      } else {
        // 전체 해제: 전체 선택 해제
        $select.val(null).trigger('change');
      }
    } else {
      const optionCount = $select.find('option').length - 1; // 전체 제외 옵션 수
      const allSelected = (values.length === optionCount);

      if (allSelected && !values.includes(allValue)) {
        // 모든 개별 옵션 선택 시 '전체' 옵션도 추가
        values.push(allValue);
        $select.val(values).trigger('change');
      }
      else if (!allSelected && values.includes(allValue)) {
        // 일부 해제 시 '전체' 옵션 제거
        values = values.filter(v => v !== allValue);
        $select.val(values).trigger('change');
      }
    }
    isSyncing = false;
  });
});


// $(document).ready(function() {
//   const $select = $('#goodsType');
//
//   $select.select2({
//     theme: 'bootstrap-5',
//     width: '100%',
//     placeholder: '전체',
//     closeOnSelect: false // 멀티 선택 시 드롭다운 닫히지 않게
//   });
//
//   $select.on('select2:select select2:unselect', function(e) {
//     const values = $select.val() || [];
//     const allValue = 'all';
//
//     if (e.params.data.id === allValue) {
//       if (values.includes(allValue)) {
//         // 전체 선택 → 모든 옵션 선택
//         $select.val($select.find('option').map(function() {
//           return this.value;
//         }).get()).trigger('change');
//       } else {
//         // 전체 해제 → 모두 해제
//         $select.val(null).trigger('change');
//       }
//     } else {
//       // 개별 선택 변경 시 전체 선택 상태 동기화
//       const optionCount = $select.find('option').length - 1; // 전체 제외 옵션 개수
//       const allSelected = (values.length === optionCount);
//
//       if (allSelected && !values.includes(allValue)) {
//         // 모든 옵션 선택된 상태면 전체 옵션 추가
//         $select.val(values.concat(allValue)).trigger('change');
//       } else if (!allSelected && values.includes(allValue)) {
//         // 전체 선택 되어 있지만 일부 옵션 해제된 경우 전체 선택 해제
//         $select.val(values.filter(v => v !== allValue)).trigger('change');
//       }
//     }
//   });
// });

// $(function() {
//   const $select = $('#goodsType');
//
//   $select.select2({
//     theme: 'bootstrap-5',
//     width: '100%',
//     placeholder: '전체',
//     closeOnSelect: false,
//     dropdownAutoWidth: true
//   });
//
//   // 전체 선택/해제 로직
//   $select.on('select2:select select2:unselect', function(e) {
//     const values = $select.val() || [];
//     if (e.params.data.id === 'all') {
//       if (values.includes('all')) {
//         // 전체 선택 → 모두 선택
//         $select.val(['all', 'normal', 'gift', 'sample', 'add', 'set']).trigger('change');
//       } else {
//         // 전체 해제 → 모두 해제
//         $select.val(null).trigger('change');
//       }
//     } else {
//       // 옵션 하나라도 해제 시 전체도 해제
//       if (values.length === 5 && !values.includes('all')) {
//         $select.val(['all', ...values]).trigger('change');
//       } else if (values.length < 6 && values.includes('all')) {
//         $select.val(values.filter(v => v !== 'all')).trigger('change');
//       }
//     }
//   });
// });

