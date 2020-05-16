/*
  This class is the login form page. It handles login request.
*/

class LoginForm extends React.Component{

  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.generateError = this.generateError.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      email: '',
      password: '',
      emailError: '',
      passwordError: ''
    };
  }

  isEmail(mail) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return mail.match(mailformat) != null;
  }

  generateError() {
    let hasError = false;

    if (!this.isEmail(this.state.email)) {
      this.setState({emailError: 'Email format incorrect!'});
      hasError = true;
    }
    else {
      this.setState({emailError: ''});
    }

    if (this.state.password == '') {
      this.setState({
        passwordError: 'Password cannot be empty.'
      });
      hasError = true;
    }
    else {
      this.setState({passwordError: ''});
    }

    return hasError;
  }

  handleLogin() {
    const hasError = this.generateError();
    if (hasError) {
        $("#loginForm").effect( "shake", { direction: "right", times: 4, distance: 10}, 500 );
    }
    else {
      // Simple POST request with a JSON body using fetch
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({  email: this.state.email,
                                  password: this.state.password})
      };

      fetch(this.props.URL + '/login', requestOptions)
          .then(response => response.json())
          .then(data => {
            let success = {
              color: 'green',
              paddingLeft: '20px'
            };
            let fail = {
              color: 'red',
              paddingLeft: '20px'
            };
            if (data.response == 'success') {
                $("#loginForm").fadeOut();
                this.props.handleChangeToken(data.token);
                this.props.handleToggleMask();
                this.setState({
                  password: '',
                  emailError: '',
                  passwordError: ''})
            }
            else {
                $("#loginForm").effect( "shake", { direction: "right", times: 4, distance: 10}, 500 );
                this.setState({passwordError: data.message});
            }
          });


    }
  }

  handleInputChange(e){
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
          [name]: value
      });
  }

  render() {
    let inputError = {
      fontSize: 'small',
      color: 'red',
      paddingLeft: '20px'
    };
    return (
      <div className="form" id="loginForm">
        <img src="../images/restaurant.jpg" style={{height: '160px', width: '100%', paddingBottom: '20px', objectFit: 'cover'}} />
        <section id="inner-wrapper" className="login">
          <article>
            <form id="loginSubmitForm">
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon"><i className="fa fa-envelope fa-fw"> </i></span>
                  <input
                    type="text"
                    name="email"
                    className="form-control"
                    placeholder="Email Address"
                    onChange={this.handleInputChange}
                    value={this.state.email}
                  />
                </div>
                <p style={inputError}>{this.state.emailError}</p>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon"><i className="fa fa-key fa-fw"> </i></span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    onChange={this.handleInputChange}
                    value={this.state.password}
                  />
                </div>
                <p style={inputError}>{this.state.passwordError}</p>
              </div>
            </form>
            <button className="btn btn-warning btn-block" onClick={this.handleLogin}>Login</button>
          </article>
        </section>
      </div>
    );
  }

}
