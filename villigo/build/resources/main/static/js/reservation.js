document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM 로드 완료, Flatpickr 초기화 시작");

    function initializeFlatpickr() {
        if (typeof flatpickr === "undefined") {
            console.warn("Flatpickr가 아직 로드되지 않았습니다. 100ms 후 재시도...");
            setTimeout(initializeFlatpickr, 100);
            return;
        }

        // 날짜 선택
        flatpickr("#rental-date", {
            enableTime: false,
            dateFormat: "Y-m-d",
            minDate: "today",
            locale: "ko", /* 한글 로케일 설정 */
            onOpen: function () {
                console.log("📅 캘린더 열림");
                document.querySelector(".flatpickr-calendar").style.zIndex = "9999";
            },
            onReady: function () {
                console.log("📅 Flatpickr 준비 완료");
            },
            onChange: function (selectedDates, dateStr) {
                console.log("📅 선택된 날짜:", dateStr);
            }
        });

        // 시간 선택
        flatpickr("#start-time", {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            position: "below",
            locale: "ko", /* 한글 로케일 설정 */
            onChange: function (selectedDates, dateStr) {
                console.log("⏰ 시작 시간 선택:", dateStr);
                calculatePrice();
            }
        });

        flatpickr("#end-time", {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            position: "below",
            locale: "ko", /* 한글 로케일 설정 */
            onChange: function (selectedDates, dateStr) {
                console.log("⏰ 종료 시간 선택:", dateStr);
                calculatePrice();
            }
        });

        // JAM 개수 설정
        let userJam = 100;
        document.getElementById("jam-count").textContent = userJam;

        // 총 요금 계산
        function calculatePrice() {
            const startTime = document.getElementById("start-time").value;
            const endTime = document.getElementById("end-time").value;

            if (startTime && endTime) {
                const start = new Date(`2000-01-01T${startTime}:00`);
                const end = new Date(`2000-01-01T${endTime}:00`);
                const diffHours = (end - start) / (1000 * 60 * 60);

                if (diffHours > 0) {
                    const pricePerHour = 5000;
                    const totalPrice = diffHours * pricePerHour;
                    document.getElementById("total-price").value = `${totalPrice.toLocaleString()} 쩸`;
                } else {
                    document.getElementById("total-price").value = "0 쩸";
                }
            }
        }
    }

    initializeFlatpickr();
});