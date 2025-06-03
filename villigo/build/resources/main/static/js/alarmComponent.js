/**
 * (알람 창이 구현되어있는 html)파일에 포함
 */

document.addEventListener('DOMContentLoaded', () => {
    // 현재 페이지 번호 -> [더보기] 버튼 생성용
    let currentPageNo = 0;
    // 더보기 버튼
    const btnMoreAlarm = document.getElementById('btnMore');
    // 알림 점
    const alarmBell = document.getElementById('alarmBell');
    
    getAllAlarms();
    btnMoreAlarm.addEventListener('click', () => getAllAlarms(currentPageNo + 1));
    
    /* ---------------------- 함수 선언 ---------------------- */
    function getAllAlarms(pageNo = 0) {
        const url = `/alarm/list/preforward?p=${pageNo}`;
        
        fetch(url)
        .then((response) => {
            return response.json();            
        })
        .then((data) => {
            console.log(data);
            currentPageNo = data.page.number; // 현재 알람창의 페이지 번호
            makeAlarmElements(data); 
        })
        .catch((error) => console.log(error));
    }
    
    function makeAlarmElements({content, page}) {
        // 알람 카드들이 표시될 div 요소
        const divAlarmList = document.getElementById('divAlarmList');
        // 알람 없음 메시지가 표시된 div 요소
        const divNoAlarm = document.getElementById('divNoAlarm');
        console.log('divNoAlarm: ', divNoAlarm);
        const contentLength = Object.keys(content).length;
        console.log('표시되는 알람 갯수: ', contentLength);
        // 1. 표시해야 하는 알람이 없는 경우
        if (contentLength === 0) {
            console.log('새로운 알람 없음');
            divNoAlarm.innerHTML = '👀 새로운 알람이 없습니다.';
            btnMoreAlarm.style.display = 'none';
        } else {
        // 2. 표시해야 하는 알람이 있는 경우
            alarmBell.innerHTML += '<span class="alarm-dot" id="alarmDot"></span>'; // 알림 점 표시
            let htmlStr = ''; // div에 삽입할 문자열
            let destination = '/mypage?dest='; // 알람에 추가할 href 링크
            for (const dto of content) {
                // 알람 카테고리에 따라 href 링크를 수정
                switch (dto.alarmCategoryId) {
                    case 1:
                        destination += 'showtab1'; // 예약 현황
                        break;
                    case 2:
                        destination += 'showtab2'; // 나의 예약
                        break;
                    case 3:
                        destination += 'showtab4'; // 후기
                        break;
                }
                
                // 알람 데이터 생성 시간
                const createdTime = dto.createdTime;
                // 현재 시간
                const currentTime = new Date();
                // 서버 시간을 JS Date 객체로 변환
                const parsedTime = new Date(createdTime);
                // 시간 차 계산 (밀리초 단위)
                const timeDifference = currentTime - parsedTime;
                // 분 단위로 변환
                const minutesDifference = Math.floor(timeDifference / (1000 * 60));
                
                // 알람별로 div 생성
                htmlStr += `
                <div class="alarm-item">
                    <a class="alarm-link text-decoration-none text-dark" id="destination" 
                        href="${destination}" data-id="${dto.id}" role="link">
                        ${dto.content}
                    </a>
                    <br>
                    <p class="small text-muted text-end">${minutesDifference}분 전</p>
                </div>
                `;
                // - ${alarm.content}: 알람 내용
                // - ${alarm.createdTime}: 알람 생성시간
                // - 링크의 href 속성값으로 destination 변수 할당
                // - data-id 속성 추가: ${alarm.id} -> 알람 상태 변경 Ajax 요청에 필요함.   
            }

        
            if (currentPageNo === 0) {
                // 첫번째 페이지면 기존 내용을 다 지우고 새로 작성.
                divAlarmList.innerHTML = htmlStr;
            } else {
                // 첫번째 페이지가 아니면 기존 내용 밑에 예약 목록을 추가.
                divAlarmList.innerHTML += htmlStr;
            }
    
            if ((page.number + 1) !== page.totalPages) {
                // 현재 페이지가 마지막 페이지가 아니면 [더보기] 버튼 보여주기
                btnMoreAlarm.style.display = 'block';    
            } else {
                // 현재 페이지가 마지막 페이지면 [더보기] 버튼 감추기
                btnMoreAlarm.style.display = 'none';
            }
            
            // *** 알람 카드에서 링크가 설정되는 요소에 click 이벤트 리스너를 설정할 예정
            const alarmLink = document.querySelectorAll('a.alarm-link');
            alarmLink.forEach((link) => link.addEventListener('click', checkAlarm));
        }
    }
    
    // 알람 확인 처리 함수
    function checkAlarm(event) {
        event.preventDefault(); // 기본 클릭 동작 취소
        const link = document.getElementById('destination');
        
        // 링크 비활성화 로직 추가
        link.style.pointerEvents = "none"; // 클릭 불가능하게 설정
        link.style.opacity = "0.5"; // 시각적으로 비활성화 표시
        
        const uri = `/alarm/check/${event.target.getAttribute('data-id')}`;
        
        fetch(uri)
        .then((response) => {
            return response.json();            
        })
        .then((data) => {
            console.log('확인 처리된 알람 ID: ', data);
            // 서버 응답이 오면 링크에 저장된 주소로 이동
            const destination = link.getAttribute('href');
            window.location.href = destination;
        })
        .catch((error) => {
            console.log(error);
            // 링크 활성화 복구
            link.style.pointerEvents = "auto";
            link.style.opacity = "1.0";
        });
        /*
        axios
        .get(uri)
        .then((response) => {
            console.log('확인 처리된 알람 ID: ', response.data);
            // 서버 응답이 오면 링크에 저장된 주소로 이동
            const destination = link.getAttribute('href');
            window.location.href = destination;
        })
        .catch((error) => {
            console.log(error);
            
            // 링크 활성화 복구
            link.style.pointerEvents = "auto";
            link.style.opacity = "1.0";
        });
        */
    }
    
});