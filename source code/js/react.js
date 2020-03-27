class Nav extends React.Component{
  constructor(props) {
    super(props);
    this.state ={username: props.username};
    this.LogoutUser = this.LogoutUser.bind(this);
  }
  LogoutUser(){
    this.setState({username: null});
  }
  SetUserName(name){
    this.setState({username: name});
  }
  LoginUser(){
    if(this.state.username){
      return (
        <div className="dropdown">
          <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <h4 className="d-inline navbar-brand">{this.state.username}</h4>
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item" href="#">Profile</a>
            <a className="dropdown-item" href="#" onClick={this.LogoutUser}>Logout</a>
          </div>
        </div>);
    }
    return <a className="navbar-brand mx-2" onClick={login}>Login</a>;
  }
  ShowRegister(){
    if(this.state.username){
      return ;
    }
    return <a className="navbar-brand mx-2" onClick={register}>Register</a>;
  }
  render(){
    return(
      <nav className="container navbar navbar-light bg-light justify-content-between">
        <h4><a className="navbar-brand mx-2">Home</a></h4>
        <h4>{this.ShowRegister()}</h4>
        <h4>{this.LoginUser()}</h4>
        <form className="form-inline">
          <input className="form-control" type="search" placeholder="Search" aria-label="Search"/>
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit"><i className="fa fa-search"></i></button>
        </form>
      </nav>
    )
  }
}

class RegisterForm extends React.Component{
  render() {
    return (
      <div className="form" id="registerForm">
        <img src="../images/restaurant2.jpg" style={{height: '160px', width: '100%', paddingBottom: '20px', objectFit: 'cover'}} />
        <section id="inner-wrapper" className="login">
          <article>
            <form id="loginSubmitForm" onsubmit="return registerSubmit(this);">
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon"><i className="fa fa-user fa-fw"> </i></span>
                  <input id="registerName" type="text" className="form-control" placeholder="Nick Name" required />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon"><i className="fa fa-envelope fa-fw"> </i></span>
                  <input id="registerEmail" type="email" className="form-control" placeholder="Email Address" required />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon"><i className="fa fa-key fa-fw"> </i></span>
                  <input id="registerPassword" type="password" className="form-control" placeholder="Password" required />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon"><i className="fa fa-key fa-fw"> </i></span>
                  <input id="registerRePassword" type="password" className="form-control" placeholder="Enter Password Again" required />
                </div>
              </div>
              <button type="submit" className="btn btn-warning btn-block">Register</button>
            </form>
          </article>
        </section>
      </div>
    );
  }
}
class LoginForm extends React.Component{
  render() {
    return (
      <div className="form" id="loginForm">
        <img src="../images/restaurant.jpg" style={{height: '160px', width: '100%', paddingBottom: '20px', objectFit: 'cover'}} />
        <section id="inner-wrapper" className="login">
          <article>
            <form id="loginSubmitForm" onsubmit="loginSubmit(this);">
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon"><i className="fa fa-envelope fa-fw"> </i></span>
                  <input id="loginEmail" type="email" className="form-control" placeholder="Email Address" required />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon"><i className="fa fa-key fa-fw"> </i></span>
                  <input id="loginPassword" type="password" className="form-control" placeholder="Password" required />
                </div>
              </div>
              <button type="submit" className="btn btn-warning btn-block">Login</button>
              <div id="my-signin2" />
            </form>
          </article>
        </section>
      </div>
    );
  }
}

function CloesestRestaurant() {
  return (
    <section id="closet-restaurant" className="col-sm col-md-5 col-lg-4 card p-3 mt-3">
      <h2 className="text-left px-4 ">Closest Restaurant</h2>
      <div className="table-responsive">
        <table id="table-closet-restaurant" className="table table-striped table-bordered table-hover mt-4">
        </table>
      </div>
    </section>
  );
}

function Map() {
  return (
    <section id="map" className="col-sm col-md-7 col-lg-8 card p-3 mt-3">
    </section>
  );
}

function Home() {
  return (
      <div className="row">
        <Map />
        <CloesestRestaurant />
      </div>
    );
}

function Footer() {
  return (
    <footer className="text-center card mt-3">
      <p>Created by: Group15</p>
    </footer>
  );
}

function Content() {
  return (
    <div className="container">
      <Home />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <div>
      <Nav username='' ref={(element) => {window.helloComponent = element}}/>
      <Content />
      <LoginForm />
      <RegisterForm />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
