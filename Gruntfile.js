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
    },
    // Annies tasks untill here

    sass: {
      dist: {
        files: {
          'css/style.css': 'scss/style.scss'
        }
      }
    },
    jshint: {
      files: ['js/*.js','js/!*.min.js'],
        options: {
          esversion: 6
        }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'css/',
          src: ['*.css', '!*.min.css'],
          dest: 'css/',
          ext: '.min.css'
        }]
      }
    },
    // Larissas tasks untill here


    // Katherines tasks untill here
    watch:{
      sass: {
        files: ['scss/*.scss'],
        tasks: ['sass', 'cssmin']
      },
      js: {
        files: ['js/*.js', '!js/*.min.js'],
        tasks: ['jshint', 'uglify']
      }
    }
  });

  // Load grunt tasks
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-csslint');

  // Register tasks
  grunt.registerTask('minJs', ['uglify']);
  grunt.registerTask('checkCss', ['csslint']);
  // Calling Annies tasks untill here


  // Load grunt tasks
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Register tasks
  grunt.registerTask('hintJS', ['jshint']);
  grunt.registerTask('checkSASS', ['sass']);
  grunt.registerTask('minCSS', ['sass']);
  // Calling Larissas tasks untill here


  // Load grunt tasks
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Register tasks
  grunt.registerTask('default', ['watch']);

  // Calling Katherines tasks untill here

};
