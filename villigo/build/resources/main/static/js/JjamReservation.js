document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM 로드 완료"); // 디버깅: DOM 로드 확인

  let userJelly = 0;
  let paymentSuccess = false; // 예약용

  // ✅ 현재 보유 젤리 개수 가져와서 화면에 표시
  fetch("/jjam/api/jjams/total")
    .then(response => response.json())
    .then(data => {
      userJelly = data.totalJjams ?? data;
      document.getElementById("user-jjams").textContent = `현재 보유 쩸: ${userJelly}개`;
    })
    .catch(error => console.error("쩸 개수 불러오기 실패", error));

  // ✅ 예약 버튼 처리
  const reserveButton = document.getElementById("submit-btn");
  console.log("버튼 찾기:", reserveButton); // 디버깅: 버튼 확인

  if (!reserveButton) {
    console.error("submit-btn을 찾을 수 없습니다.");
    return;
  }

  reserveButton.addEventListener("click", function () {
    console.log("버튼 클릭됨");

    // 🔍 총 요금 가져오기
    const priceText = document.getElementById("total-price").value.replace(/[^\d]/g, "");
    const totalPrice = parseInt(priceText, 10);
    console.log("총 요금(쩸 단위):", totalPrice);
    
    if (!totalPrice || isNaN(totalPrice)) {
      alert("날짜/시작/종료 시간을 확인하세요.");
      return;
    }

    if (userJelly < totalPrice) {
      const goToCharge = confirm(`현재 보유 쩸(${userJelly}개)가 부족합니다.\n총 요금은 ${totalPrice}쩸입니다.\n충전 페이지로 이동할까요?`);
      if (goToCharge) {
        window.location.href = "/jjam/shop";
      }
      return;
    }

    // URL에서 carId 추출 (추가 정보 전송용)
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams:", urlParams);
    const productId = urlParams.get("id") || urlParams.get("productId");
    console.log("전송용 productId:", productId);
    
    // *** 예약용 정보
    const rentalDate = document.getElementById("rental-date").value;
    console.log('rentalDate: ', rentalDate);
    const start = document.getElementById("start-time").value;
    const end = document.getElementById("end-time").value;
    const startTime = `${rentalDate}T${start}:00`;
    const endTime = `${rentalDate}T${end}:00`;
    console.log('startTime: ' + startTime + ', endTime: ' + endTime);
    const reservationData = {productId, startTime, endTime}; // 예약용 데이터
    
    // 예약 요청
    fetch(`./reservation/check?id=${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(reservationData)
    })
    .then((response) => response.json())
    .then((checkResult) => {
        console.log('예약 요청 진행 중...');
        console.log('검사 결과: ', checkResult);
        if (checkResult === true) {
            // 겹치는 예약이 없는 경우
            // ✅ 예약 API 호출
            return fetch("/api/jjam/reservations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ fee: totalPrice, productId: productId })
            });
        } else {
            throw new Error('conflict');
        }
    })
    .then(response => {
        console.log("API 응답 상태:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("API 응답 데이터:", data);
        if (data.success) {
          alert(`💸 ${data.usedJjams} 쩸 차감 완료!\n남은 쩸: ${data.remainingJjams}개`);
          paymentSuccess = true; // *** 예약테스트용
        } else {
          const goToCharge = confirm(`${data.message}\n충전 페이지로 이동할까요?`);
          if (goToCharge) {
            window.location.href = "/jjam/shop";
          }
        }
    })
    .then(result => {
        // *** 예약 테스트용
        console.log('결재 완료여부: ', paymentSuccess);
        if (paymentSuccess) {
            reservationHandler(reservationData, productId);
        }
    })      
    .catch(error => {
        console.error("예약 요청 실패:", error);
        // 예약 등록이 실패한 경우(해당 시간에 이미 예약이 차있는 경우) 안내 메세지 출력
        if (error.message === 'conflict') {
            alert('선택하신 시간은 이미 예약이 완료되었습니다. 다른 시간을 선택해주세요.');
        } else {
            alert("❗ 예약 요청 처리 중 오류가 발생했습니다.");   
        }
    });
  });
  
  /* 예약 등록 함수 */
  function reservationHandler(reservationData, productId) {
      const uri = `./reservation/create?id=${productId}`;
      fetch(uri, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(reservationData)
      })
      .then((response) => response.json())
      .then((createResult) => {
          console.log('서버 응답: ', createResult);
          if (createResult === true) {
              // 예약 등록이 성공한 경우: alert로 알려줌
              // 알람 발송은 controller에서 수행
              alert('예약이 신청되었습니다.');
              window.close();                   
          } else {
              // 예약 등록이 실패한 경우
              alert('예약 신청이 실패하였습니다.');
          }
      })
      .catch((error) => console.log(error)); 
  };
  
});