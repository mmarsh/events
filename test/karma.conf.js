module.exports = function(config) {
    config.set({
        basePath: '../',

        reporters: ['progress'],

        frameworks: ['jasmine'],

        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'app/js/**/*.js',
            'test/**/*.js'
        ],

        autoWatch: true,

        browsers: ['PhantomJS']
    });
};