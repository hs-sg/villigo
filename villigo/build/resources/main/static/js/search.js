document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const selectedFiltersContainer = document.getElementById('selectedFilters');
    const filterButtons = document.querySelectorAll('.filter-btn, .color-circle');
    const resultsSection = document.getElementById('results');
    const mapButtonSection = document.getElementById('mapButtonSection');
    const priceSearchBtn = document.getElementById('priceSearchBtn');

    let selectedFilters = {};

    // 유저 닉네임인지 판별하는 함수
    function isUserNickname(query) {
        const nicknamePattern = /^[a-zA-Z0-9가-힣]{2,20}$/;
        const hasFilter = Object.keys(selectedFilters).length > 0;
        return nicknamePattern.test(query) && !hasFilter;
    }

    //  선택된 필터 표시 업데이트 함수
    function updateSelectedFilters() {
        selectedFiltersContainer.innerHTML = '';

        for (const [type, filterArrays] of Object.entries(selectedFilters)) {
            filterArrays.forEach(filterArray => {
                const filterTag = document.createElement('div');
                filterTag.classList.add('selected-filter');
                filterTag.innerHTML = `
                    <span>${filterArray.value}</span>
                    <button data-type="${type}" data-value="${filterArray.value}" data-source="${filterArray.source}">X</button>
                `;
                selectedFiltersContainer.appendChild(filterTag);
            });
        }

        // 삭제 버튼 동작
        document.querySelectorAll('.selected-filter button').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                const value = btn.dataset.value;

                const index = selectedFilters[type].findIndex(item => item.value === value);
                if (index > -1) {
                    selectedFilters[type].splice(index, 1);
                    if (selectedFilters[type].length === 0) {
                        delete selectedFilters[type];
                    }
                    document.querySelector(`[data-filter="${type}"][data-value="${value}"]`)?.classList.remove('selected');
                    updateSelectedFilters();
                    performSearch();
                }
            });
        });

    }

    // 검색 실행 함수
    const performSearch = () => {
        const query = searchInput.value.trim();
        const isUserSearch = isUserNickname(query);
        const hasFilter = Object.keys(selectedFilters).length > 0;

        // 지도 버튼 노출 조건: 유저 검색이 아니고, (검색어가 있거나 필터가 있으면)
        const showMapButton = !isUserSearch && (query !== '' || hasFilter);
        mapButtonSection.classList.toggle('hidden', !showMapButton);

        // 결과 초기화 -> 없어도 될거 같아서 주석처리 했습니다!
        // resultsSection.innerHTML = `<div class="search-result">검색 결과</div>`;

        // 검색 실행 구현!
        let selectFilters = document.querySelectorAll('.selected-filter');

        const filterMap = Array.from(selectFilters).reduce((result, filter) => {
            const button = filter.querySelector('button');
            const type = button.dataset.type;
            const source = button.dataset.source;

            if (!result[type]) {
                result[type] = [];
              }
              result[type].push(source);
              return result;
            }, {});
        const priceMin = document.getElementById("priceMin").value.trim();
        const priceMax = document.getElementById("priceMax").value.trim();

        filterMap.keyword = [searchInput.value.trim()];
        filterMap.price = [priceMin, priceMax];
        console.log(filterMap);

        axios.post(`/api/search`, filterMap )
            .then((response) => {
                console.log(response.data);
                let html = '';
                resultsSection.innerHTML = html;
                if(response.data.totalElements === 0) {
                    html = `<span>검색된 결과가 없습니다!</span>`;
                } else {
                    response.data.content.forEach(product => {
                        html += `
                            <div class="result-item">`
                        switch(product.rentalCategoryId) {
                            case 1:
                                html += `
                                <a href="/post/details/bag?id=${product.id}">`
                                break;
                            case 2:
                                html += `
                                <a href="/post/details/car?id=${product.id}">`
                                break;
                        }
                        html += `
                                    <img src="/images/rentals/${product.filePath}" alt="상품 이미지">
                                </a>`
                        switch(product.rentalCategoryId) {
                            case 1:
                                html += `
                                <a href="/post/details/bag?id=${product.id}">`
                                break;
                            case 2:
                                html += `
                                <a href="/post/details/car?id=${product.id}">`
                                break;
                        }
                        html += `
                                    <p><Strong>${product.productName}</Strong></p>
                                </a>
                            </div>
                        `;
                    });
                }
                resultsSection.innerHTML += html;

            })
            .catch((error) => { console.log(error)})
    };

    // 검색 버튼 / 엔터 키 이벤트
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 가격 validation
    priceSearchBtn.addEventListener('click', () => {
        const minInput = document.getElementById('priceMin');
        const maxInput = document.getElementById('priceMax');

        const min = parseInt(minInput.value, 10);
        const max = parseInt(maxInput.value, 10);

        // 유효성 검사
        if (isNaN(min) || isNaN(max)) {
            alert('숫자를 입력해주세요.');
            return;
        }

        if (min < 0 || max < 0) {
            alert('0원 이상의 금액만 입력 가능합니다.');
            return;
        }

        if (min > max) {
            alert('최소 금액이 최대 금액보다 클 수 없습니다.');
            return;
        }

        const value = `${min}~${max}`;
        if (!selectedFilters['price']) selectedFilters['price'] = [];
        if (!selectedFilters['price'].includes(value)) {
            selectedFilters['price'].push(value);
            updateSelectedFilters();
            performSearch();
        }

        // 입력창 초기화
        minInput.value = '';
        maxInput.value = '';
    });

    // 필터 버튼 클릭 이벤트
    filterButtons.forEach(button => {
        button.addEventListener('click', () => handleFilterButtonClick(button));
    });
    
    function handleFilterButtonClick (button) {
        const filterType = button.dataset.filter;
        const filterValue = button.dataset.value;
        const filterSource = button.dataset.source;

        if (!selectedFilters[filterType]) {
            selectedFilters[filterType] = [];
        }

        const index = selectedFilters[filterType].findIndex(item => item.value === filterValue);

        if (index > -1) {
            selectedFilters[filterType].splice(index, 1);
            button.classList.remove('selected');
            if (selectedFilters[filterType].length === 0) {
                delete selectedFilters[filterType];
            }
        } else {
            selectedFilters[filterType].push({ value : filterValue, source : filterSource });
            button.classList.add('selected');
        }
        updateSelectedFilters();
        performSearch();
    }
    
    document.querySelectorAll(".category-btn").forEach( btn => {
        btn.addEventListener('click', function () {
            const categoryId = this.dataset.source;
            
            refreshFilters()
            
            axios.post(`/api/brand`, { rentalCategoryId : categoryId }, {
                    headers: { 
                        'Content-Type' : 'application/json' 
                    }
                })
                .then((response) => {
                    console.log(response.data);
                    const brands = response.data;
                    console.log(brands);
                    const brandDiv = document.getElementById("brandDiv");
                    let html = ''
                    brandDiv.innerHTML = html;
                    
                    for(let brand of brands) {
                        html += `
                            <button class="filter-btn category-btn" data-filter="brand" data-value="${brand.name}" 
                            data-source="${brand.id}">${brand.name}</button>
                        `
                    }
                    brandDiv.innerHTML = html;
                    
                    document.querySelectorAll('#brandDiv .filter-btn').forEach(btn => {
                        btn.addEventListener('click', () => handleFilterButtonClick(btn));
                    });
                })
                .catch((error) => console.log(error));
        });
    });
    
    function refreshFilters() {

        document.querySelectorAll('.brand-btn').forEach(btn => {
            btn.classList.remove("selected");
        })
        document.querySelectorAll('.color-circle').forEach(btn => {
            btn.classList.remove("selected");
        })
        document.querySelectorAll('.location-circle').forEach(btn => {
            btn.classList.remove("selected");
        })
        document.querySelectorAll('.price-circle').forEach(btn => {
            btn.classList.remove("selected");
        })
    }
    
    
    
    let map;
    let mapInitialized = false;

    const mapOverlay = document.getElementById("mapOverlay");
    const toggleMapBtn = document.getElementById("toggleMapBtn");
    const closeMapBtn = document.getElementById("closeMapBtn");

    
    // 지도 보여주기
    toggleMapBtn.addEventListener("click", function () {
      mapOverlay.style.display = "flex";

      if (!mapInitialized) {
        const mapOption = {
          center: new kakao.maps.LatLng(37.5665, 126.9780),
          level: 3
        };
        map = new kakao.maps.Map(document.getElementById("map"), mapOption);
        mapInitialized = true;
      }

      setTimeout(() => {
        kakao.maps.event.trigger(map, 'resize');
      }, 200);
    });

    closeMapBtn.addEventListener("click", function () {
      mapOverlay.style.display = "none";
    });

    
    performSearch(); // 처음 들어오자마자 한번실행 (초기 리스트 보기)
});
