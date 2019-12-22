
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
          )
      }

    //Display gird
    displayGrid = (data) => {
        const result = data.map(product => this.gridUnits(product)) 
        return result
      }

    //Display date
    displayDate = (date) =>{
      const dateNow = new Date()
      const faceDate = new Date(date)
      const finalYear = dateNow.getFullYear() - faceDate.getFullYear()
      const finalMonth = dateNow.getMonth() - faceDate.getMonth()
      const finalDate = dateNow.getDate() - faceDate.getDate()
      const finalHours = dateNow.getHours() - faceDate.getHours()

      if(finalYear > 0 || finalMonth > 0 || finalDate > 7){
        return `${faceDate}`
      }
      else if(finalDate === 1){
        return `${finalDate} Day ago`
      }
      else if(finalDate !== 0) {
        return `${finalDate} Days ago`
      }
      else if(finalDate === 0){
        if(finalHours === 0){
            return `< 1 hour ago`
        }
        else if(finalHours === 1){
          return `${finalHours} hour ago`
        }
        else{
          return `${finalHours} hours ago`
        }     
      }
    }

    //Grid units
    gridUnits = (product) => {
        return (
        <div className="gridUnit" key={product.id}>
                <div className="face" style={{fontSize: product.size}}>
                  <div>{product.face}</div>
                </div>
                <div className="productDetails">
                  <div className="size">Size: {product.size}</div>
                  <div className="price">Price: ${product.price}</div>
                  <div className="date">Date: {this.displayDate(product.date)}</div>
                </div>
        </div>
        )
    }

    //Handle sortButton
    handleSortButton = () => {
      return this.setState({
                optionsButton: !this.state.optionsButton,
                })
    }

    //Handle handleSort
    handleSort = (sortType) => {
      const sortParam = sortType.toLowerCase()
      const params = {page:1, sortBy:sortParam}
        this.getData(params)
      return this.setState({
        sortType: sortType,
        optionsButton: !this.state.optionsButton,
        })
    }
    
    componentDidMount() {
        const params = {page:10}
        this.getData(params)
    }

    render(){
        const { data, optionsButton, sortType } = this.state
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
          )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))
