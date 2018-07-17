module.exports = [
    {
        default : {
            ext_rel    : 'nofollow noopener noreferrer',
            ext_target : '_blank',
            attrs      : {
                input : 'checked',
            },
            classes : {
                a : 'b-link b-link__default',
                p : 'b-text',
            },
        },
    },
    {
        jobs : {
            ext_rel : 'nofollow noopener noreferrer',
            classes : {
                a  : 'b-link',
                p  : 'b-text',
                ul : 'b-list b-list_size_normal-compact b-list_columns_none',
                li : 'b-list__item b-list__item_marker_dash b-list__item_size_normal - compact',
                h2 : 'b-title b-title_size_medium-compact',
            },
        },
    },

];