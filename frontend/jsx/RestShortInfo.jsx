/*
  class RestShortInfo
  This class is the restaurant short information shown in the home page about the restaurant
*/

class RestShortInfo extends React.Component {
  constructor(props) {
    super(props);
    this.toRestaurant = this.toRestaurant.bind(this);
    this.select = this.select.bind(this);
  }
  // Handle page change to restaurant detail
  toRestaurant() {
    this.props.handleChangePage('Restaurant', this.props.rest.restId);
  }
  // Zoom map to the selected restaurant, and show buttons for 'show direction' and 'show details'
  select() {
    if (this.props.selected) { // deselect
      this.props.handleChangeMapPos(0, 0, 0)
      this.props.handleChangeSelectedRest(undefined);
    }
    else {
      this.props.handleChangeMapPos(this.props.rest.longitude, this.props.rest.latitude, 20)
      this.props.handleChangeSelectedRest(this.props.rest);
    }

  }
  // Structure of a list item of a single restaurant. Show buttons for moreinfo and showDir on select
  render() {
    const style = this.props.selected ? {width: '100%', backgroundColor: 'yellow'} : {width: '100%'}
    const showDir = <button className="btn btn-warning" onClick={this.props.handleShowDir}>Show Direction</button>
    const moreInfo = <button className="btn btn-warning" onClick={this.toRestaurant}>View More</button>
    return (
      <div className="btn" onClick={this.select} style={style}>
        <p>{this.props.rest.name}</p>
        <p>{this.props.rest.distance}M</p>
        <p>
          <img src="../images/view.png" style={{width: 25, height: 25}}/> &nbsp;
          {this.props.rest.views} &nbsp;
          <img src="../images/like.png" style={{width: 25, height: 25}}/> &nbsp;
          {this.props.rest.likes.length} &nbsp;
          <img src="../images/dislike.png" style={{width: 25, height: 25}}/> &nbsp;
          {this.props.rest.dislikes.length} &nbsp;
        </p>
        <p>
          {this.props.selected && showDir}
          {this.props.selected && ' '}
          {this.props.selected && moreInfo}
        </p>
      </div>
    );
  }
}
