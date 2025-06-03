document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll(".feedback-options input[type='checkbox']");
  
  document.getElementById("submit-review").addEventListener("click", () => {
    // 선택된 체크박스 값 수집
    const selectedOptions = [];
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selectedOptions.push(checkbox.value);
      }
    });
    
    if (selectedOptions.length === 0) {
      alert("최소 한 개 이상의 항목을 선택해주세요.");
      return;
    }
    
    // 여기서 부모창 함수 호출 + 팝업 닫기
    if (window.opener && typeof window.opener.completeReview === 'function') {
      window.opener.completeReview(selectedOptions); // 마이페이지 상태 갱신 (선택된 옵션 전달)
    }
    
    window.close(); // 팝업 닫기
  });
});