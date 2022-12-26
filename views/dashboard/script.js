async function getConv() {

    const response = await fetch('/conv');
    const data = await response.json();
    console.log(data);
    const users = new Map();
    for (const conv of data) {
      const [creatorId, participantId] = [conv.creator, conv.participant];
      if (!users.has(creatorId)) {
        const userResponse = await fetch('/infos/ui', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: creatorId
          })
        });
        const userData = await userResponse.json();
        users.set(creatorId, userData);
      }
      if (!users.has(participantId)) {
        const userResponse = await fetch('/infos/ui', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: participantId
          })
        });
        const userData = await userResponse.json();
        users.set(participantId, userData);
      }
    }
  
    for (const conv of data) {
      const convElement = document.createElement('div');
      convElement.classList.add('conversation');
      convElement.setAttribute('id', conv._id);
      convElement.style.animationDelay = `${data.indexOf(conv) * 0.2}s`;
  
      let userId, user;
      if (localStorage.getItem('id') == conv.participant) {
        userId = conv.creator;
      } else {
        userId = conv.participant;
      }
      user = users.get(userId);
  
      try {
        const value = await getLast(conv._id);
        console.log(value);
        convElement.innerHTML = `
        <img class="profile-img" src="${user.avatar || "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"}" alt="default">
        <h2>${user.pseudo}<br><span>${value.text || 'Start a conversation'}</span></h2>
        <div class="right-infos"><p>${value.date}</p></div>
      `;
    } catch {
      convElement.innerHTML = `
        <img class="profile-img" src="${user.avatar || "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"}" alt="default">
        <h2>${user.pseudo}<br><span>Start a conversation</span></h2>
      `;
    }

    document.querySelector('.conversations').appendChild(convElement);
  }

  loadMessages();
}
  

const getLast = (parameter) => {
    return new Promise((resolve, reject) => {
      fetch('/messages/last', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          convId: `${parameter}`
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data != '') {
          resolve({text: (data[0].text).substring(0, 48) , date: (data[0].createdAt).substring(11, 16)});
        } else {
          reject(new Error('No messages found'));
        }
      })
    });
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
        if (!data.error) {
            document.querySelector('.conversations').innerHTML = ''
            getConv()
        } else {
            alert(data.error)
        }
    })
}

function getInfos () {
    fetch('/infos')
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('id', data.id)
        document.querySelector('.personnal-avatar').src = data.avatar || "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
        localStorage.setItem('pseudo', data.pseudo)
        document.querySelector('.personnal-pseudo').innerHTML = `${data.pseudo}<br><span class="email">${data.email}</span>`
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
                data.reverse().forEach(element => {
                    let message = document.createElement('div');
                    message.innerHTML = `
                        <p title='${(element.createdAt).substring(0, 10)}'>${element.text}</p>
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

function send() {
    let element = document.querySelector('.send-message');
    element.dispatchEvent(new KeyboardEvent('keyup', {'key': 'Enter'}));
}
let input = document.querySelector('.send-message')
input.addEventListener('keyup', (e) => {
    if (document.querySelector('.send-message').value == '') return
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
            document.querySelector('.send-message').value = ''
        })
    }
})


function contentClose() {
    document.querySelector('.content').classList.add('goodbye-section')
    document.querySelector('.content').classList.remove('active-section')
    localStorage.removeItem('convId')
}

function logout() {
    localStorage.clear()
    window.location.href = '/logout'
}

function loadsettings() {
    document.querySelector('.avatar-setting').src = localStorage.getItem('avatar') || "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
    document.querySelector('.username-setting').value = localStorage.getItem('pseudo')
    document.querySelector('.setting').classList.add('active-section')
}

document.querySelector('.edit-button').addEventListener('click', () => {
    document.querySelector('.username-setting').removeAttribute('disabled')
    document.querySelector('.username-setting').focus()
    document.querySelector('.edit-button').style.display = 'none'
})

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account ?')) {
        fetch('/signup', {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                logout()
            } else {
                alert(data.error)
            }
        })
    }
}