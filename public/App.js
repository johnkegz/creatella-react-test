
class App extends React.Component{
    constructor(props){
        super(props)
        this.initialState = {
            data: [],
            optionsButton: false,
            sortType: "Sort"
        }
        this.state=this.initialState
    }

    //Get data
    getData = ({page, sortBy}) => {
        fetch(`http://localhost:3000/api/products?_sort=${sortBy}&_page=${page}&_limit=15}`)
          .then(response => response.json())
          .then(data => {
            this.setState({
              data: data
                })
            }
          );
      }

    //display gird
    displayGrid = (data) => {
        const result = data.map(product => this.gridUnits(product)); 
        return result;
      }

    //Grid units
    gridUnits = (product) => {
        return (
        <div className="gridUnit" key={product.id}>
            <div>
                <div>{product.face}</div>
                <div>{product.size}</div>
                <div>{product.price}</div>
                <div>"Product date"</div>
            </div>
        </div>
        )
    }

    //handle sortButton
    handleSortButton = () => {
      return this.setState({
                optionsButton: !this.state.optionsButton,
                })
    }

    //handle handleSort
    handleSort = (sortType) => {
      const sortParam = sortType.toLowerCase()
      const params = {page:1, sortBy:sortParam};
        this.getData(params)
      return this.setState({
        sortType: sortType,
        optionsButton: !this.state.optionsButton,
        })
    }
    
    componentDidMount() {
        const params = {page:10};
        this.getData(params)
    }
    render(){
        const { data, optionsButton, sortType } = this.state;
        return (
            <div>
            <div className="dropDown">
            <button onClick={this.handleSortButton} className="sortButton">{sortType}</button>
                <div id="sortOptions" className={optionsButton ? "displaySortOptions" : "hideSortOptions"}>
                <ul>
                    <li onClick={() => {this.handleSort("Size")}}>Size</li>
                    <li onClick={() => {this.handleSort("Price")}}>Price</li>
                    <li onClick={() => {this.handleSort("Id")}}>Id</li>
                </ul>
                </div>
            </div>
            <div className="productsGrid">
              {this.displayGrid(data)}
            </div>
            <footer>
              <p>Footer</p>
            </footer>
            </div>
          );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
