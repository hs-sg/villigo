document.addEventListener("DOMContentLoaded", () => {
    // 프로필 이미지 클릭 시 업로드 알림
    const profileImage = document.getElementById("profileImage");
    if (profileImage) {
        profileImage.addEventListener("click", () => {
            alert("프로필 이미지 업로드 기능 연결 예정");
        });
    }

    // 탭 전환 처리 (showTab 함수 사용)
    const tabs = document.querySelectorAll(".tab");
    const contents = document.querySelectorAll(".tab-content");

    // 페이지 로드 시 "나의 예약" 탭이 활성화되어 있다면 이벤트 바인딩
    const activeTabIndex = Array.from(tabs).findIndex(tab => tab.classList.contains("active"));
    if (activeTabIndex === 2) {
        bindReservationCardEvents();
    }

    // showTab 함수 정의
    window.showTab = function(index) {
        tabs.forEach((t, i) => t.classList.toggle("active", i === index));
        contents.forEach((c, i) => c.classList.toggle("active", i === index));
        // "나의 예약" 탭이 활성화될 때 이벤트 바인딩
        if (index === 2) {
            bindReservationCardEvents();
        }
    };

    // 예약카드 내부 버튼 동작 처리 (예약현황 탭만 처리)
    document.querySelectorAll(".tab-content:nth-child(2) .reservation-card").forEach(card => {
        const btnDecline = card.querySelector(".btn-decline");
        const btnAccept = card.querySelector(".btn-accept");
        const btnChat = card.querySelector(".btn-chat");
        const btnRejected = card.querySelector(".btn-rejected");
        const btnDelete = card.querySelector(".btn-delete");

        if (!btnDecline || !btnAccept || !btnChat || !btnRejected || !btnDelete) return;

        // 거절 버튼 → 나머지 숨기고 '거절됨' 표시 + 삭제 버튼 표시
        btnDecline.addEventListener("click", () => {
            btnDecline.style.display = "none";
            btnAccept.style.display = "none";
            btnChat.style.display = "none";
            btnRejected.style.display = "inline-block";
            btnDelete.style.display = "inline-block";
        });

        // 수락 버튼 → 거절/수락 버튼 숨기고 채팅 유지
        btnAccept.addEventListener("click", () => {
            btnDecline.style.display = "none";
            btnAccept.style.display = "none";
        });

        // 채팅 버튼 → 채팅 페이지 이동
        btnChat.addEventListener("click", () => {
            location.href = "/chat";
        });

        // 삭제 버튼 → 확인 후 카드 제거
        btnDelete.addEventListener("click", () => {
            const confirmDelete = confirm("상품을 삭제하시겠습니까?");
            if (confirmDelete) card.remove();
        });
    });

    // "나의 예약" 탭의 예약 카드에 상태바와 버튼 이벤트 바인딩
    function bindReservationCardEvents() {
            document.querySelectorAll(".tab-content:nth-child(3) .reservation-card").forEach(card => {
                const statusInput = card.querySelector(".reservation-status");
                const steps = card.querySelectorAll(".status-steps .step");
                const dealButtons = card.querySelector(".deal-buttons");

                if (!statusInput || !steps || !dealButtons) return;

                const status = parseInt(statusInput.value); // 상태 값 가져오기

                // 상태 초기화
                steps.forEach(step => {
                    step.classList.remove("completed");
                });

                // 상태에 따라 해당 단계에만 completed 클래스 적용
				if (status === 0 || status === 1) {
				    steps[1].classList.add("completed");  // 대기중 단계 표시
				} else if (status === 2) {
				    steps[2].classList.add("completed");
				    dealButtons.style.display = "flex"; // 채팅/거래완료 버튼 표시
				} else if (status === 3) {
				    steps[3].classList.add("completed");
				} else if (status === 4) {
				    steps[4].classList.add("completed");
				}

            });
        }

        // "채팅" 버튼 클릭 시 채팅방 열기
        window.openChatRoomByReservation = function(event) {
            const reservationId = event.target.getAttribute('data-id');
            if (!reservationId) {
                console.error('reservationId를 찾을 수 없습니다.');
                alert('예약 정보를 찾을 수 없습니다.');
                return;
            }

            const currentUserId = document.body.getAttribute('data-user-id');
            if (!currentUserId) {
                console.error('currentUserId를 가져올 수 없습니다.');
                alert('사용자 정보를 가져올 수 없습니다. 로그인 상태를 확인해주세요.');
                return;
            }

            axios.post('/api/chat/rooms/by-reservation', null, {
                params: { reservationId, currentUserId }
            })
            .then(response => {
                const chatRoom = response.data;
                const chatRoomId = chatRoom.id;
                console.log('채팅방 ID:', chatRoomId);
                window.location.href = `/chat?chatRoomId=${chatRoomId}`;
            })
            .catch(error => {
                console.error('채팅방 생성/조회 실패:', error);
                if (error.response && error.response.status === 403) {
                    alert('이 예약에 대한 채팅 권한이 없습니다.');
                } else {
                    alert('채팅방을 여는 데 실패했습니다.');
                }
            });
        };
    });



// 찜 하트 토글
function toggleHeart(btn) {
    const card = btn.closest(".product-card");
    const deleteBtn = card.querySelector(".delete-btn");

    if (btn.classList.contains("active")) {
        btn.classList.remove("active");
        btn.textContent = "🤍"; // 하트 비활성
        deleteBtn.style.display = "block"; // 삭제 버튼 표시
    } else {
        btn.classList.add("active");
        btn.textContent = "❤️"; // 하트 활성
        deleteBtn.style.display = "none";
    }
}

//  찜 카드 삭제
function deleteCard(btn, productId) {
  const card = btn.closest(".product-card");
  if (confirm("찜상품을 삭제하시겠습니까?")) {
    fetch(`/api/like/no?id=${productId}`)
        .then((response) => response)
        .then((data) => {
            console.log(data);
            card.remove();
        })
        .catch(error => {
            console.error("좋아요 해제 실패:", error);
        });
  }
}

// 거래완료 → 팝업창 띄우기 (후기 작성)
function openCompletePopup() {
    const popupWidth = 500;
    const popupHeight = 600;
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;
    const screenLeft = window.screen.availLeft || 0;
    const screenTop = window.screen.availTop || 0;

    const left = screenLeft + (screenWidth - popupWidth) / 2;
    const top = screenTop + (screenHeight - popupHeight) / 2;
    const popupOptions = `width=${popupWidth},height=${popupHeight},top=${top},left=${left},scrollbars=no,resizable=no`;

    window.open("/review", "거래 완료 및 후기", popupOptions);
}

// 후기 등록 후 상태 업데이트 및 UI 변경
function completeReview() {
    const card = window.opener.document.querySelector(".reservation-card");
    if (card) {
        const steps = card.querySelectorAll(".status-steps .step");
        const dealButtons = card.querySelector(".deal-buttons");

        // 상태바를 "거래완료"로 업데이트 (해당 단계만 completed)
        steps.forEach(step => {
            step.classList.remove("completed");
        });
        steps[3].classList.add("completed"); // 거래완료 단계 활성화

        // 채팅/거래완료 버튼 숨김
        if (dealButtons) {
            dealButtons.style.display = "none";
        }

        // 상태 값을 업데이트 (숨겨진 input 필드)
        const statusInput = card.querySelector(".reservation-status");
        if (statusInput) {
            statusInput.value = "3"; // 거래완료 상태로 변경
        }
    }

    window.opener.alert("후기 등록이 완료되었습니다.\n거래 상태가 '거래완료'로 변경되었습니다.");
    window.close();
}