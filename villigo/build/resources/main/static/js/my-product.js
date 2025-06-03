document.addEventListener('DOMContentLoaded', () => {

    const myProductTab = document.getElementById("myProductTab");
    const myProductDiv = document.getElementById("myProductDiv");
    const likeProductTab = document.getElementById("likeProductTab")
    const likeProductDiv = document.getElementById("likeProductDiv");
    let uri = '';
    axiosPaging(1, 0);
    myProductTab.addEventListener('click', () => {
        myProductDiv.innerHTML = '';
        axiosPaging(1, 0)
    });

    likeProductTab.addEventListener('click', () => {
        likeProductDiv.innerHTML = '';
        axiosPaging(2, 0)
    });
    

    // functions
    function axiosPaging(category, pageNum) {
        switch(category){
            case 1: // 내 상품
                uri = `/api/mypage/myproduct?p=${pageNum}`;
                axios
                .get(uri)
                .then((response) => { myProductPaging(response.data) })
                .catch((error) => { console.log(error); });
            case 2: // 찜 상품
                uri = `/api/mypage/likeproduct?p=${pageNum}`;
                axios
                .get(uri)
                .then((response) => { likeProductPaging(response.data) })
                .catch((error) => { console.log(error); });
        }

    }

    function myProductPaging(data) {
        if(data.totalElements == 0) {
            myProductDiv.innerHTML = '등록한 상품이 없습니다!'
            return;

        }
        let html = '';
        data.content.forEach(product => {
            html += `
					<div class="product-card">`;
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
					        </a>
							<p>`
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
                                    <strong>${product.productName}</strong>
                                </a>
							</p>
						    <p><strong>${product.fee}JJAM</strong></p>
					    </div>
                    `;
        });

        myProductDiv.innerHTML += html;

        console.log(data);
        const pageNumber = data.pageable.pageNumber;
        const totalPages = data.totalPages
        if(pageNumber < totalPages-1) {
            moreView(1, pageNumber, totalPages);
        } else {
            deleteBtnMoreView();
        }
    }

    function likeProductPaging(data) {
        if(data.totalElements === 0) {
            likeProductDiv.innerHTML = '<span>등록한 상품이 없습니다!</span>'
            return;
        }
        let html = ''
        data.content.forEach(product => {
            html += `
                <div class="product-card">
			        <button class="heart-btn active" onclick="toggleHeart(this)">❤️</button>`
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
                        <img src="/images/rentals/${product.filePath}" alt="찜상품">
			        </a>
			        <p>`
            switch(product.rentalCategoryId) {
                case 1:
                    html += `
                        <a href="/post/details/bag?id=${product.id})">`
                    break;
                case 2:
                    html += `
                        <a href="/post/details/car?id=${product.id})">`
                    break;
            }
			html += `
                            <strong>${product.productName}</strong>
			            </a>
			        </p>
			        <p><strong>${product.fee}JJAM</strong></p>
			        <button class="delete-btn" style="display: none;" onclick="deleteCard(this, ${product.id})">삭제</button>
			    </div>`
        });
        likeProductDiv.innerHTML = html;
    }

    function moreView(category, pageNumber, totalPages) {
        const divMoreView = document.getElementById("divMoreView");
        html = `
                <button class="btn" id="btnMoreView">더보기(${pageNumber+1} / ${totalPages})</button>
        `
        divMoreView.innerHTML = html;
        const btnMoreView = document.getElementById("btnMoreView");
        btnMoreView.addEventListener('click', () => {
            axiosPaging(category, pageNumber+1)
        });
    }

    function deleteBtnMoreView() {
        document.getElementById("divMoreView").innerHTML = '';
    }
});