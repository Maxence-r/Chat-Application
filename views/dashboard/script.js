function getConv() {
    fetch('/conv')
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
}

getConv()