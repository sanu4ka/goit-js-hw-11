import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const inputRef = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let page = 1;
let searchingValue = null;

inputRef.addEventListener('submit', onSubmit);
loadMoreButton.addEventListener('click', onLoadMoreButtonClick);

function onSubmit(event) {
  event.preventDefault();
  clearGallery();

  page = 1;
  searchingValue = event.currentTarget.elements.searchQuery.value;

  fetchGallery(searchingValue, page)
    .then(response => {
      if (response.totalHits) {
        makeGallery(makeGalleryCards(response.hits));
        showLoadMoreButton();
        if (response.hits.length < 40) {
          whenGalleryEnd();
        }
      } else {
        onFetchError();
        clearGallery();
        hideLoadMoreButton();
      }
    })
    .catch(onError);

  page += 1;
}

async function fetchGallery(value, page) {
  const API_KEY = '31518737-8890035b7ccda7383c5734768';
  const URL = `?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  return await axios
    .get(`https://pixabay.com/api${URL}`)
    .then(response => response.data);
}

function onFetchError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  console.error(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  page = 1;
}

function makeGallery(cards) {
  gallery.insertAdjacentHTML('beforeend', cards);
}

function makeGalleryCards(massive) {
  return massive
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `
        <div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300"/>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              ${likes}
            </p>
            <p class="info-item">
              <b>Views</b>
              ${views}
            </p>
            <p class="info-item">
              <b>Comments</b>
              ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>
              ${downloads}
            </p>
          </div>
        </div>
      `;
    })
    .join('');
}

function onLoadMoreButtonClick() {
  fetchGallery(searchingValue, page)
    .then(response => {
      if (response.totalHits) {
        makeGallery(makeGalleryCards(response.hits));
        if (response.hits.length < 40) {
          whenGalleryEnd();
        }
      }
    })
    .catch(onError);

  page += 1;
}

function showLoadMoreButton() {
  loadMoreButton.classList.remove('hide');
}

function hideLoadMoreButton() {
  loadMoreButton.classList.add('hide');
}

function whenGalleryEnd() {
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
  hideLoadMoreButton();
}

function clearGallery() {
  gallery.innerHTML = '';
}

function onError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  console.error(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  page = 1;
}
