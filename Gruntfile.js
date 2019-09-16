module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    uglify: {
      my_target: {
        files: {
          'js/server.min.js': ['js/server.js']
        }
      }
    },
    csslint: {
      strict: {
        options: {
          import: 2
        },
        src: ['css/*.css', 'css/!*.min.css']
      }
    }
    // Annies tasks untill here


    // Larissas tasks untill here


    // Katherines tasks untill here

  });

  // Load grunt tasks
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-csslint');

  // Register tasks
  grunt.registerTask('minJs', ['uglify']);
  grunt.registerTask('checkCss', ['csslint']);
  // Calling Annies tasks untill here


  // Calling Larissas tasks untill here


  // Calling Katherines tasks untill here

};
