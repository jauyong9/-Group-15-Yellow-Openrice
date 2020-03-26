// When the page load
function init() {
  $("#loginForm").hide();
  $("#registerForm").hide();
}

// When user clicks the login button in the page
function login() {
  $("#loginForm").fadeIn();
}
// Clost the login form
function closeLoginForm() {
  $("#loginForm").fadeOut();
  $("#loginEmail").val('');
  $("#loginPassword").val('');
}

// Close the register form
function closeRegisterForm() {
  $("#registerForm").fadeOut();
}

// When user clicks the login button in the login form.
function loginSubmit(e) {
  e.submit();
  closeLoginForm();
}




// When user clicks the register button in the page
function register() {
  $("#registerForm").fadeIn();
}


// When user clicks the register button in the login form.
function registerSubmit(e) {
  if ($("#registerPassword").val() != $("#registerRePassword").val()) {
    alert('Two Password Must Be Equal');
    return false;
  }
  else {
    closeRegisterForm();
    return true;
  }

}


// When user clicks outside the login/register form
$(document).mouseup(function(e)
{
    var container = $("#loginForm");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
        closeLoginForm();
    }

    var container = $("#registerForm");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
        closeRegisterForm();
    }
});
