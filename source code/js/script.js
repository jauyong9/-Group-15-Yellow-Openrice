// When the page load
function init() {
  $("#loginForm").hide();
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

// When user clicks outside the login form
$(document).mouseup(function(e)
{
    var container = $("#loginForm");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
        closeLoginForm();
    }
});

// When user clicks the login button in the login form.
function loginSubmit(e) {
  e.submit();
  closeLoginForm();
}
