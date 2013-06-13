/**
 * The Movies controller.
 */
Ext.define("GeekFlicks.controller.Movies", {
    extend: 'Ext.app.Controller',

    models: [
        'Movie'
    ],

    stores: [
        'Movies'
    ],

    views:  [
        'Movies'
    ],

    init: function () {
        this.control({
            'movieseditor': {
                render: this.onEditorRender,
		edit: this.afterMovieEdit
            },
        'movieseditor button': {
            click: this.addMovie
        }
        });
    },
    addMovie: function () {
    var newMovie,
        movieStore = this.getStore('Movies');

    // add blank item to store -- will automatically add new row to grid
    newMovie = movieStore.add({
        title: '',
        year: ''
    })[0];
    // cache a reference to the moviesEditor and rowEditor
    this.moviesEditor = Ext.ComponentQuery.query('movieseditor')[0];
    this.rowEditor = this.moviesEditor.rowEditor;
},

    onEditorRender: function () {
        console.log("movies editor was rendered");
    },
    afterMovieEdit: function () {
    var movieStore = this.getStore('Movies');
    movieStore.sync();
}
});
