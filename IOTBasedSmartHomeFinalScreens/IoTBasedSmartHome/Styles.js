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
        alignItems: 'center',
        width: '90%',
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
        marginLeft: 0 ,
        fontWeight:'800'
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
        marginBottom: '16%', 
        marginTop: '60%'
    },
    input: {
        color: 'black',
        fontSize: 18,
        padding: 10,
        borderRadius: 15,
        width: '100%',
        marginBottom: 10,
        backgroundColor: 'white', borderColor: 'black', borderWidth: 0.7 
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
    },
    listText: {
        fontSize: 20,
        color: 'white',
        fontStyle:'italic',
        fontWeight: '600',
        letterSpacing:0.8,
        fontFamily: 'Algerian',
        marginLeft:15
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
        outlineColor:'darkblue',
        outlineWidth:2,
        outlineStyle:'solid',
    },
    floatingButtonText: {
        fontSize: 35,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default styles;