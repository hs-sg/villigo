// -------------------------
// 브랜드 데이터
// -------------------------
const brandData = {
  car: [
    { name: 'BMW', img: '/images/testcar3.jfif' },
    { name: '벤츠', img: '/images/testcar.jfif' },
    { name: '현대', img: '/images/testcar.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    { name: '기아', img: '/images/testcar2.jfif' },
    
  ],
  bag: [
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '루이비통', img: '/images/testbag2.jfif' },
    { name: '프라다', img: '/images/testbag.jfif' },
    { name: '프라다', img: '/images/testbag.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' },
    { name: '샤넬', img: '/images/testbag3.jfif' }
  ]
};

const sampleProducts = [
  { name: '샘플 상품 A', price: '270,000원~', img: '/images/testbag2.jfif' },
  { name: '샘플 상품 B', price: '308,500원~', img: '/images/testbag3.jfif' },
  { name: '샘플 상품 C', price: '160,600원~', img: '/images/testbag.jfif' },
  { name: '샘플 상품 D', price: '160,600원~', img: '/images/testbag.jfif' }
];

// -------------------------
// 브랜드 슬라이더 로직
// -------------------------
let currentBrandPage = 0;
const brandsPerPage = 8;

function selectCategory(cat) {
  const emblemBox = document.getElementById('brandEmblems');
  // 전체 데이터 저장
  emblemBox.dataset.category = cat;
  // 현재 페이지 초기화
  currentBrandPage = 0;
  // 브랜드 뷰 업데이트
  updateBrandView();
}

function updateBrandView() {
  const emblemBox = document.getElementById('brandEmblems');
  const cat = emblemBox.dataset.category;
  
  // 초기화
  emblemBox.innerHTML = '';
  
  // 현재 페이지에 표시할 브랜드 계산
  const startIndex = currentBrandPage * brandsPerPage;
  const endIndex = startIndex + brandsPerPage;
  const currentPageBrands = brandData[cat].slice(startIndex, endIndex);
  
  // 균등하게 배치
  currentPageBrands.forEach(b => {
    emblemBox.innerHTML += `
      <div class="brand-item" onclick="alert('${b.name} 브랜드가 선택되어있는 검색페이지로 이동')">
        <img src="${b.img}" alt="${b.name}">
        <div>${b.name}</div>
      </div>
    `;
  });
}

function scrollBrand(direction, event) {
  // 이벤트 버블링 방지
  if (event) {
    event.stopPropagation();
	event.preventDefault();
  }
  
  const emblemBox = document.getElementById('brandEmblems');
  const cat = emblemBox.dataset.category;
  const totalBrands = brandData[cat].length;
  const maxPage = Math.ceil(totalBrands / brandsPerPage) - 1;
  
  // 페이지 변경
  currentBrandPage += direction;
  
  // 범위 체크
  if (currentBrandPage > maxPage) currentBrandPage = 0;
  if (currentBrandPage < 0) currentBrandPage = maxPage;
  
  // 뷰 업데이트
  updateBrandView();
}



// -------------------------
// 상품 카드 렌더링
// -------------------------
function loadProducts(sectionId) {
  const box = document.getElementById(sectionId);
  sampleProducts.forEach(p => {
    box.innerHTML += `
      <div class="product-card">
        <img src="${p.img}" alt="${p.name}">
		<div class="mt-1">
		    <div class="product-name">${p.name}</div>
		    <div class="product-price">${p.price}</div>
		  </div>
    `;
  });
}

// -------------------------
// 프로모션 슬라이드
// -------------------------
const slides = [
  {
    img: "/images/cherryblossom1.png",
    title: "🌸 봄맞이 JJAM 추가 혜택",
    subtitle: "최대 20% 보너스!",
    link: "/jjam/shop",
    position: "center center"
  },
  {
    img: "/images/car3.jpg",
    title: "👋🏻 처음 인사 드려요!",
    subtitle: "빌리고라고 합니다",
    link: "/search",
    position: "bottom center"
  }
];

let currentSlide = 0;
let slideInterval = null;
let isPlaying = true;
let isFirstRender = true;

const carousel = document.getElementById("carousel");
const progressIndicator = document.getElementById("progressIndicator");
const toggleBtn = document.getElementById("sliderToggleBtn");
const pauseIcon = document.getElementById("pauseIcon");
const playIcon = document.getElementById("playIcon");

function renderSlide(index) {
  const s = slides[index];
  const slide = document.createElement("div");
  slide.classList.add("promotion-card");

  if (!isFirstRender) {
    slide.classList.add("slide-in");
  } else {
    slide.style.transform = "translateX(0)";
  }

  const textClass = index === 1 ? "light-text" : "dark-text";

  slide.innerHTML = `
    <a href="${s.link}" class="promotion-link">
      <div class="promotion-bg">
        <img src="${s.img}" alt="slide" style="object-position: ${s.position || 'center center'};">
      </div>
      <div class="promotion-text ${textClass}">
        <div>${s.title}</div>
        <small>${s.subtitle}</small>
      </div>
    </a>
  `;

  carousel.appendChild(slide);

  if (!isFirstRender && carousel.children.length > 1) {
    const [first] = carousel.children;
    setTimeout(() => {
      carousel.removeChild(first);
    }, 500);
  }

  isFirstRender = false;
  updateProgressBar(index);
}

function updateProgressBar(index) {
  const percentPerSlide = 100 / slides.length;
  progressIndicator.style.width = `${percentPerSlide}%`;
  progressIndicator.style.left = `${percentPerSlide * index}%`;
}

function startSlider() {
  if (slideInterval) return;
  slideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    renderSlide(currentSlide);
  }, 4000);
  isPlaying = true;
  pauseIcon.style.display = "block";
  playIcon.style.display = "none";
}

function stopSlider() {
  clearInterval(slideInterval);
  slideInterval = null;
  isPlaying = false;
  pauseIcon.style.display = "none";
  playIcon.style.display = "block";
}

function toggleSlider() {
  isPlaying ? stopSlider() : startSlider();
}

toggleBtn.onclick = toggleSlider;

// -------------------------
// 초기 실행 + 전역 등록
// -------------------------
selectCategory('car');
loadProducts('recommendProducts');
loadProducts('topLocalProducts');
loadProducts('newProducts');
loadProducts('AllProducts');
renderSlide(currentSlide);
startSlider();
window.scrollBrand = scrollBrand;
window.selectCategory = selectCategory;