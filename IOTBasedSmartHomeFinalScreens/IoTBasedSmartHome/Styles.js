import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
    },
    formContainer: {
        flex: 1,
        alignItems: 'center',
        width: '85%',
        marginTop: 10
    },
    select: {
        borderWidth: 0.7,
        borderColor: 'black',
        fontSize: 18,
        padding: 10,
        marginBottom: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        width: '100%',
    },
    description: {
        fontSize: 15,
        fontWeight: '500',
        color: 'black',
        lineHeight: 24,
        textAlign: 'center',
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 15
    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        flex: 1,
        position: 'relative'
    },
    navbar: {
        backgroundColor: '',
        width: '100%',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    navbarText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'black',
        marginLeft: 0,
        fontWeight: '800'
    },
    Text: {
        fontSize: 18,
        textAlign: 'center',
        color: 'black', marginBottom: 10,
    },
    value: {
        fontSize: 18, marginBottom: 10,
        backgroundColor: '#f5f5f5', borderColor: 'black', borderWidth: 0.7, borderRadius: 15, fontSize: 18, padding: 10
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'stretch',
        borderWidth: 0.4,
        borderRadius: 50,
        marginBottom: 20,
    },
    Bottombtn: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: '60%'
    },
    input: {
        color: 'black',
        fontSize: 18,
        padding: 10,
        borderRadius: 15,
        width: '100%',
        marginBottom: 10,
        backgroundColor: '#f5f5f5', borderColor: 'black', borderWidth: 0.7
    },
    button: {
        backgroundColor: '#001F6D',
        padding: 10,
        width: '70%',
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
    },
    textView: { 
        backgroundColor: '#001F6D', padding: 20, borderRadius: 20, flex: 1, borderWidth: 1 
    },
    applianceName: { 
        fontSize: 18, marginLeft: 10, color: 'white'
     },
    switchContainer: { 
        position: 'relative', alignItems: 'center', justifyContent: 'center', marginLeft: 25
     },
    simulatedBorder: {
        position: 'absolute',
        width: 50,
        height: 26,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#001F6D',
    },
    switch: { 
        marginLeft: 0 
    },
    row: { 
        flexDirection: 'row', alignItems: 'center', marginHorizontal: 25, marginTop: 0
     },
    listItem: {
        backgroundColor: '#001F6D',
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginVertical: 5,
        marginHorizontal: 25,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        outlineColor: 'darkblue',
        outlineWidth: 2,
        outlineStyle: 'solid', outlineOffset: 2, shadowOffset: 2, shadowColor: 'darkblue', // Shadow for iOS
    },
    listText: {
        fontSize: 20,
        color: 'white',
        fontStyle: 'italic',
        fontWeight: '600',
        letterSpacing: 0.8,
        fontFamily: 'Algerian',
        marginLeft: 15
    },
    infoIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        color: '#001F6D',
        fontWeight: 'bold',
        fontSize: 20,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#001F6D',
        borderRadius: '100%',
        width: '22%',
        height: '11%',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Shadow for Android
        shadowColor: 'darkblue', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        borderWidth: 3.5,
        borderColor: 'white',
        outlineColor: 'darkblue',
        outlineWidth: 2,
        outlineStyle: 'solid',
    },
    floatingButtonText: {
        fontSize: 35,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default styles;