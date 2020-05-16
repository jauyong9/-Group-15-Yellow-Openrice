/*
  This class is the content page. It decides which page should display.
*/
    class Content extends React.Component {
      constructor(props) {
        super(props);
    this.getPage = this.getPage.bind(this);
      }

      getPage() {

        if (this.props.page.toLowerCase() == 'home') {
          return (<Home URL={this.props.URL} handleChangePage={this.props.handleChangePage}/>);
        }
        else if (this.props.page.toLowerCase() == 'profile') {
          return (<Profile user={this.props.user} URL={this.props.URL} token={this.props.token} reloadUser={this.props.reloadUser}
                        handlePopupMsg={this.handlePopupMsg}/>);
        }
        else if (this.props.page.toLowerCase() == 'favourite') {
          return (<Favourite user={this.props.user} URL={this.props.URL} token={this.props.token} handleChangePage={this.props.handleChangePage}
                        handleChangePage={this.props.handleChangePage}
                        handlePopupMsg={this.handlePopupMsg}/>);
        }
        else if (this.props.page.toLowerCase() == 'restaurant') {
          return (<Restaurant restId={this.props.parameter} token={this.props.token} URL={this.props.URL} user={this.props.user} reloadUser={this.props.reloadUser}/>);
        }
        else if (this.props.page.toLowerCase() == 'manageuser') {
          return (<ManageUser token={this.props.token} URL={this.props.URL}  handleChangePage={this.props.handleChangePage}/>);
        }
        else if (this.props.page.toLowerCase() == 'managerest') {
          return (<ManageRest token={this.props.token} URL={this.props.URL} />);
        }
        else {
          return (<div></div>);
        }

      }

      render() {
        return (
          <div className="container">
            {this.getPage()}
            <Footer />
          </div>
        );
      }

    }
