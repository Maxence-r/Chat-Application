document.querySelectorAll('p').forEach(function (p) {
    p.addEventListener('click', function () {
        document.querySelector('.indicator').classList.toggle('activeslide');
        document.querySelector('.indicator').classList.toggle('goodbyslide');
        document.querySelector('.signup').classList.toggle('active');
        document.querySelector('.signup').classList.toggle('goodbye');
        document.querySelector('#login').classList.toggle('active');
        document.querySelector('#login').classList.toggle('goodbye');
    });
});

function signup() {
    document.getElementById('signup').classList.add('button--loading-dark')
    let pseudo = document.getElementById('username-signup').value;
    let email = document.getElementById('email-signup').value;
    let password = document.getElementById('password-signup').value;
    let avatar = document.getElementById('avatar-signup').value;
    let data = {
        pseudo: pseudo,
        email: email,
        password: password,
        avatar: avatar
    };
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(function (response) {
        document.getElementById('signup').classList.remove('button--loading-dark')
        if (response.status == 201) {
        document.querySelector('.indicator').classList.toggle('activeslide');
        document.querySelector('.indicator').classList.toggle('goodbyslide');
        document.querySelector('.signup').classList.toggle('active');
        document.querySelector('.signup').classList.toggle('goodbye');
        document.querySelector('#login').classList.toggle('active');
        document.querySelector('#login').classList.toggle('goodbye');
        } else {
            response.json().then(function (data) {
            alert(`Error: ${data.error}`);
            document.getElementById('signup').classList.remove('button--loading-dark')
        }
        )}
    })
}

function login() {
    document.getElementById('login').classList.add('button--loading')
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let data = {
        email: email,
        password: password
    };
    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(function (response) {
        if (response.status == 200) {
            response.json().then(function (data){
                document.querySelector('.body').classList.add('slidedownbody');
                setTimeout(function () {
                window.location.href = '/chat';
                }, 1000);
            })
        } else {
            response.json().then(function (data) {
                alert(`Error: ${data.error}`);
                document.getElementById('login').classList.remove('button--loading')
            }
            )}
    })
}