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
        marginTop: 0
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
        justifyContent: '',
        alignItems: 'center',
        width: '90%',
        flex: 1,
        position: 'relative',
        backgroundColor: 'transparent'
    },
    navbar: {
        width: '100%',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    navbarText: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 20,
        color: 'black',
        fontWeight: '800',
    },
    //////////////////////////////
    Text: {
        fontSize: 18,
        textAlign: 'center',
        color: 'black', marginBottom: 10,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'stretch',
        borderWidth: 0.4,
        borderRadius: 50,
        marginBottom: 20,
    },
    ///////////////////////
    Bottombtn: {
        width: '100%',
        alignItems: 'center',
        justifyContent:'flex-end',
        flex:1,
    },
    button: {
        backgroundColor: '#002255',
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '70%',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
    ////////////////////////
    input: {
        color: '#111827', // slightly softer black
        fontSize: 16,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        width: '100%',
        marginBottom: 12,
        backgroundColor: 'transparent', // subtle light gray for depth
        borderColor: '#D1D5DB', // soft gray border
        borderWidth: 0.1,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2, // Android shadow, subtle

        // iOS border inner glow effect mimic
        shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0.05,
    },
    textView: {
        backgroundColor: '#001F6D', padding: 20, borderRadius: 20, flex: 1, borderWidth: 1
    },
    applianceName: {
        fontSize: 18, marginLeft: 10, color: 'white'
    },
    //////////////////////
    switchContainer: {
        position: 'relative', alignItems: 'center', justifyContent: 'center', marginLeft: 25
    },
    simulatedBorder: {
        position: 'absolute',
        width: 50,
        height: 26,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 0.7,
        borderColor: '#001F6D',
    },
    //////////////////////////////
    switch: {
        marginLeft: 0
    },
    row: {
        flexDirection: 'row', alignItems: 'center', marginHorizontal: 25, marginTop: 0
    },
    listItem: {
        backgroundColor: '#002255', // Slightly darker blue for a professional tone
        // backgroundColor:'rgba(146, 165, 227, 1)',
        paddingVertical: 14,
        paddingHorizontal: 18,
        marginVertical: 2.5,
        marginHorizontal: 25,
        borderRadius: 20, // Smoother roundness for elegance
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',    
        borderWidth: 0.5, // Subtle border for definition
        borderColor: '#003366', // Darker border for a modern, professional contrast
    },
    
    listText: {
        fontSize: 17,
        color: '#E0E6F0', // Light off-white for clarity and contrast
        fontWeight: '700',
        letterSpacing: 0,
        fontFamily: Platform.select({
            ios: 'System',
            android: 'serif',
          }), // Clean and professional font
        marginLeft: 15,
        overflow: 'hidden',
        flexShrink: 1,
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

    ////////////////////
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#809bce',
        borderRadius: 12, // Small rounding for slight modern effect
        width: 60, // Fixed size for square
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        // elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        borderWidth: 4,
        borderColor: '#abc4ff',
        outlineColor: '#ffffff',
        outlineWidth: 4,
        outlineStyle: 'solid',
    },
    
    floatingButtonText: {
        fontSize: 30,
        color: '#000000',
        fontWeight: '700',
        marginTop: -2, // Vertical optical alignment
    },
    
    ////////////////
    section: {
        marginBottom: 16,
        paddingHorizontal: 27,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
        fontStyle: 'italic'
    },
    categoriesContainer: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 12,
    },
    selectedCategory: {
        backgroundColor: '#ff6b6b',
    },
    categoryText: {
        color: 'black',
    },
    selectedCategoryText: {
        color: 'white',
    },
    appliancesSection: {
        padding: 16,
    },
    applianceItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    applianceName: {
        fontSize: 16,
        color: '#333',
    },
    applianceType: {
        fontSize: 14,
        color: '#666',
    },
    ////////////////
    checkboxContainer: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10, // Add some padding if needed
},
CheckBoxsimulatedBorder: {
    position: 'absolute',
    height: '70%',
    width: 0,
    backgroundColor: '#e0e0e0',
    left: 0,

},
//////////////////  Log
// logrow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//     paddingVertical: 8,
//   },
//   logheader: {
//     backgroundColor: '#002255',
//     borderTopWidth: 1,
//   },
//   logcell: {
//     flex: 1,
//     color:'black',
//     paddingHorizontal: 4,
//     fontSize: 12,
//   },

sectionHeader: {
  backgroundColor: '#B0B7C3',
  paddingVertical: 12,
  paddingHorizontal: 18,
  marginTop: 12,
  marginHorizontal: 10,
  borderRadius: 12,
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 3,
  borderWidth: 1,
  borderColor: '#001F6D',
},
sectionHeaderText: {
  fontWeight: '600',
  fontSize: 15,
  color: '#1A1A1A',
  letterSpacing: 0.3,
},



logcontainer: {
  padding: 10,
  backgroundColor: '#f0f4f8',
},

scrollWrapper: {
  flex: 1,
},

logrow: {
  flexDirection: 'row',
  paddingVertical: 12,
  backgroundColor: '#fff',
  marginBottom: 8,
  borderRadius: 8,
  elevation: 2, // Android shadow
  shadowColor: '#000', // iOS shadow
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  marginHorizontal: 6,
},

logheader: {
  flexDirection: 'row',
  backgroundColor: '#002255',
  paddingVertical: 12,
  borderRadius: 8,
  marginBottom: 10,
  marginHorizontal: 6,
},

logcell: {
  minWidth: 90,
  textAlign: 'center',
  color: '#333',
  fontSize: 13,
  paddingHorizontal: 5,
},

logheaderText: {
  minWidth: 90,
  textAlign: 'center',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 13,
  paddingHorizontal: 5,
},

});

export default styles;