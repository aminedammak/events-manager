module.exports = function(grunt) {

  var themePath = 'typo3conf/ext/usertheme/',
      resourcesPath = themePath + 'Resources/',
      resourcesPathCss = resourcesPath + 'Public/Styles/Css/',
      resourcesPathLess = resourcesPath + 'Private/Styles/Less/',
      importLessFileName = resourcesPathLess + 'import.less',
      importRTELessFileName = resourcesPathLess + 'import-rte.less',

      styleCssFileName = resourcesPathCss + 'style.css',
      styleCssMapFileName = resourcesPathCss + 'style.css.map',
      contentRTECssFileName = resourcesPathCss + 'content-rte.css',

      spriteSrcPath = resourcesPath + 'Private/Images/Sprite/',
      spriteDestPath = resourcesPath + 'Public/Images/',
      spriteLessPath = resourcesPath + 'Private/Styles/Less/'

  ;

  var initArray = {
    pkg: grunt.file.readJSON('package.json'),
  };


  /* LESS ----------------------------------------------------- */
  initArray.less = {
    development: {
      options: {
        compress: false,
        yuicompress: false,
        optimization: 0,
        sourceMap: false,
        sourceMapFilename: styleCssMapFileName,
        sourceMapBasepath: ".",
        sourceMapRootpath: "/",
        keepSpecialComments: '*',
      },
      files: {
        // target.css file: source.less file
//        styleCssFileName: importLessFileName,
//        contentRTECssFileName: importRTELessFileName,
      },
    },
    stage: {
      options: {
        compress: false,
        yuicompress: false,
        optimization: 0,
        sourceMap: false,
        sourceMapFilename: styleCssMapFileName,
        sourceMapBasepath: ".",
        sourceMapRootpath: "/",
        keepSpecialComments: '*',
      },
      files: {
       // target.css file: source.less file
//        styleCssFileName: importLessFileName,
//        contentRTECssFileName: importRTELessFileName,
      },
    },
  };
  initArray.less.development.files[styleCssFileName] = importLessFileName;
  initArray.less.development.files[contentRTECssFileName] = importRTELessFileName;
  initArray.less.stage.files[styleCssFileName] = importLessFileName;
  initArray.less.stage.files[contentRTECssFileName] = importRTELessFileName;

  /* Combine Media Queries ----------------------------------------------------- */
  initArray.cmq = {
    development: {
      files: {
        resourcesPathCss: [resourcesPathCss],
      },
    },
  };

  /* CSS minify ----------------------------------------------------- */
  initArray.cssmin = {
      options: {
        banner: '/* import.css <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */',
        roundingPrecision: -1,
      },
      target: {
        files: [{
          src: [styleCssFileName],
          dest: styleCssFileName,
        }],
      }
  };




  /* Grunt git ref changed files ----------------------------------------------------- */
  initArray.refChangedFiles = {
    development: {
      options: {
        from: 'v1.0.0', // optional: default is HEAD^
        to: 'HEAD', // optional: default is HEAD
        regexp: /.*/, // optional: default is /.*/
        format: 'oneline',
        src: 'oneline',
      },
      src: '.'
    },
  };

  /* Spritesmith */
  initArray.sprite = {
    web: {
      src: [spriteSrcPath + '*'],
      dest: spriteDestPath + 'sprite-v01.png',
      destCss : spriteLessPath + 'sprite.less',
      cssFormat: 'less',
      cssVarMap: function (sprite) {
        sprite.name = 'sprite-' + sprite.name;
      },
      cssSpritesheetName: 'sprites--',
      algorithm: 'binary-tree',
      padding: 100,
    },
  },



  /* WATCH */
  initArray.watch = {
    sprites: {
      files: [spriteSrcPath + '**/*'],
      tasks: ['sprite:web'],
      options: {
        nospawn: true,
        debounceDelay: 1000,
        atBegin: true,
      },
    },
    styles: {
      // Which files to watch (all .less files recursively in the less directory)
      files: [resourcesPathLess + '**/*.less'],
      tasks: ['less:development'],
      options: {
        nospawn: true,
        debounceDelay: 1000,
        atBegin: true,
      },
    },
  },

  /* GITHOOKS */
  initArray.githooks = {
    all: {
      // Will run the jshint and test:unit tasks at every commit
      'pre-commit': 'sprites dev',
      'post-merge': 'sprites dev',
      'post-checkout': 'sprites dev',
    }
  };
    

  grunt.initConfig(initArray);


  grunt.config.get('refChangedFiles');

  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-combine-media-queries');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-git-ref-changed-files');
  grunt.loadNpmTasks('grunt-githooks');

  grunt.registerTask('default', ['watch:styles']);
  grunt.registerTask('dev', ['less:development']);
  grunt.registerTask('gg', ['refChangedFiles:development']);
  grunt.registerTask('sprites', ['sprite:web']);
  grunt.registerTask('stage', ['less:stage', 'cssmin']);
};
s