let news = [];
let menus = document.querySelectorAll(".menus button");
let user = document.getElementById("user");
let url;
let page = 1;
let totalP = 0;

menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

// 각 함수에서 필요한 url을 만든다
// api 호출 함수를 부른다

const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "TNjlkYBh5VX_iDcV0dcdvaPPePIpgkdTW3jPs3P7llg",
    });

    url.searchParams.set("page", page);
    let response = await fetch(url, { headers: header }); // ajax, axios, fetch, http, await
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색한 내용을 찾을 수 없습니다");
      }
      news = data.articles;
      totalP = data.total_pages;
      page = data.page;
      render();
      PageNation();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("잡힌 에러는", error.message);
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    "https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=5"
  );
  getNews();
};

const getNewsByTopic = async (event) => {
  page = 1;
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=5`
  );
  getNews();
};

const searchNews = async () => {
  page = 1;
  let userNum = user.value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${userNum}&countries=KR&page_size=5`
  );
  getNews();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((item) => {
      return `<div class = "row news">
        <div class = "col-lg-4">
          <img class = "news-img-size" src = "${
            item.media ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
          }"/> 
        </div>
        <div class = "col-lg-8">
            <h2> ${item.title}</h2>
             <p>${
               item.summary == null || item.summary == ""
                 ? "내용없음"
                 : item.summary.length > 200
                 ? item.summary.substring(0, 200) + "..."
                 : item.summary
             }</p>
            <div>${item.rights || "No Source"} ${moment(
        item.published_date
      ).fromNow()} 
            </div>
        </div>
      </div>`;
    })
    .join("");
  document.getElementById("news-board").innerHTML = newsHTML;
};

function enterKey() {
  if (window.event.keyCode == 13) {
    searchNews();
  }
}

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger" role="alert" style = "text-align: center">
  <storng>${message}</storng>
</div>`;
  page = 1;
  PageNation();
  document.getElementById("news-board").innerHTML = errorHTML;
};

const PageNation = () => {
  let pagenationHTML = "";
  let pageGroup = Math.ceil(page / 5);
  let lastP = pageGroup * 5;
  if (lastP > totalP) {
    lastP = totalP;
  }
  let firstP = lastP - 4 <= 0 ? 1 : lastP - 4;

  if (page != 1) {
    pagenationHTML = `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick = "MovePage(${1})">
    <span aria-hidden="true")>&laquo;</span>
  </a>
  </li>
  <li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick = "MovePage(${
    page - 1
  })">
    <span aria-hidden="true")>&lt;</span>
  </a>
  </li>`;
  }
  for (let i = firstP; i <= lastP; i++) {
    pagenationHTML += `
    <li class="page-item  ${
      page == i ? "active" : ""
    }"><a class="page-link" href="#" onclick = "MovePage(${i})">${i}</a></li>
    `;
  }

  if (lastP < totalP) {
    pagenationHTML += `<li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick = "MovePage(${
      page + 1
    })">
      <span aria-hidden="true">&gt;</span>
    </a>
    </li>
    <li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick = "MovePage(${totalP})">
      <span aria-hidden="true")>&raquo;</span>
    </a>
    </li>`;
  }

  document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const MovePage = (pageNum) => {
  page = pageNum;

  getNews();
};

let searchBtn = document.getElementById("search");
searchBtn.addEventListener("click", searchNews);
getLatestNews();
