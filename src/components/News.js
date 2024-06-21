import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

const News = (props) => {
  // State variables to manage articles, loading state, current page, and total results
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Function to fetch news data from the API and update state
  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;

    setLoading(true);
    let data = await fetch(url); // Fetching data from the API
    props.setProgress(30);
    let parsedData = await data.json();
    axios
      .get(
        `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`
      )
      .then((response) => console.log(response.data))
      .catch((error) => console.error("Error:", error));
    props.setProgress(70);
    setArticles(parsedData.articles); // Updating articles state
    setTotalResults(parsedData.totalResults); // Updating totalResults state
    setLoading(false);
    setLoading(false);
    props.setProgress(100);
  };
  // useEffect hook to update news whenever the component mounts or page changes
  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
    // eslint-disable-next-line
  }, [page]);

  // Function to handle clicking the "Previous" button
  const handlePreviousClick = async () => {
    setPage(page - 1); // Decrementing the page number
  };

  // Function to handle clicking the "Next" button
  const handleNextClick = async () => {
    setPage(page + 1); // Incrementing the page number
  };
  console.log(articles);
  return (
    <>
      <h1
        className="text-center"
        style={{ margin: "35px 0px", marginTop: "90px" }}
      >
        NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      {loading && <Spinner />}
      {/* Displaying spinner if loading */}
      <div className="container">
        <div className="row">
          {/* Mapping through articles and rendering NewsItem components */}
          {articles?.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title : ""}
                  description={element.description ? element.description : ""}
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
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
        {/* Previous button disabled if on the first page */}
        <button
          disabled={page <= 1}
          type="button"
          className="btn btn-dark"
          onClick={handlePreviousClick}
        >
          &larr; Previous
        </button>
        {/* Next button disabled if on the last page */}
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

// Default props for the News component
News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};

// PropTypes for type-checking
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
