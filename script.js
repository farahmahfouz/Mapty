'use strict';

const form = document.querySelector('.form');
const span = document.querySelector('.span');
const containerWorkouts = document.querySelector('.workouts');
const deleteBtn = document.querySelector('.workout__delete');
const deleteAllBtn = document.querySelector('.delete__all');
const controlBtns = document.querySelector('.btns__control');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const sortBtn = document.querySelector('.btn--sort');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  clicks = 0;
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadnece) {
    super(coords, distance, duration);
    this.cadnece = cadnece;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class App {
  #map;
  #mapEvent;
  #workout = [];
  #markers = {};
  sorted = false;
  constructor() {
    this._getPosition();
    this._getLocalStorage();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    containerWorkouts.addEventListener('click', this._deleteWorkout.bind(this));
    deleteAllBtn.addEventListener('click', this._deleteAllWorkouts.bind(this));
    sortBtn.addEventListener('click', this._sortWorkouts.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Some thing wrong');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    this.#map.on('click', this._showForm.bind(this));
    this.#workout.forEach(work => this._renderWorkoutMarker(work));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    // prettier-ignore
    inputElevation.value = inputCadence.value = inputDuration.value = inputDistance.value = '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const invalidInputs = (...inputs) => {
      span.innerHTML = '';
      return inputs.every(inp => Number.isFinite(inp));
    };
    const allPositive = (...inputs) => {
      span.innerHTML = '';
      return inputs.every(inp => inp > 0);
    };
    e.preventDefault();

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (
        !invalidInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return (span.innerHTML = 'Inputs must be positive numbers');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !invalidInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return (span.innerHTML = 'Inputs must be positive numbers');
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    this.#workout.push(workout);
    this._renderWorkout(workout);
    this._renderWorkoutMarker(workout);
    this._hideForm();
    this._setLocalStorage();
    this._sortWorkouts(workout);
    controlBtns.style.display = 'flex';
  }
  _renderWorkoutMarker(workout) {
    const marker = L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 150,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴'} ${workout.description}`
      )
      .openPopup();
    this.#markers[workout.id] = marker;
  }
  _renderWorkout(workout) {
  
    // prettier-ignore
    const {id, type, description, distance, duration, pace, cadnece, elevationGain, speed } = workout;
    let html = `
          <li class="workout workout--${type}" data-id="${id}">
          <h2 class="workout__title">${description}</h2>
          <button class="workout__delete"><i class="fa-solid fa-xmark"></i></button>
          <div class="workout__details">
            <span class="workout__icon">${
              type === 'running' ? '🏃‍♂️' : '🚴'
            }</span>
            <span class="workout__value">${distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${duration}</span>
            <span class="workout__unit">min</span>
          </div>
          `;
    if (type === 'running') {
      html += ` 
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${pace.toFixed(1)}</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${cadnece}</span>
        <span class="workout__unit">spm</span>
      </div>
      </li>`;
    }
    if (type === 'cycling') {
      html += ` 
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${speed.toFixed(1)}</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${elevationGain}</span>
        <span class="workout__unit">spm</span>
      </div>
      </li>`;
    }
    form.insertAdjacentHTML('afterend', html);
    
  }
  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');

    if (!workoutEl) return;
    const workout = this.#workout.find(
      work => work.id === workoutEl.dataset.id
    );

    this.#map.setView(workout.coords, 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
    // workout.click();
  }
  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workout));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;
    this.#workout = data;
    this.#workout.forEach(work => this._renderWorkout(work));
  }
  _deleteWorkout(e) {
    const deleteEl = e.target.closest('.workout__delete');
    const workoutEl = e.target.closest('.workout');

    if (!deleteEl || !workoutEl) return;

    const workoutId = workoutEl.dataset.id;

    this.#workout = this.#workout.filter(work => work.id !== workoutId);

    this.#markers[workoutId].remove();
    delete this.#markers[workoutId];

    workoutEl.remove();

    this._setLocalStorage();

    console.log('All workouts:', this.#workout);
  }
  _deleteAllWorkouts() {
    this.#workout = [];
    const allWorkouts = document.querySelectorAll('.workout');
    allWorkouts.forEach(el => el.remove());
    if (this.#markers) {
      Array.from(this.#markers).forEach(marker => marker.remove());
      this.#markers = {};
    }

    this._setLocalStorage();

    controlBtns.style.display = 'none';
  }
  _sortWorkouts(e) {
    e.preventDefault();
    this.#workout.sort((a, b) => {
      return this.sorted ? a.distance - b.distance : b.distance - a.distance;
    });
    containerWorkouts.innerHTML = '';
    this.#workout.forEach(work => this._renderWorkout(work))
    this.sorted = !this.sorted;
  }
}

const app = new App();
