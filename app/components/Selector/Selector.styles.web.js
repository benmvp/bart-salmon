import {gutterSize} from '../../styling'

export default {
    root: {
        display: 'flex',
        position: 'relative',
        border: '1px solid #ddd',
        borderRadius: '5px',
        height: '44px',
        padding: gutterSize(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    display: {
        fontSize: '20px',
        flex: '1',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    arrow: {

    },
    select: {
        opacity: 0,
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0
    }
}
