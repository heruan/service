module.exports = function (grunt) {
    grunt.initConfig({
        connect : {
            server : {
                options : {
                    keepalive : true,
                    hostname : '0.0.0.0',
                    port : 8080,
                    base : './www'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-connect');
};
