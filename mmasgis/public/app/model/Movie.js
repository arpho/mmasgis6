/**
 * The Movie model definition
 */
Ext.define('GeekFlicks.model.Movie', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'title',
            type: 'string'
        },
        {
            name: 'year',
            type: 'int'
        }
    ]
});
