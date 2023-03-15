import React, { Component } from "react";
import Loader from "./Loader";
import NewsItem from "./NewsItem";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 9,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);
    // console.log("Hello, i am constructor!");

    this.state = {
      article: [],
      loading: false,
      page: 1,
    };
    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )} - MonkeyNews`;
  }

  async updateNews() {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey} &page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(40);
    let parseData = await data.json();
    this.props.setProgress(70);
    // console.log(parseData);
    // this.setState({article: parseData.articles});
    this.setState({
      article: parseData.articles,
      totalResults: parseData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  }

  fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${
      this.props.country
    }&category=${
      this.props.category
    }&apiKey=${this.props.apiKey} &page=${
      this.state.page + 1
    }&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parseData = await data.json();
    // console.log(parseData);
    // this.setState({article: parseData.articles});
    await this.setState({
      page: this.state.page + 1,
      article: this.state.article.concat(parseData.articles),
    });
  };

  async componentDidMount() {
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey} &page=1&pageSize=${this.props.pageSize}`;
    // this.setState({ loading: true });
    // let data = await fetch(url);
    // let parseData = await data.json();
    // // console.log(parseData);
    // this.setState({
    //   article: parseData.articles,
    //   totalResults: parseData.totalResults,
    //   loading: false,
    // });
    this.updateNews();
  }

  handlePreviousClick = async () => {
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey} &page=${
    //   this.state.page - 1
    // }&pageSize=${this.props.pageSize}`;
    // this.setState({ loading: true });
    // let data = await fetch(url);
    // let parseData = await data.json();
    // // console.log(parseData);
    // // this.setState({article: parseData.articles});
    // this.setState({
    //   page: this.state.page - 1,
    //   article: parseData.articles,
    //   loading: false,
    // });
    await this.setState({
      page: this.state.page - 1,
    });
    this.updateNews();
  };

  handleNextClick = async () => {
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey} &page=${
    //   this.state.page + 1
    // }&pageSize=${this.props.pageSize}`;
    // this.setState({ loading: true });
    // let data = await fetch(url);
    // let parseData = await data.json();
    // // console.log(parseData);
    // // this.setState({article: parseData.articles});
    // this.setState({
    //   page: this.state.page + 1,
    //   article: parseData.articles,
    //   loading: false,
    // });
    await this.setState({
      page: this.state.page + 1,
    });
    this.updateNews();
    // console.log(this.state.page)
  };

  render() {
    return (
      <>
        <h1 className="text-center" style={{ margin: "20px 0px" }}>
          NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)}{" "}
          Headlines
        </h1>
        {/* {this.state.loading && <Loader />} */}
        {/* <Loader /> */}
        <InfiniteScroll
          dataLength={this.state.article.length}
          next={this.fetchMoreData}
          hasMore={this.state.totalResults !== this.state.article.length}
          loader={<Loader />}
        >
          <div className="container my-3">
            <div className="row">
              {this.state.article.map((element) => {
                return (
                  <div key={element.url} className="col-md-4 my-3">
                    <NewsItem
                      title={element.title ? element.title : ""}
                      description={
                        element.description ? element.description : ""
                      }
                      imageUrl={
                        element.urlToImage
                          ? element.urlToImage
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSADPzrYm_hQg2XMNc_9KTr9Axmn35s0DbsIQ&usqp=CAU"
                      }
                      newsUrl={element.url}
                      author={element.author ? element.author : "unKnown"}
                      date={
                        element.publishedAt ? element.publishedAt : "unKnown"
                      }
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
  }
}

export default News;
