function validateCreateForm() {
    var name = document.forms["createuser"]["name"].value;
    var pass = document.forms["createuser"]["password"].value;
    var email = document.forms["createuser"]["email"].value;
    if (name == "" || pass == "" || !email ){
        alert("All fields must be filled out");
        return false;
    }
}

function validateLoginForm() {
    var name = document.forms["loginForm"]["name"].value;
    var pass = document.forms["loginForm"]["password"].value;
    if (name == "" || pass == ""){
        alert("All fields must be filled out");
        return false;
    }
    
}

