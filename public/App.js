class App extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      data: [],
      newData: [],
      optionsButton: false,
      sortType: "Sort",
      page: 1,
      isFetching: false,
      endOfCatalogue: false,
    };
    this.state = this.initialState;
  }

  //Get data
  getData = ({ page, sortBy, status }) => {
    fetch(
      `http://localhost:3000/api/products?_sort=${sortBy}&_page=${page}&_limit=15}`
    )
      .then(response => response.json())
      .then(res => {
        if (status === 1) {
          this.setState({
            data: res,
            page: this.state.page + 1
          });
        } else if (status === 2) {
          this.setState({
            newData: res,
            page: this.state.page + 1
          });
        }
      })
      .catch(error => error);
  };

  //Display gird
  displayGrid = data => {
    const result = data.map(product => this.gridUnits(product));
    return result;
  };

  //Grid units
  gridUnits = product => {
    return (
      <div className='gridUnit' key={product.id}>
        <div className='face' style={{ fontSize: product.size }}>
          <div>{product.face}</div>
        </div>
        <div className='productDetails'>
          <div className='size'>Size: {product.size}</div>
          <div className='price'>Price: ${product.price}</div>
          <div className='date'>Date: {this.displayDate(product.date)}</div>
        </div>
      </div>
    );
  };

  //Display date
  displayDate = date => {
    const dateNow = new Date();
    const faceDate = new Date(date);
    const finalYear = dateNow.getFullYear() - faceDate.getFullYear();
    const finalMonth = dateNow.getMonth() - faceDate.getMonth();
    const finalDate = dateNow.getDate() - faceDate.getDate();
    const finalHours = dateNow.getHours() - faceDate.getHours();

    if (finalYear > 0 || finalMonth > 0 || finalDate > 7) {
      return `${faceDate}`;
    } else if (finalDate === 1) {
      return `${finalDate} Day ago`;
    } else if (finalDate !== 0) {
      return `${finalDate} Days ago`;
    } else if (finalDate === 0) {
      if (finalHours === 0) {
        return `< 1 hour ago`;
      } else if (finalHours === 1) {
        return `${finalHours} hour ago`;
      } else {
        return `${finalHours} hours ago`;
      }
    }
  };

  //Handle sortButton
  handleSortButton = () => {
    return this.setState({
      optionsButton: !this.state.optionsButton
    });
  };

  //Handle handleSort
  handleSort = sortType => {
    const sortParam = sortType.toLowerCase();
    const params = { page: 1, sortBy: sortParam };
    this.getData(params);
    return this.setState({
      sortType: sortType,
      optionsButton: !this.state.optionsButton
    });
  };

  // Observe page when scrolling using intersection observer
  observePageOnscroll = () => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0
    };
    const observer = new IntersectionObserver(entries => {
      console.log("herere +++");
      if (entries[0].isIntersecting && this.state.data.length !== 0) {
        if (this.state.isFetching) {
          setTimeout(() => {
            this.updateData();
          }, 3000);
        } else {
          this.updateData();
        }
      }
    }, options);
    observer.observe(document.querySelector(".footer"));
  };

  //Update data when scrolling
  updateData = async () => {
    this.setState(state => ({
      ...state,
      data: [...state.data, ...state.newData],
      newData: []
    }));

    this.setState(prevState => {
      return {
        ...prevState,
        isFetching: true
      };
    });

    fetch(
      `http://localhost:3000/api/products?_sort=${this.state.sortType}&_page=${this.state.page}&_limit=15`
    )
      .then(response => response.json())
      .then(response => {
        if (response.length === 0) {
          this.setState({
            endOfCatalogue: true
          });
        }
        this.setState(prevState => ({
          ...prevState,
          isFetching: false,
          newData: response,
          page: this.state.page + 1
        }));
      });
  };

  componentDidMount() {
    const params = { page: 1, status: 1 };
    const params2 = { page: 2, status: 2 };
    this.getData(params2);
    this.getData(params);
    this.observePageOnscroll();
  }

  render() {
    const { data, optionsButton, sortType, endOfCatalogue } = this.state;
    console.log("this.state++++++", this.state);
    return (
      <div>
        <div className='dropDown'>
          <button onClick={this.handleSortButton} className='sortButton'>
            {sortType}
          </button>
          <div
            id='sortOptions'
            className={optionsButton ? "displaySortOptions" : "hideSortOptions"}
          >
            <ul>
              <li
                onClick={() => {
                  this.handleSort("Size");
                }}
              >
                Size
              </li>
              <li
                onClick={() => {
                  this.handleSort("Price");
                }}
              >
                Price
              </li>
              <li
                onClick={() => {
                  this.handleSort("Id");
                }}
              >
                Id
              </li>
            </ul>
          </div>
        </div>
        {data.length !== 0 ? (
            <div className='productsGrid'>{this.displayGrid(data)}</div>
          ) : (
            <h1 className='glow'>loading ..</h1>
          )}
        <div className='footer'>{endOfCatalogue ? "~ end of catalogue ~" : ""}</div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
