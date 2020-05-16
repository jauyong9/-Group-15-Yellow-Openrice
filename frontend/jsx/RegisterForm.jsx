/*
  class RegisterForm
  This class is the register form page. It handles login request.
*/

class RegisterForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      nameError: '',
      emailError: '',
      passwordError: '',
      againPasswordError: '',
      name: '',
      email: '',
      password: '',
      againPassword: '',
      registerResult: ''
    };
    this.handleRegister = this.handleRegister.bind(this);
    this.generateError = this.generateError.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  isEmail(mail) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return mail.match(mailformat) != null;
  }

  generateError() {
    let hasError = false;

    if (this.state.name == '') {
      this.setState({nameError: 'Nick name must not be empty'});
      hasError = true;
    }
    else {
      this.setState({nameError: ''});
    }

    if (!this.isEmail(this.state.email)) {
      this.setState({emailError: 'Email format incorrect!'});
      hasError = true;
    }
    else {
      this.setState({emailError: ''});
    }

    if (this.state.password != this.state.againPassword) {
      this.setState({
        passwordError: 'Two passwords must be equal.',
        againPasswordError: 'Two passwords must be equal.'
      });
      hasError = true;
    }
    else if (this.state.password == '') {
      this.setState({
        passwordError: 'Password cannot be empty.',
        againPasswordError: 'Password cannot be empty.'
      });
      hasError = true;
    }
    else {
      this.setState({
        passwordError: '',
        againPasswordError: ''
      });
    }

    return hasError;
  }

  handleRegister() {
    const hasError = this.generateError();
    if (hasError) {
        $("#registerForm").effect( "shake", { direction: "right", times: 4, distance: 10}, 500 );
    }
    else {
      // Simple POST request with a JSON body using fetch
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({  email: this.state.email,
                                  name: this.state.name,
                                  password: this.state.password})
      };

      fetch(this.props.URL + '/register', requestOptions)
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
                this.props.handleChangeToken(data.token);
                $("#registerForm").slideUp();
                this.props.handleToggleMask();
                const msg = `Thank you for your registration. An email has been sent to ${this.state.email}. Please click the link in the email to activate your account`;
                this.props.handlePopupMsg(msg);
                this.setState({
                  nameError: '',
                  emailError: '',
                  passwordError: '',
                  againPasswordError: '',
                  name: '',
                  email: '',
                  password: '',
                  againPassword: '',
                  registerResult: ''
                });
            }
            else {
                $("#registerForm").effect( "shake", { direction: "right", times: 4, distance: 10}, 500 );
                this.setState({emailError: data.message});
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
      <div className="form" id="registerForm">
        <img src="../images/restaurant2.jpg" style={{height: '160px', width: '100%', paddingBottom: '20px', objectFit: 'cover'}} />
        <section id="inner-wrapper" className="login">
          <article>
            <form id="loginSubmitForm">
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon"><i className="fa fa-user fa-fw"> </i></span>
                  <input
                    id="registerName"
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Nick Name"
                    onChange={this.handleInputChange}
                    value={this.state.name}
                  />
                </div>
                <p style={inputError}>{this.state.nameError}</p>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon"><i className="fa fa-envelope fa-fw"> </i></span>
                  <input
                    id="registerEmail"
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
                    id="registerPassword"
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
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon"><i className="fa fa-key fa-fw"> </i></span>
                  <input
                    id="registerRePassword"
                    type="password"
                    name="againPassword"
                    className="form-control"
                    placeholder="Enter Password Again"
                    onChange={this.handleInputChange}
                    value={this.state.againPassword}
                  />
                </div>
              </div>
            </form>
            <button className="btn btn-warning btn-block" onClick={this.handleRegister}>Register</button>
            <p style={this.state.registerResultStyle}>{this.state.registerResult}</p>
          </article>
        </section>
      </div>
    );
  }
}
