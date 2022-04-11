let news = [];
let menus = document.querySelectorAll(".menus button");
let user = document.getElementById("user");

menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

const getLatestNews = async () => {
  let url = new URL(
    "https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=5"
  );
  let header = new Headers({
    "x-api-key": "mZbbQcpRjQHxTGPpfZrHLpIwc5Ty7mdU2WiLqOpukZU",
  });

  let response = await fetch(url, { headers: header }); // ajax, axios, fetch, http, await
  let data = await response.json();
  console.log("this is data", data);
  news = data.articles;
  console.log(news);

  render();
};

const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();

  let url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=5`
  );

  let header = new Headers({
    "x-api-key": "mZbbQcpRjQHxTGPpfZrHLpIwc5Ty7mdU2WiLqOpukZU",
  });

  let response = await fetch(url, { headers: header });
  let data = await response.json();
  news = data.articles;
  render();
};

const searchNews = async () => {
  let userNum = user.value;

  let url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${userNum}&countries=KR&page_size=5`
  );

  let header = new Headers({
    "x-api-key": "mZbbQcpRjQHxTGPpfZrHLpIwc5Ty7mdU2WiLqOpukZU",
  });

  let response = await fetch(url, { headers: header });
  let data = await response.json();
  news = data.articles;
  render();
};

const render = () => {
  let newsHTML = "";
  if (news == undefined) {
    alert("데이터가 없습니다");
    return 0;
  }
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

let bb = document.getElementById("search");
bb.addEventListener("click", searchNews);
getLatestNews();
