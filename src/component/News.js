import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import NewsItem from "./NewsItem";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const [article, setArticle] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  document.title = `${capitalizeFirstLetter(
    props.category
  )} - MonkeyNews`;

  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey} &page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(40);
    let parseData = await data.json();
    props.setProgress(70);
    setArticle(parseData.articles);
    setTotalResults(parseData.totalResults);
    setLoading(false);
    props.setProgress(100);
  };

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${props.category}&apiKey=${props.apiKey} &page=${
      page + 1
    }&pageSize=${props.pageSize}`;
    let data = await fetch(url);
    let parseData = await data.json();
    setPage(page + 1);
    setArticle(article.concat(parseData.articles));
    setTotalResults(parseData.totalResults);
  };

  useEffect(() => {
    updateNews();
  }, []);

  return (
    <>
      <h1 className="text-center" style={{ margin: "20px 0px" }}>
        NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      {loading && <Loader />}
      <InfiniteScroll
        dataLength={article.length}
        next={fetchMoreData}
        hasMore={totalResults !== article.length}
        loader={<Loader />}
      >
        <div className="container my-3">
          <div className="row">
            {article.map((element) => {
              return (
                <div key={element.url} className="col-md-4 my-3">
                  <NewsItem
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={
                      element.urlToImage
                        ? element.urlToImage
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSADPzrYm_hQg2XMNc_9KTr9Axmn35s0DbsIQ&usqp=CAU"
                    }
                    newsUrl={element.url}
                    author={element.author ? element.author : "unKnown"}
                    date={element.publishedAt ? element.publishedAt : "unKnown"}
                    source={
                      element.source.name ? element.source.name : "unKnown"
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 9,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
