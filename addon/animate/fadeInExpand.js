'use strict';

exports.addon = function (renderer) {
    if (process.env.NODE_ENV !== 'production') {
        require('../__dev__/warnOnMissingDependencies')('animate', renderer, ['keyframes']);
    }

    renderer.put('', {
        '@keyframes fadeInExpand': {
            from: {
                opacity: 0,
                transform: 'scale(.95)'
            },

            to: {
                opacity: 1,
                transform: 'scale(1)',
            }
        },

        '.fadeInExpand': {
            animation: 'fadeInExpand .3s',
        }
    });
};
