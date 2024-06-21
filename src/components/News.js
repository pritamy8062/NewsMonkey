import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import axios from "axios";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://gnews.io/api/v4/top-headlines?country=${props.country}&category=${props.category}&token=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;

    try {
      setLoading(true);
      const response = await axios.get(url);
      props.setProgress(30);
      const parsedData = response.data;
      props.setProgress(70);
      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalResults);
      setLoading(false);
      props.setProgress(100);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      props.setProgress(100);
    }
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
    // eslint-disable-next-line
  }, [page]);

  const handlePreviousClick = () => {
    setPage(page - 1);
  };

  const handleNextClick = () => {
    setPage(page + 1);
  };

  return (
    <>
      <h1
        className="text-center"
        style={{ margin: "35px 0px", marginTop: "90px" }}
      >
        NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      {loading && <Spinner />}
      <div className="container">
        <div className="row">
          {articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title : ""}
                  description={element.description ? element.description : ""}
                  imageUrl={element.image}
                  newsUrl={element.url}
                  author={element.source.name}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="container d-flex justify-content-between"
        style={{ marginBottom: "50px" }}
      >
        <button
          disabled={page <= 1}
          type="button"
          className="btn btn-dark"
          onClick={handlePreviousClick}
        >
          &larr; Previous
        </button>
        <button
          disabled={page + 1 > Math.ceil(totalResults / props.pageSize)}
          type="button"
          className="btn btn-dark"
          onClick={handleNextClick}
        >
          Next &rarr;
        </button>
      </div>
    </>
  );
};

News.defaultProps = {
  country: "us",
  pageSize: 8,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
  setProgress: PropTypes.func.isRequired,
};

export default News;
