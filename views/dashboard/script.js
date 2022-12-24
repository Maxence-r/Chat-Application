function getConv() {
    fetch('/conv')
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            let conv = document.createElement('div');
            conv.classList.add('conversation');
            if (localStorage.getItem('id') == element.participant) {
                fetch('/infos/ui', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: `${element.creator}`
                    })
                })
                .then(response => response.json())
                .then(data => {
                    conv.innerHTML = `
                    <img class="profile-img" src="${data.avatar}" alt="default">
                    <h2>${data.pseudo}<br><span>Last message here</span></h2>
                    <div class="right-infos"><p>9:34PM</p><div class="ping">3</div></div>
                    `
                })
            } else {
                fetch('/infos/ui', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: `${element.participant}`
                    })
                })
                .then(response => response.json())
                .then(data => {
                    conv.innerHTML = `
                    <img class="profile-img" src="${data.avatar || "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"}" alt="default">
                    <h2>${data.pseudo}<br><span>Last message here</span></h2>
                    <div class="right-infos"><p>9:34PM</p><div class="ping">3</div></div>
                    `
                })
            }
            conv.setAttribute('id', `${element._id}`)
            conv.style.animationDelay = `${data.indexOf(element) * 0.2}s`
            document.querySelector('.conversations').appendChild(conv);
        });
        loadMessages()
    })
}

getConv()

function newconv() {
    test = prompt("Participant name")
    fetch('/conv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            participantname: `${test}`
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
}

function getInfos () {
    fetch('/infos')
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('id', data.id)
        localStorage.setItem('pseudo', data.pseudo)
        localStorage.setItem('email', data.email)
    })
}

getInfos()


function loadMessages() {
document.querySelectorAll('.conversation').forEach(element => {
    element.addEventListener('click', () => {
        document.querySelector('.content').classList.add('active-section')
        document.querySelector('.content').classList.remove('goodbye-section')
        document.querySelector('.avatar').src = element.querySelector('.profile-img').src
        document.querySelector('.username').innerHTML = element.querySelector('h2').innerHTML
        fetch('/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    convId: `${element.id}`
                })
            })
            .then(response => response.json())
            .then(data => {
                document.querySelector('.messages').innerHTML = ''
                data.forEach(element => {
                    let message = document.createElement('div');
                    message.innerHTML = `
                        <p>${element.text}</p>
                    `
                    if (element.sender == localStorage.getItem('id')) {
                        message.classList.add('my-message')
                    } else {
                        message.classList.add('other-message')
                    }
                    document.querySelector('.messages').appendChild(message);
                })
                localStorage.setItem('convId', element.id)
                let div = document.querySelector(".messages");
                div.scrollTop = div.scrollHeight;
            })        
    })
})
}


let input = document.querySelector('.send-message')
input.addEventListener('keyup', (e) => {
    if (e.key == 'Enter') {
        fetch('/messages/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                convId: `${localStorage.getItem('convId')}`,
                text: `${document.querySelector('.send-message').value}`,
                sender: `${localStorage.getItem('id')}`
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
    }
})


function contentClose() {
    document.querySelector('.content').classList.add('goodbye-section')
    document.querySelector('.content').classList.remove('active-section')
}