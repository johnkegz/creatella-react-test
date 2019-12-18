
class App extends React.Component{
    constructor(props){
        super(props)
        this.state={
            data: [],
        }
    }

    //Get data
    getData = () => {
        fetch("http://localhost:3000/api/products?_page=10&_limit=15")
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
        <div className="gridUnit">
            <div>
                <div>{product.face}</div>
                <div>{product.size}</div>
                <div>{product.price}</div>
                <div>"Product date"</div>
            </div>
        </div>
        )
    }
    
    componentDidMount() {
        this.getData()
    }
    render(){
        const { data } = this.state;
        return (
            <div>
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

ReactDOM.render(<App />, document.getElementById('root'))