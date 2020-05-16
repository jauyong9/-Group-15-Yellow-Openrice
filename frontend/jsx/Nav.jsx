/*
  This class is the navigation bar. It handles change page request
*/

class Nav extends React.Component{
  constructor(props) {
    super(props);
    this.state ={username: props.username, userType: props.userType};
    // Test
    console.log(this.state);
    this.LogoutUser = this.LogoutUser.bind(this);
    this.ToProfile = this.ToProfile.bind(this);
    this.ToFavourite = this.ToFavourite.bind(this);
    this.ToHome = this.ToHome.bind(this);
    this.ToManageRest = this.ToManageRest.bind(this);
    this.ToManageUser = this.ToManageUser.bind(this);
    this.ClickLogin = this.ClickLogin.bind(this);
    this.ClickRegister = this.ClickRegister.bind(this);
  }
  LogoutUser(){
    this.props.handleChangeToken('');
    this.setState({username: null });
    this.ToHome();
  }

  SetUserName(name){
    this.setState({username: name});
  }
  ToProfile() {
    this.props.handleChangePage('Profile');
  }
  ToFavourite() {
    this.props.handleChangePage('Favourite');
  }
  ToHome() {
    this.props.handleChangePage('Home');
  }
  ToManageRest(){
    this.props.handleChangePage('ManageRest');
  }
  ToManageUser(){
    this.props.handleChangePage('ManageUser');
  }
  LoginUser(){
    const typeStyle = {
      color: '#9b870c'
    };
    if(this.props.username && this.props.userType=='admin'){
      return (

            <div>
            <h4 className="d-inline navbar-brand"><span style={typeStyle}>({this.props.userType})</span></h4>
            <a className="btn navbar-brand mx-2" href="javascript:;" onClick={this.ToManageRest}>Manage Restaurant</a>
            <a className="btn navbar-brand mx-2" href="javascript:;" onClick={this.ToManageUser}>Manage User</a>
            <a className="btn navbar-brand mx-2" href="javascript:;" onClick={this.LogoutUser}>Logout</a>
         </div>
        );
    }else if(this.props.username){
      return (
        <div className="dropdown">
          <button className="btn dropdown-toggle nav-btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <img src={this.props.iconUrl} className="avatar" />
            <h4 className="d-inline navbar-brand">{this.props.username} <span style={typeStyle}>({this.props.userType})</span></h4>
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item" href="javascript:;" onClick={this.ToProfile}>Profile</a>
            <a className="dropdown-item" href="javascript:;" onClick={this.ToFavourite}>Favourtites</a>
            <a className="dropdown-item" href="javascript:;" onClick={this.LogoutUser}>Logout</a>
          </div>
        </div>);
    }
    return <a className="btn navbar-brand mx-2" onClick={this.ClickLogin}><span className="nav-btn">Login</span></a>;
  }

ClickLogin() {
$("#loginForm").fadeIn();
this.props.handleToggleMask();
}
ClickRegister() {
$("#registerForm").fadeIn();
this.props.handleToggleMask();
}
  ShowRegister(){
    if(this.props.username){
      return ;
    }
    return <a className="btn navbar-brand mx-2" onClick={this.ClickRegister}><span className="nav-btn">Register</span></a>;
  }
  render(){
    return(
      <nav className="container navbar navbar-light bg-light justify-content-between nav">
        <h4><a className="btn navbar-brand mx-2" onClick={this.ToHome}><span className="nav-btn">Home</span></a></h4>

        <h4>{this.ShowRegister()}</h4>
        <h4>{this.LoginUser()}</h4>

      </nav>
    )
  }
}
