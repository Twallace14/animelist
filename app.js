// Anime class: Respresents a Show
class Show {
    constructor(title, studio, imdb) {
        this.title = title;
        this.studio = studio;
        this.imdb = imdb;
    }
}

// UI Class: handle UI task

class UI {
    static displayShows() { 
        const shows = Store.getShows();

        shows.forEach((show) => UI.addShowToList(show));
    }

    static addShowToList(show) {
        const list = document.querySelector('#show-list')

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${show.title}</td>
        <td>${show.studio}</td>
        <td>${show.imdb}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">x</a></td>
        `;

        list.appendChild(row);
    }

    static deleteShow(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message))
        const container = document.querySelector('.container');
        const form = document.querySelector('#show-form');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    static clearFields() {
        document.querySelector('#title').value = " ";
        document.querySelector('#studio').value = " ";
        document.querySelector('#imdb').value = " ";
    }
}

// Store Class: handles storage

class Store {
    static getShows() {
        let shows;
        if(localStorage.getItem('shows') === null) {
            shows = [];
        } else {
          shows = JSON.parse(localStorage.getItem('shows'));
        }

        return shows;
    }

    static addShow(show){
        const shows = Store.getShows();
        shows.push(show);
        localStorage.setItem('shows', JSON.stringify(shows));
    }

    static removeShow(imdb) {
        const shows = Store.getShows();
        shows.forEach((show, index) => {
            if(show.imdb === imdb) {
                shows.splice(index, 1);
            }
        });

        localStorage.setItem('shows', JSON.stringify(shows));

    }
}

// Event: display Show
document.addEventListener('DOMContentLoaded', UI.displayShows);

// Event: Add a Show
document.querySelector('#show-form').addEventListener('submit', (e) => {
    e.preventDefault();
    //Get Values
    const title = document.querySelector('#title').value;
    const studio = document.querySelector('#studio').value;
    const imdb = document.querySelector('#imdb').value;

    if (title === " " || studio === " " || imdb === " ") {
        UI.showAlert('complete form', 'danger');
    } else {
        const show = new Show(title, studio, imdb);

        //add show to UI

        UI.addShowToList(show);

        //add shwo to storage

        Store.addShow(show);

        // Show Success\

        UI.showAlert('Show Added', 'success');
        //clear Fields

        UI.clearFields();

    }

});



// Event: remove a Show

document.querySelector('#show-list').addEventListener('click', (e) => {
    UI.deleteShow(e.target)

    Store.removeShow(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('show removed', 'info')
});