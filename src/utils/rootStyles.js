import { StyleSheet } from 'react-native';

export const rootStyles = StyleSheet.create({
    colors: {
        primary: '#4CAF50',
        background: '#F5F5F5',
        backgroundSecondary: '#cbcbcbff',
        text: '#212121',
    },
    section: {
        borderWidth: 3,
        padding: 10,
        margin: 15,
    },
    button: {
        borderWidth: 3,
        borderRadius: 30,
        padding: 10,
        margin: 10,
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    bodyText: {
        fontSize: 10,
    },
    tagText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default rootStyles;