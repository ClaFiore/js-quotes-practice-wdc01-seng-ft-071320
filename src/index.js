let url = 'http://localhost:3000/quotes?_embed=likes/'
let quoteUrl = 'http://localhost:3000/quotes/'
const quoteList = document.getElementById('quote-list')
const createQuoteForm = document.getElementById('new-quote-form')
const likesUrl = 'http://localhost:3000/likes'
const likesQuoteIdUrl = 'http://localhost:3000/likes?quoteId='
let likesCount = 0

fetch(url)
.then(res => res.json())
.then(quotesArray => queryArray(quotesArray))

function queryArray(quotesArray){
    quotesArray.forEach(quote => displayQuote(quote))
}

function displayQuote(quote){
    
    const quoteLi = document.createElement('li')
    quoteLi.className = 'quote-card'
        const blockQuote = document.createElement('blockquote')
        blockQuote.className = 'blockquote'
        quoteLi.append(blockQuote)
            const p = document.createElement('p')
            p.className = 'mb-0'
            p.innerText = quote.quote
                const footer = document.createElement('footer')
                footer.className = 'blockquote-footer'
                footer.innerText =  quote.author
                    const br = document.createElement('br')
                        const likesBtn = document.createElement('button')
                        likesBtn.className = 'btn-success'
                        likesBtn.innerText = 'Likes: ' 
                            const likeSpan = document.createElement('span')
                            getLikesAmount(quote, likeSpan)
                            // likeSpan.innerText = likesCount
                            likesBtn.append(likeSpan)

                                const delBtn = document.createElement('button')
                                delBtn.className = 'btn-danger'
                                delBtn.innerText = 'Delete'
                                    const editBtn = document.createElement('button')
                                    editBtn.className = "edit-quote"
                                    editBtn.innerText = "Edit"
                                    
    blockQuote.append(p, footer, br, likesBtn, delBtn, editBtn)
    quoteList.append(quoteLi)
    
    editBtn.addEventListener('click', () => editQuoteBtn(quote, blockQuote, p, footer))

    likesBtn.addEventListener('click', () => likeFunc(quote, likeSpan))
    
    delBtn.addEventListener('click', () =>{
                fetch(quoteUrl+quote.id, {
                    method: 'DELETE'
                })
                .then(() => quoteLi.remove())
        })        
}

createQuoteForm.addEventListener('submit', () =>{
    event.preventDefault()
    const quote = event.target[0].value
    const author = event.target[1].value
        let configObj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                quote, 
                author
            })
        }
    
    fetch(url, configObj)
    .then(res => res.json())
    .then(newQuote => {
        displayQuote(newQuote)
        createQuoteForm.reset()})
})

function editQuoteBtn(quote, blockQuote, p, footer){
    const editForm = document.createElement('form')
    editForm.className = 'form-group'
    const quoteInput = document.createElement('input')
    quoteInput.setAttribute('type', 'text')
    quoteInput.value = quote.quote
    
    const authorInput = document.createElement('input')
    authorInput.setAttribute('type', 'text')
    authorInput.value = quote.author

    const submit = document.createElement('button')
    submit.setAttribute('type', 'submit')
    submit.innerText = "Edit Quote"
    editForm.append(quoteInput, authorInput, submit)
    blockQuote.append(editForm)

    editForm.addEventListener('submit', () => editQuote(editForm, quote, p, footer))
}


function editQuote(editForm, quote, p, footer){
    event.preventDefault()
    
    const quoteText = event.target[0].value
    const quoteAuthor = event.target[1].value

    const configObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            quote: quoteText,
            author: quoteAuthor
        })
    }

    fetch(quoteUrl+quote.id, configObj)
    .then(resp => resp.json())
    .then(updatedQuote => {
        p.innerText = updatedQuote.quote
        footer.innerText = updatedQuote.author
        editForm.reset()
        editForm.remove()
    })
}

function likeFunc(quote, likeSpan){
    let configObj = {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
            },
            body: JSON.stringify({
                quoteId: quote.id})
            }
    fetch(likesUrl, configObj)
    .then(res => res.json())
    .then(newLikeObj => getLikesAmount(quote, likeSpan))
    
}

function getLikesAmount(quote, likeSpan){
    fetch(likesQuoteIdUrl+quote.id)
    .then(resp => resp.json())
    .then(likesArray => { 
        likesCount = likesArray.length
        likeSpan.innerText = likesCount
    })
}
