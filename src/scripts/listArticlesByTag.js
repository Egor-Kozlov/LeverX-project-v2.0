'use strict'
let cardsData = [] //<- "import" cards data from data.js

const params = new URLSearchParams(document.location.search.substring(1));
const tagName = params.get("id"); //<-get card id

const cardTemplate = document.getElementById('card-template') // <- pick card template from index.html
const cardsContainer = document.querySelector('.cards') // <- pick cards container
const searchInput = document.querySelector('.search-input') //<- pick search input 
const emptyResultTemplate = document.querySelector('.empty-result')
let searchingTag = document.querySelector('.tagName')

// pick card content
let cardTitle = cardTemplate.content.querySelector('.card__title')
let cardDescription = cardTemplate.content.querySelector('.card__description')
let cardPicture = cardTemplate.content.querySelector('.card__img')
let cardLink = cardTemplate.content.querySelector('.card__link')

let cardsByTag = []
//input search value
let inputSeachValue
searchInput.oninput = function() {
    inputSeachValue = searchInput.value
    filterCardList(searchInput.value)
}

const createCard = (cards) => {
    return cards.map((card, index) => {
        cardPicture.setAttribute('src', `data:image/png;base64,${card.picture}`)
        cardTitle.textContent = `${card.title}` // <- pick title from cardsData
        cardDescription.textContent = `${card.articleBody[0].storyParagraph}` // <- pick description from cardsData
        cardDescription.setAttribute('title', `${cardsData[index].articleBody[0].storyParagraph}`)
        cardLink.setAttribute('href', `cardDetail.html?id=${card._id}`)
        return cardTemplate.content.cloneNode(true); 
    })
}

const renderCards = (cardsTemplate) => {
    cardsContainer.innerHTML = ''
    cardsTemplate.length ? cardsTemplate.forEach(element => {
        cardsContainer.append(element) 
    }) : cardsContainer.append(emptyResultTemplate.content.cloneNode(true))
}

const filterCardList = (inputValue) => {
    let filteredCard = []
    if (inputValue) {
        filteredCard = cardsByTag.filter((card) => {
            return card.title.toLowerCase().includes(inputSeachValue.toLowerCase())
    })
    } else { // <-if user pick nothing
        filteredCard = cardsByTag
    }
    renderCards(createCard(filteredCard))
}

const firstRenderCads = (cards) => {
    cardsData = cards
    cardsByTag = cards.filter((card) => card.tags.includes(tagName))
    searchingTag.textContent = `${tagName}`
    document.title = `Articles List by ${tagName}` //<- set page title
    renderCards(createCard(cardsByTag))
}

const getCards = (inputSearch, selectedTags) => {

    let url = new URL ('http://localhost:8080/cardlist')
    url.search = new URLSearchParams(params).toString();

    fetch(url)
    .then(response => response.json())
    .then(json => firstRenderCads(json))
}
getCards()