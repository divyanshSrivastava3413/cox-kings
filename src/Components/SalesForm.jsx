async function seed() {
  try {
    // Root doc: masters/countries
    const masterDoc = doc(db, 'masters', 'countries');
    // Under that, collection 'countries'
    const countriesColPath = collection(masterDoc, 'countries');

    for (const [country, states] of Object.entries(countriesData)) {
      const countryDoc = doc(countriesColPath, country);
      // optional metadata field
      await setDoc(countryDoc, { name: country });

      const statesCol = collection(countryDoc, 'states');
      for (const [state, locations] of Object.entries(states)) {
        const stateDoc = doc(statesCol, state);
        await setDoc(stateDoc, { locations });
        console.log(`Seeded ${country} > ${state}`, locations);
      }
    }

    console.log('✅ Firestore seeding complete');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
}

const countriesData = {
  "United States": {
    "Alabama": ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Gulf Shores"],
    "Alaska": ["Anchorage", "Fairbanks", "Juneau", "Denali National Park", "Ketchikan"],
    "Arizona": ["Phoenix", "Tucson", "Grand Canyon", "Sedona", "Flagstaff"],
    "Arkansas": ["Little Rock", "Fayetteville", "Hot Springs", "Eureka Springs", "Bentonville"],
    "California": ["San Francisco", "Los Angeles", "San Diego", "Yosemite National Park", "Santa Barbara"],
    "Colorado": ["Denver", "Boulder", "Aspen", "Rocky Mountain National Park", "Colorado Springs"],
    "Connecticut": ["Hartford", "New Haven", "Mystic", "Stamford", "Greenwich"],
    "Delaware": ["Wilmington", "Dover", "Rehoboth Beach", "Newark", "Lewes"],
    "Florida": ["Miami", "Orlando", "Tampa", "Key West", "St. Augustine"],
    "Georgia": ["Atlanta", "Savannah", "Augusta", "Macon", "Athens"],
    "Hawaii": ["Honolulu", "Maui", "Kauai", "Big Island", "Oahu"],
    "Idaho": ["Boise", "Coeur d'Alene", "Sun Valley", "Idaho Falls", "Sandpoint"],
    "Illinois": ["Chicago", "Springfield", "Peoria", "Rockford", "Galena"],
    "Indiana": ["Indianapolis", "Fort Wayne", "Bloomington", "South Bend", "Evansville"],
    "Iowa": ["Des Moines", "Cedar Rapids", "Dubuque", "Iowa City", "Sioux City"],
    "Kansas": ["Wichita", "Kansas City", "Topeka", "Overland Park", "Lawrence"],
    "Kentucky": ["Louisville", "Lexington", "Frankfort", "Bowling Green", "Paducah"],
    "Louisiana": ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles"],
    "Maine": ["Portland", "Bangor", "Bar Harbor", "Augusta", "Kennebunkport"],
    "Maryland": ["Baltimore", "Annapolis", "Frederick", "Ocean City", "Rockville"],
    "Massachusetts": ["Boston", "Salem", "Cape Cod", "Springfield", "Worcester"],
    "Michigan": ["Detroit", "Grand Rapids", "Ann Arbor", "Lansing", "Mackinac Island"],
    "Minnesota": ["Minneapolis", "St. Paul", "Duluth", "Rochester", "Bemidji"],
    "Mississippi": ["Jackson", "Biloxi", "Gulfport", "Natchez", "Vicksburg"],
    "Missouri": ["St. Louis", "Kansas City", "Springfield", "Branson", "Columbia"],
    "Montana": ["Billings", "Missoula", "Bozeman", "Glacier National Park", "Helena"],
    "Nebraska": ["Omaha", "Lincoln", "Grand Island", "Kearney", "North Platte"],
    "Nevada": ["Las Vegas", "Reno", "Lake Tahoe", "Carson City", "Henderson"],
    "New Hampshire": ["Concord", "Manchester", "Portsmouth", "North Conway", "Hanover"],
    "New Jersey": ["Newark", "Jersey City", "Atlantic City", "Princeton", "Cape May"],
    "New Mexico": ["Albuquerque", "Santa Fe", "Taos", "Las Cruces", "Roswell"],
    "New York": ["New York City", "Buffalo", "Albany", "Niagara Falls", "Rochester"],
    "North Carolina": ["Charlotte", "Raleigh", "Asheville", "Wilmington", "Greensboro"],
    "North Dakota": ["Fargo", "Bismarck", "Grand Forks", "Minot", "Williston"],
    "Ohio": ["Columbus", "Cleveland", "Cincinnati", "Dayton", "Toledo"],
    "Oklahoma": ["Oklahoma City", "Tulsa", "Norman", "Lawton", "Broken Arrow"],
    "Oregon": ["Portland", "Eugene", "Bend", "Crater Lake", "Salem"],
    "Pennsylvania": ["Philadelphia", "Pittsburgh", "Harrisburg", "Lancaster", "Erie"],
    "Rhode Island": ["Providence", "Newport", "Warwick", "Cranston", "Block Island"],
    "South Carolina": ["Charleston", "Columbia", "Greenville", "Myrtle Beach", "Hilton Head"],
    "South Dakota": ["Sioux Falls", "Rapid City", "Deadwood", "Pierre", "Mount Rushmore"],
    "Tennessee": ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Gatlinburg"],
    "Texas": ["Houston", "Austin", "Dallas", "San Antonio", "Big Bend National Park"],
    "Utah": ["Salt Lake City", "Park City", "Moab", "Zion National Park", "St. George"],
    "Vermont": ["Burlington", "Montpelier", "Stowe", "Bennington", "Brattleboro"],
    "Virginia": ["Richmond", "Virginia Beach", "Norfolk", "Arlington", "Williamsburg"],
    "Washington": ["Seattle", "Spokane", "Olympic National Park", "Tacoma", "Bellevue"],
    "West Virginia": ["Charleston", "Huntington", "Morgantown", "Harpers Ferry", "Beckley"],
    "Wisconsin": ["Milwaukee", "Madison", "Green Bay", "Kenosha", "La Crosse"],
    "Wyoming": ["Cheyenne", "Jackson Hole", "Yellowstone National Park", "Casper", "Cody"]
  },
  "India": {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati", "Guntur", "Kurnool"],
    "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Bomdila", "Pasighat"],
    "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Kaziranga National Park"],
    "Bihar": ["Patna", "Gaya", "Bodh Gaya", "Muzaffarpur", "Bhagalpur"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Jagdalpur", "Durg"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Calangute"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
    "Haryana": ["Gurugram", "Faridabad", "Chandigarh", "Kurukshetra", "Panipat"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Kullu", "Dalhousie"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
    "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubli", "Hampi"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Munnar", "Alleppey", "Kozhikode"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
    "Manipur": ["Imphal", "Loktak Lake", "Ukhrul", "Thoubal", "Churachandpur"],
    "Meghalaya": ["Shillong", "Cherrapunji", "Tura", "Mawlynnong", "Jowai"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Wokha", "Mon"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Puri", "Rourkela", "Konark"],
    "Punjab": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Chandigarh"],
    "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar"],
    "Sikkim": ["Gangtok", "Pelling", "Lachung", "Namchi", "Ravangla"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Ooty"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Ambassa"],
    "Uttar Pradesh": ["Lucknow", "Agra", "Varanasi", "Kanpur", "Allahabad"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Nainital", "Mussoorie"],
    "West Bengal": ["Kolkata", "Darjeeling", "Siliguri", "Durgapur", "Howrah"],
    "Andaman and Nicobar Islands": ["Port Blair", "Havelock Island", "Neil Island", "Diglipur", "Little Andaman"],
    "Chandigarh": ["Chandigarh", "Panchkula", "Mohali", "Zirakpur", "Pinjore"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa", "Vapi", "Nagoa"],
    "Delhi": ["New Delhi", "Old Delhi", "Gurgaon", "Noida", "Faridabad"],
    "Jammu and Kashmir": ["Srinagar", "Jammu", "Leh", "Gulmarg", "Pahalgam"],
    "Ladakh": ["Leh", "Kargil", "Nubra Valley", "Pangong Lake", "Zanskar"],
    "Lakshadweep": ["Kavaratti", "Agatti", "Minicoy", "Amini", "Andrott"],
    "Puducherry": ["Pondicherry", "Karaikal", "Mahe", "Yanam", "Auroville"]
  },
  "China": {
    "Beijing": ["Beijing", "Great Wall", "Tiananmen Square", "Forbidden City", "Haidian"],
    "Shanghai": ["Shanghai", "Pudong", "The Bund", "Suzhou", "Hangzhou"],
    "Guangdong": ["Guangzhou", "Shenzhen", "Dongguan", "Foshan", "Zhuhai"],
    "Sichuan": ["Chengdu", "Leshan", "Jiuzhaigou", "Emeishan", "Dujiangyan"],
    "Zhejiang": ["Hangzhou", "Ningbo", "Wenzhou", "Shaoxing", "Yiwu"]
  },
  "Brazil": {
    "São Paulo": ["São Paulo", "Campinas", "Santos", "Guarujá", "São José dos Campos"],
    "Rio de Janeiro": ["Rio de Janeiro", "Búzios", "Paraty", "Angra dos Reis", "Niterói"],
    "Bahia": ["Salvador", "Porto Seguro", "Ilhéus", "Itacaré", "Morro de São Paulo"],
    "Minas Gerais": ["Belo Horizonte", "Ouro Preto", "Uberlândia", "Juiz de Fora", "Diamantina"]
  },
  "Russia": {
    "Moscow": ["Moscow", "Red Square", "Zelenograd", "Kolomna", "Sergiev Posad"],
    "Saint Petersburg": ["Saint Petersburg", "Peterhof", "Pushkin", "Vyborg", "Kronstadt"],
    "Tatarstan": ["Kazan", "Naberezhnye Chelny", "Almetyevsk", "Zelenodolsk", "Bugulma"],
    "Novosibirsk": ["Novosibirsk", "Berdsk", "Iskitim", "Ob", "Kolyvan"]
  },
  "Japan": {
    "Kantō": ["Tokyo", "Yokohama", "Kamakura", "Hakone", "Nikko"],
    "Kansai": ["Kyoto", "Osaka", "Nara", "Kobe", "Himeji"],
    "Hokkaido": ["Sapporo", "Hakodate", "Furano", "Otaru", "Noboribetsu"],
    "Kyushu": ["Fukuoka", "Nagasaki", "Kumamoto", "Beppu", "Kagoshima"]
  },
  "Germany": {
    "Bavaria": ["Munich", "Nuremberg", "Augsburg", "Regensburg", "Würzburg"],
    "North Rhine-Westphalia": ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Bonn"],
    "Baden-Württemberg": ["Stuttgart", "Freiburg", "Heidelberg", "Karlsruhe", "Mannheim"],
    "Hesse": ["Frankfurt", "Wiesbaden", "Darmstadt", "Kassel", "Marburg"]
  },
  "United Kingdom": {
    "England": ["London", "Manchester", "Liverpool", "Birmingham", "Oxford"],
    "Scotland": ["Edinburgh", "Glasgow", "Aberdeen", "Inverness", "St Andrews"],
    "Wales": ["Cardiff", "Swansea", "Newport", "Bangor", "Snowdonia"],
    "Northern Ireland": ["Belfast", "Derry", "Giant’s Causeway", "Armagh", "Lisburn"]
  },
  "France": {
    "Île-de-France": ["Paris", "Versailles", "Fontainebleau", "Saint-Denis", "Boulogne-Billancourt"],
    "Provence-Alpes-Côte d'Azur": ["Marseille", "Nice", "Cannes", "Aix-en-Provence", "Avignon"],
    "Auvergne-Rhône-Alpes": ["Lyon", "Grenoble", "Annecy", "Chamonix", "Valence"],
    "Nouvelle-Aquitaine": ["Bordeaux", "Biarritz", "Pau", "La Rochelle", "Limoges"]
  },
  "Australia": {
    "New South Wales": ["Sydney", "Newcastle", "Byron Bay", "Wollongong", "Blue Mountains"],
    "Queensland": ["Brisbane", "Gold Coast", "Cairns", "Townsville", "Great Barrier Reef"],
    "Victoria": ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Yarra Valley"],
    "Western Australia": ["Perth", "Fremantle", "Broome", "Margaret River", "Kalgoorlie"]
  },
  "Canada": {
    "Ontario": ["Toronto", "Ottawa", "Niagara Falls", "Hamilton", "Kingston"],
    "British Columbia": ["Vancouver", "Victoria", "Kelowna", "Whistler", "Tofino"],
    "Quebec": ["Montreal", "Quebec City", "Gatineau", "Sherbrooke", "Tadoussac"],
    "Alberta": ["Calgary", "Edmonton", "Banff", "Jasper", "Lethbridge"]
  },
  "Italy": {
    "Lazio": ["Rome", "Vatican City", "Tivoli", "Ostia Antica", "Frascati"],
    "Tuscany": ["Florence", "Pisa", "Siena", "Lucca", "San Gimignano"],
    "Veneto": ["Venice", "Verona", "Padua", "Vicenza", "Treviso"],
    "Lombardy": ["Milan", "Bergamo", "Como", "Brescia", "Mantua"]
  },
  "South Africa": {
    "Western Cape": ["Cape Town", "Stellenbosch", "Franschhoek", "Hermanus", "Knysna"],
    "Gauteng": ["Johannesburg", "Pretoria", "Sandton", "Soweto", "Benoni"],
    "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Umhlanga", "Drakensberg", "Richards Bay"],
    "Eastern Cape": ["Port Elizabeth", "East London", "Grahamstown", "Jeffreys Bay", "Addo Elephant Park"]
  },
  "Mexico": {
    "Jalisco": ["Guadalajara", "Puerto Vallarta", "Tequila", "Ajijic", "Zapopan"],
    "Quintana Roo": ["Cancún", "Playa del Carmen", "Tulum", "Cozumel", "Chetumal"],
    "Mexico City": ["Mexico City", "Coyoacán", "Xochimilco", "Polanco", "Tlalpan"],
    "Guanajuato": ["Guanajuato", "San Miguel de Allende", "León", "Celaya", "Irapuato"]
  },
  "Nigeria": {
    "Lagos": ["Lagos", "Ikeja", "Lekki", "Victoria Island", "Badagry"],
    "Kano": ["Kano", "Dala", "Fagge", "Gwale", "Zaria"],
    "Abia": ["Aba", "Umuahia", "Arochukwu", "Ohafia", "Umunneochi"],
    "Rivers": ["Port Harcourt", "Bonny Island", "Eleme", "Obio-Akpor", "Degema"]
  }
};

import { collection, getDocs, setDoc, doc,getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { db, rtdb } from '../Firebase/firebase'; // Adjust path to your Firebase config
import CloseIcon from '@mui/icons-material/Close';
import { Modal, Box, Typography, Button } from '@mui/material';
import { ref, get, runTransaction } from 'firebase/database';
import { Link, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useWatch } from 'react-hook-form';
import { Plane, Car, HotelIcon, UserRound, FileText, Plus, Trash2 } from "lucide-react"

const InvoiceForm = ({ bookingData, editMode, onClose, onSuccess }) => {
  

  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [customers, setCustomers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState({});
  const [locations, setLocations] = useState({});
  const [stockItems, setStockItems] = useState([]);
  const [isLoadingStockItems, setIsLoadingStockItems] = useState(true);

  const { register, handleSubmit, control, setValue, getValues, formState: { errors }, reset,  watch } = useForm({
    defaultValues: {
      customerdtls: { name: '', address: '', stateCode: '', city: '', pan: '', email: '', phone: '' },
      bookingId: '',
      invoiceDate: '',
      startdate: '',
      enddate: '',
      adv: 0,
      pkgName: '',
      pkgPrice: 0,
      discount: 0,
      toPay: 0,
      bookedBy:'',
      items: [], // Array of { itemId, rows: [{ code, quantity, ... }] }
    },
  });
  useEffect(() => {
  if (editMode && bookingData?.customerdtls?.name) {
    const selectedCustomer = customers.find(c => c.name === bookingData.customerdtls.name);

    if (selectedCustomer) {
      // Set customer name explicitly (for <select>)
      setValue('customerdtls.name', selectedCustomer.name);

      // Populate related customer fields
      setValue('customerdtls.address', selectedCustomer.address || '');
      setValue('customerdtls.stateCode', selectedCustomer.stateCode || '');
      setValue('customerdtls.city', selectedCustomer.city || '');
      setValue('customerdtls.pan', selectedCustomer.pan || '');
      setValue('customerdtls.email', selectedCustomer.email || '');
      setValue('customerdtls.phone', selectedCustomer.phone || '');
    }
  }
}, [editMode, bookingData, customers, setValue]);


  const { fields: itemFields, append: appendItem, remove: removeItem, update: updateItem } = useFieldArray({ control, name: 'items' });

  // Fetch customers from Firestore
  const fetchCustomers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'masters/ONBOARDING/CUSTOMER'));
      const customerList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(customerList);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setSnackbarMessage('Failed to fetch customers');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Fetch stock items from Firestore
  const fetchStockItems = async () => {
    try {
      const snap = await getDocs(collection(db, 'masters/STOCK/records'));
      const itemList = snap.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || data.itemname || 'Unknown',
            type: data.type || inferTypeFromId(doc.id) || 'Unknown',
            basicValue: data.basicValue || 0,
          };
        })
        //.filter(item => ['Flight', 'Taxi', 'Hotel'].includes(item.type));
      console.log('Fetched stock items:', itemList);
      setStockItems(itemList);
    } catch (error) {
      console.error('Error fetching stock items:', error);
      setSnackbarMessage('Failed to fetch stock items');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoadingStockItems(false);
    }
  };

  const inferTypeFromId = (id) => {
    const idLower = id.toLowerCase();
    if (idLower.includes('flight')) return 'Flight';
    if (idLower.includes('taxi')) return 'Taxi';
    if (idLower.includes('hotel')) return 'Hotel';
    if (idLower.includes('guide')) return 'Guide';
    if (idLower.includes('visa')) return 'Visa';
    return 'Unknown';
  };

  // Fetch countries from Firestore
  const fetchCountries = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'masters/countries/countries'));
      const countryList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setCountries(countryList);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setSnackbarMessage('Failed to fetch countries');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  useEffect(() => {
  if (editMode && bookingData) {
    reset(bookingData);
  }
}, [editMode, bookingData]);



  // Fetch states for a country
  const fetchStates = async (countryId) => {
    try {
      const querySnapshot = await getDocs(collection(db, `masters/countries/countries/${countryId}/states`));
      const stateList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.id,
        countryId,
      }));
      setStates(prev => ({ ...prev, [countryId]: stateList }));
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };



  // Fetch locations for a state
  const fetchLocations = async (countryId, stateId) => {
    try {
      // 1. Point to the state document
      const stateRef = doc(
        db,
        'masters',
        'countries',       // the root doc
        'countries',       // its sub-collection
        countryId,
        'states',
        stateId
      );
  
      // 2. Read the doc
      const snap = await getDoc(stateRef);
      if (!snap.exists()) {
        console.warn(`State ${stateId} not found under country ${countryId}`);
        return;
      }
  
      // 3. data().locations is your array
      const locArray = snap.data().locations || [];
  
      // 4. Build a list of objects for your dropdown
      const locationList = locArray.map((name, idx) => ({
        id:   `${stateId}-${idx}`,  // or simply name if you prefer
        name,
        stateId
      }));
  
      console.log('Fetched locations:', locationList);
      setLocations(prev => ({ ...prev, [stateId]: locationList }));
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingStockItems(true);
      await Promise.all([fetchCustomers(), fetchStockItems(), fetchCountries()]);
    };
    fetchData();
  }, []);

  // Fetch and set booking ID
/*   useEffect(() => {
    const fetchBookingNumber = async () => {
      const lastNumberRef = ref(rtdb, 'lastBookingNumber');
      const snapshot = await get(lastNumberRef);
      const lastNumber = snapshot.exists() ? snapshot.val() : 0;
      const formattedBookingId = `BK-${(lastNumber + 1).toString().padStart(5, '0')}`;
      setValue('bookingId', formattedBookingId);
    };
    fetchBookingNumber();
  }, [setValue]); */

  const bookingType = useWatch({ control, name: 'bookingType' });

  useEffect(() => {
    const fetchBookingNumber = async () => {
      if (!bookingType) {
        setValue('bookingId', ''); // Reset booking ID if nothing selected
        return;
      }
  
      const prefix = bookingType === 'Full Package' ? 'PB' : 'FB';
      const refPath = bookingType === 'Full Package'
        ? 'lastFullPackageBookingNumber'
        : 'lastFlightBookingNumber';
  
      try {
        const lastNumberRef = ref(rtdb, refPath);
        const snapshot = await get(lastNumberRef);
        const lastNumber = snapshot.exists() ? snapshot.val() : 0;
        const formattedBookingId = `${prefix}-${(lastNumber + 1).toString().padStart(3, '0')}`;
        setValue('bookingId', formattedBookingId);
      } catch (error) {
        console.error('Error fetching booking number:', error);
      }
    };
  
    fetchBookingNumber();
  }, [bookingType, setValue]);
  

  // Handle customer selection
  const handleVendorSelection = (partyName, field) => {
    const selectedParty = customers.find(party => party.name === partyName);
    if (selectedParty) {
      setValue(`${field}.name`, selectedParty.name);
      setValue(`${field}.address`, selectedParty.address);
      setValue(`${field}.stateCode`, selectedParty.pincode);
      setValue(`${field}.city`, selectedParty.city);
      setValue(`${field}.pan`, selectedParty.pan);
      setValue(`${field}.email`, selectedParty.email);
      setValue(`${field}.phone`, selectedParty.phone);
    }
  };

  // Handle item selection in modal
  const handleItemSelection = (e) => {
    console.log('Selected item ID:', e.target.value);
    setSelectedItemId(e.target.value);
  };

  // Default fields for each item type
  const TYPE_DEFAULT_FIELDS = {
    Flight: [
      'boardingDate',
      'departureCountry',
      'departureState',
      'departureLocation',
      'arrivalCountry',
      'arrivalState',
      'arrivalLocation',
    ],
    Taxi: [
      'pickupDate',
      'pickupCountry',
      'pickupState',
      'pickupLocation',
      'dropoffCountry',
      'dropoffState',
      'dropoffLocation',
      'vehicleType',
    ],
    Hotel: [
      'checkInDate',
      'checkOutDate',
      'hotelCountry',
      'hotelState',
      'hotelLocation',
      'hotelName',
      'roomType',
    ],
    Guide: [
      'guideDate',
      'duration',
      'language',
      'guideCountry',
      'guideState',
      'guideLocation',
      'guideGender',
    ],
    Visa: [
  'visaApplicationDate',  // Date of application
  'visaType',             // e.g. Tourist, Business, Transit
  'passportNumber',       // Linked document
  'countryOfIssue',       // Visa-issuing country
  'visacountry',
  'durationOfStay',       // e.g. "30 days"
  'entryType',            // Single-entry / Multiple-entry
],

  };

// Pure code generator; rowIndex is zero-based
const CODE_PREFIXES = { Flight: 'FL', Taxi: 'TX', Hotel: 'HT',Guide:'GD',Visa:'VS' };
const generateItemCode = (itemType, rowIndex = 0) => {
  const prefix = CODE_PREFIXES[itemType] || 'OT';
  const num = String(rowIndex + 1).padStart(3, '0');
  return `${prefix}${num}`;
};

// 1) Handle adding a brand-new item (first row)
const handleAddItem = () => {
  if (!selectedItemId) {
    setSnackbarMessage('Please select an item');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
    return;
  }
  const selectedItem = stockItems.find(item => item.id === selectedItemId);
  if (!selectedItem) {
    setSnackbarMessage('Selected item not found');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
    return;
  }

  // figure out existing rows for this item (if any)
  const itemIndex = itemFields.findIndex(f => f.itemId === selectedItem.id);
  const existingRows = itemIndex === -1
    ? []
    : itemFields[itemIndex].rows;

  // generate code using existingRows.length as rowIndex
  const code = generateItemCode(selectedItem.type, existingRows.length);

  // base row
  let newRow = {
    code,
    itemId:      selectedItem.id,
    quantity:    1,
    basicValue:  selectedItem.basicValue || 0,
    itemdiscount:0,
    total:       selectedItem.basicValue || 0,
  };

  // add type-specific fields
  const extraFields = TYPE_DEFAULT_FIELDS[selectedItem.type] || [];
  extraFields.forEach(fieldName => {
    newRow[fieldName] = fieldName === 'hotelName'
      ? selectedItem.name
      : '';
  });

  // either append a new item group or add to existing
  if (itemIndex === -1) {
    appendItem({ itemId: selectedItem.id, rows: [newRow] });
  } else {
    const updated = {
      ...itemFields[itemIndex],
      rows: [...existingRows, newRow]
    };
    updateItem(itemIndex, updated);
  }

  // reset modal state
  setOpenAddModal(false);
  setSelectedItemId('');
};

// 2) Handle adding an extra row to an existing item table
const handleAddRow = (itemIndex) => {
  const selectedItem = stockItems.find(item => item.id === itemFields[itemIndex].itemId);
  if (!selectedItem) {
    setSnackbarMessage('Selected item not found');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
    return;
  }

  const existingRows = itemFields[itemIndex].rows;
  const code = generateItemCode(selectedItem.type, existingRows.length);

  let newRow = {
    code,
    itemId:      selectedItem.id,
  };

  const extraFields = TYPE_DEFAULT_FIELDS[selectedItem.type] || [];
  extraFields.forEach(fieldName => {
    newRow[fieldName] = fieldName === 'hotelName'
      ? selectedItem.name
      : '';
  });

  const updated = {
    ...itemFields[itemIndex],
    rows: [...existingRows, newRow]
  };
  updateItem(itemIndex, updated);
};

// Handle form submission
const onSubmit = async (data) => {
  const bookingType = data.bookingType;
  
   const isEdit = editMode && bookingData?.bookingId;
  const bookingIdToUse = isEdit ? bookingData.bookingId : null;

  if (isEdit) {
    try {
      await setDoc(doc(db, "bookings", bookingIdToUse), {
        ...data,
        bookingId: bookingIdToUse, // ensure we keep the same ID
        updatedAt: new Date(),
      });

      setSnackbarMessage(`Booking ${bookingIdToUse} updated successfully!`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      reset();
      onSuccess?.(); // Notify parent if needed
      return;
    } catch (err) {
      console.error("Error updating booking:", err);
      setSnackbarMessage(`Failed to update booking: ${err.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
  }


  if (!editMode){
      let refPath, prefix;
  if (data.bookingType === 'Full Package') {
    const hasOnlyFlights = data.items.every(item => item.itemId === 'Flight');
    if (hasOnlyFlights) {
      setSnackbarMessage('Full Package booking must include more than just flights.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  }
  
  if (bookingType === 'Full Package') {
    refPath = 'lastFullPackageBookingNumber';
    prefix = 'PB';
  } else if (bookingType === 'Flight') {
    refPath = 'lastFlightBookingNumber';
    prefix = 'FB';
  } else {
    setSnackbarMessage(`Invalid booking type selected`);
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
    return;
  }

  let newBookingNumber;

  try {
    // Step 1: Update RTDB booking number for the selected type
    const bookingRef = ref(rtdb, refPath);
    await runTransaction(bookingRef, (currentValue) => {
      newBookingNumber = (currentValue || 0) + 1;
      return newBookingNumber;
    });

    const formattedBookingId = `${prefix}-${newBookingNumber.toString().padStart(3, '0')}`;
    data.bookingId = formattedBookingId;

    // Step 2: Find customerId (optional if needed)
    const selectedCustomer = customers.find(customer => customer.name === data.customerdtls.name);
    if (!selectedCustomer) {
      throw new Error('Selected customer not found');
    }

    // Step 3: Save to Firestore
    await setDoc(doc(db, 'bookings', formattedBookingId), {
      ...data,
      createdAt: new Date(),
    });

    setSnackbarMessage(`Booking ${formattedBookingId} added successfully!`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    reset();
    setTimeout(() => {
      navigate('/bookings');
    }, 1500);
  } catch (err) {
    console.error('Error saving invoice:', err);
    setSnackbarMessage(`Failed to save invoice: ${err.message}`);
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  }
  }

};


  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Render item-specific fields
  const renderItemSpecificFields = (item, itemIndex, rowIndex) => {
    const selectedItem = stockItems.find(si => si.id === item.itemId);
    if (!selectedItem) return <td className="p-2 border whitespace-nowrap" colSpan={8}></td>;
    //console.log(selectedItem,selectedItem.name)

    switch (selectedItem.type) {
      case 'Flight':
        return (
          <>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${itemIndex}.rows.${rowIndex}.boardingDate`)}
                type="date"
                className="w-full p-1 border rounded"
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.departureCountry`)}
                className="w-full p-1 border rounded"
                onChange={(e) => {
                  setValue(`items.${itemIndex}.rows.${rowIndex}.departureCountry`, e.target.value);
                  setValue(`items.${itemIndex}.rows.${rowIndex}.departureState`, '');
                  setValue(`items.${itemIndex}.rows.${rowIndex}.departureLocation`, '');
                  fetchStates(e.target.value);
                }}
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.departureState`)}
                className="w-full p-1 border rounded"
                onChange={(e) => {
                  setValue(`items.${itemIndex}.rows.${rowIndex}.departureState`, e.target.value);
                  setValue(`items.${itemIndex}.rows.${rowIndex}.departureLocation`, '');
                  fetchLocations(getValues(`items.${itemIndex}.rows.${rowIndex}.departureCountry`), e.target.value);
                }}
              >
                <option value="">Select State</option>
                {(states[getValues(`items.${itemIndex}.rows.${rowIndex}.departureCountry`)] || []).map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.departureLocation`)}
                className="w-full p-1 border rounded"
              >
                <option value="">Select Location</option>
                {(locations[getValues(`items.${itemIndex}.rows.${rowIndex}.departureState`)] || []).map(location => (
                  <option key={location.id} value={location.name}>{location.name}</option>
                ))}
              </select>
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.arrivalCountry`)}
                className="w-full p-1 border rounded"
                onChange={(e) => {
                  setValue(`items.${itemIndex}.rows.${rowIndex}.arrivalCountry`, e.target.value);
                  setValue(`items.${itemIndex}.rows.${rowIndex}.arrivalState`, '');
                  setValue(`items.${itemIndex}.rows.${rowIndex}.arrivalLocation`, '');
                  fetchStates(e.target.value);
                }}
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.arrivalState`)}
                className="w-full p-1 border rounded"
                onChange={(e) => {
                  setValue(`items.${itemIndex}.rows.${rowIndex}.arrivalState`, e.target.value);
                  setValue(`items.${itemIndex}.rows.${rowIndex}.arrivalLocation`, '');
                  fetchLocations(getValues(`items.${itemIndex}.rows.${rowIndex}.arrivalCountry`), e.target.value);
                }}
              >
                <option value="">Select State</option>
                {(states[getValues(`items.${itemIndex}.rows.${rowIndex}.arrivalCountry`)] || []).map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.arrivalLocation`)}
                className="w-full p-1 border rounded"
              >
                <option value="">Select Location</option>
                {(locations[getValues(`items.${itemIndex}.rows.${rowIndex}.arrivalState`)] || []).map(location => (
                  <option key={location.id} value={location.name}>{location.name}</option>
                ))}
              </select>
            </td>
          </>
        );
      case 'Taxi':
        return (
          <>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${itemIndex}.rows.${rowIndex}.pickupDate`)}
                type="date"
                className="w-full p-1 border rounded"
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.pickupCountry`)}
                className="w-full p-1 border rounded"
                onChange={(e) => {
                  setValue(`items.${itemIndex}.rows.${rowIndex}.pickupCountry`, e.target.value);
                  setValue(`items.${itemIndex}.rows.${rowIndex}.pickupState`, '');
                  setValue(`items.${itemIndex}.rows.${rowIndex}.pickupLocation`, '');
                  fetchStates(e.target.value);
                }}
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.pickupState`)}
                className="w-full p-1 border rounded"
                onChange={(e) => {
                  setValue(`items.${itemIndex}.rows.${rowIndex}.pickupState`, e.target.value);
                  setValue(`items.${itemIndex}.rows.${rowIndex}.pickupLocation`, '');
                  fetchLocations(getValues(`items.${itemIndex}.rows.${rowIndex}.pickupCountry`), e.target.value);
                }}
              >
                <option value="">Select State</option>
                {(states[getValues(`items.${itemIndex}.rows.${rowIndex}.pickupCountry`)] || []).map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.pickupLocation`)}
                className="w-full p-1 border rounded"
              >
                <option value="">Select Location</option>
                {(locations[getValues(`items.${itemIndex}.rows.${rowIndex}.pickupState`)] || []).map(location => (
                  <option key={location.id} value={location.name}>{location.name}</option>
                ))}
              </select>
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.dropoffCountry`)}
                className="w-full p-1 border rounded"
                onChange={(e) => {
                  setValue(`items.${itemIndex}.rows.${rowIndex}.dropoffCountry`, e.target.value);
                  setValue(`items.${itemIndex}.rows.${rowIndex}.dropoffState`, '');
                  setValue(`items.${itemIndex}.rows.${rowIndex}.dropoffLocation`, '');
                  fetchStates(e.target.value);
                }}
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.dropoffState`)}
                className="w-full p-1 border rounded"
                onChange={(e) => {
                  setValue(`items.${itemIndex}.rows.${rowIndex}.dropoffState`, e.target.value);
                  setValue(`items.${itemIndex}.rows.${rowIndex}.dropoffLocation`, '');
                  fetchLocations(getValues(`items.${itemIndex}.rows.${rowIndex}.dropoffCountry`), e.target.value);
                }}
              >
                <option value="">Select State</option>
                {(states[getValues(`items.${itemIndex}.rows.${rowIndex}.dropoffCountry`)] || []).map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.dropoffLocation`)}
                className="w-full p-1 border rounded"
              >
                <option value="">Select Location</option>
                {(locations[getValues(`items.${itemIndex}.rows.${rowIndex}.dropoffState`)] || []).map(location => (
                  <option key={location.id} value={location.name}>{location.name}</option>
                ))}
              </select>
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.vehicleType`)}
                className="w-full p-1 border rounded"
              >
                <option value="">Select Vehicle</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Van">Van</option>
              </select>
            </td>
          </>
        );
      case 'Hotel':
        return (
          <>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${itemIndex}.rows.${rowIndex}.checkInDate`)}
                type="date"
                className="w-full p-1 border rounded"
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${itemIndex}.rows.${rowIndex}.checkOutDate`)}
                type="date"
                className="w-full p-1 border rounded"
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.hotelCountry`)}
                className="w-full p-1 border rounded"
                onChange={(e) => {
                  setValue(`items.${itemIndex}.rows.${rowIndex}.hotelCountry`, e.target.value);
                  setValue(`items.${itemIndex}.rows.${rowIndex}.hotelState`, '');
                  setValue(`items.${itemIndex}.rows.${rowIndex}.hotelLocation`, '');
                  fetchStates(e.target.value);
                }}
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.hotelState`)}
                className="w-full p-1 border rounded"
                onChange={(e) => {
                  setValue(`items.${itemIndex}.rows.${rowIndex}.hotelState`, e.target.value);
                  setValue(`items.${itemIndex}.rows.${rowIndex}.hotelLocation`, '');
                  fetchLocations(getValues(`items.${itemIndex}.rows.${rowIndex}.hotelCountry`), e.target.value);
                }}
              >
                <option value="">Select State</option>
                {(states[getValues(`items.${itemIndex}.rows.${rowIndex}.hotelCountry`)] || []).map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.hotelLocation`)}
                className="w-full p-1 border rounded"
              >
                <option value="">Select Location</option>
                {(locations[getValues(`items.${itemIndex}.rows.${rowIndex}.hotelState`)] || []).map(location => (
                  <option key={location.id} value={location.name}>{location.name}</option>
                ))}
              </select>
            </td>
            <td className="p-2 border whitespace-nowrap">
              <input
                {...register(`items.${itemIndex}.rows.${rowIndex}.hotelName`)}
                className="w-full p-1 border rounded"
                defaultValue={selectedItem.name}
                readOnly
              />
            </td>
            <td className="p-2 border whitespace-nowrap">
              <select
                {...register(`items.${itemIndex}.rows.${rowIndex}.roomType`)}
                className="w-full p-1 border rounded"
              >
                <option value="">Select Room Type</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </td>
          </>
        );
      case 'Guide':
          return (
            <>
              <td className="p-2 border whitespace-nowrap">
                <input
                  {...register(`items.${itemIndex}.rows.${rowIndex}.guideDate`)}
                  type="date"
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="p-2 border whitespace-nowrap">
              <input
                  {...register(`items.${itemIndex}.rows.${rowIndex}.duration`)}
                  className="w-full p-1 border rounded"
                  defaultValue={""}
                />
              </td>
              <td className="p-2 border whitespace-nowrap">
                <input
                  {...register(`items.${itemIndex}.rows.${rowIndex}.language`)}
                  className="w-full p-1 border rounded"
                  defaultValue={""}
                />
              </td>
              <td className="p-2 border whitespace-nowrap">
                <select
                  {...register(`items.${itemIndex}.rows.${rowIndex}.guideCountry`)}
                  className="w-full p-1 border rounded"
                  onChange={(e) => {
                    setValue(`items.${itemIndex}.rows.${rowIndex}.guideCountry`, e.target.value);
                    setValue(`items.${itemIndex}.rows.${rowIndex}.guideState`, '');
                    setValue(`items.${itemIndex}.rows.${rowIndex}.guideLocation`, '');
                    fetchStates(e.target.value);
                  }}
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>{country.name}</option>
                  ))}
                </select>
              </td>
              <td className="p-2 border whitespace-nowrap">
                <select
                  {...register(`items.${itemIndex}.rows.${rowIndex}.guideState`)}
                  className="w-full p-1 border rounded"
                  onChange={(e) => {
                    setValue(`items.${itemIndex}.rows.${rowIndex}.guideState`, e.target.value);
                    setValue(`items.${itemIndex}.rows.${rowIndex}.guideLocation`, '');
                    fetchLocations(getValues(`items.${itemIndex}.rows.${rowIndex}.guideCountry`), e.target.value);
                  }}
                >
                  <option value="">Select State</option>
                  {(states[getValues(`items.${itemIndex}.rows.${rowIndex}.guideCountry`)] || []).map(state => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                </select>
              </td>
              <td className="p-2 border whitespace-nowrap">
                <select
                  {...register(`items.${itemIndex}.rows.${rowIndex}.guideLocation`)}
                  className="w-full p-1 border rounded"
                >
                  <option value="">Select Location</option>
                  {(locations[getValues(`items.${itemIndex}.rows.${rowIndex}.guideState`)] || []).map(location => (
                    <option key={location.id} value={location.name}>{location.name}</option>
                  ))}
                </select>
              </td>
              <td className="p-2 border whitespace-nowrap">
                <select
                  {...register(`items.${itemIndex}.rows.${rowIndex}.guideGender`)}
                  className="w-full p-1 border rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </td>
            </>
          );
      case 'Visa':
            return (
              <>
                <td className="p-2 border whitespace-nowrap">
                  <input
                    {...register(`items.${itemIndex}.rows.${rowIndex}.visaApplicationDate`)}
                    type="date"
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="p-2 border whitespace-nowrap">
                  <select
                    {...register(`items.${itemIndex}.rows.${rowIndex}.visaType`)}
                    className="w-full p-1 border rounded"
                  >
                    <option value="">Select Visa-Type</option>
                    <option value=" Tourist">Tourist</option>
                    <option value="Business">Business</option>
                    <option value="Transit">Transit</option>
                  </select>
                </td>
                <td className="p-2 border whitespace-nowrap">
                <input
                    {...register(`items.${itemIndex}.rows.${rowIndex}.passportNumber`)}
                    className="w-full p-1 border rounded"
                    defaultValue={""}
                  />
                </td>
                <td className="p-2 border whitespace-nowrap">
                  <select
                    {...register(`items.${itemIndex}.rows.${rowIndex}.countryOfIssue`)}
                    className="w-full p-1 border rounded"
                    onChange={(e) => {
                      setValue(`items.${itemIndex}.rows.${rowIndex}.countryOfIssue`, e.target.value);
                    }}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border whitespace-nowrap">
                  <select
                    {...register(`items.${itemIndex}.rows.${rowIndex}.visacountry`)}
                    className="w-full p-1 border rounded"
                    onChange={(e) => {
                      setValue(`items.${itemIndex}.rows.${rowIndex}.visacountry`, e.target.value);
                    }}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border whitespace-nowrap">
                <input
                    {...register(`items.${itemIndex}.rows.${rowIndex}.durationOfStay`)}
                    className="w-full p-1 border rounded"
                    defaultValue={""}
                  />
                </td>
                
                <td className="p-2 border whitespace-nowrap">
                  <select
                    {...register(`items.${itemIndex}.rows.${rowIndex}.entryType`)}
                    className="w-full p-1 border rounded"
                  >
                    <option value="">Entry Type</option>
                    <option value="Single-entry">Single-entry</option>
                    <option value="Multiple Entry">Multiple-entry</option>
                    <option value="Others">Others</option>
                  </select>
                </td>
              </>
            );
          
      default:
        return <td className="p-2 border whitespace-nowrap" colSpan={8}></td>;
    }
  };

  // Render table for an item
  const renderItemTable = (item, itemIndex) => {
    const selectedItem = stockItems.find(si => si.id === item.itemId);
    if (!selectedItem) {
      console.warn(`Item with ID ${item.itemId} not found`);
      return (
        <div key={item.itemId} className="mb-8">
          <h3 className="text-lg font-bold mb-2">Unknown Item</h3>
          <p>Item not found. Please ensure stock items are loaded.</p>
        </div>
      );
    }
    const renderItemTypeIcon = (type) => {
    switch (type) {
      case "Flight":
        return <Plane className="stroke-gray-700" size={20} />
      case "Taxi":
        return <Car className="stroke-gray-700" size={20} />
      case "Hotel":
        return <HotelIcon className="stroke-gray-700" size={20} />
      case "Guide":
        return <UserRound className="stroke-gray-700" size={20} />
      case "Visa":
        return <FileText className="stroke-gray-700" size={20} />
      default:
        return null
    }
  }

    return (
      // <div key={item.itemId} className="mb-8">
      //   <h3 className="text-lg font-bold mb-2">{selectedItem.name} ({selectedItem.type})</h3>
      //   <div className="border rounded-xl border-gray-300 shadow-md" style={{ padding: '10px', overflow: 'hidden' }}>
      //     <div className="w-[70vw] overflow-hidden">
      //       <div className="overflow-x-auto shadow-md custom-scrollbar w-full">
      //         <div className="min-w-[2200px] inline-block align-middle">
      //           <table className="table-auto border-collapse w-full">
      //             <thead>
      //               <tr>
      //                 <th className="w-[80px] p-2 border whitespace-nowrap">S.No.</th>
      //                 <th className="p-2 border whitespace-nowrap">Item Code</th>
      //                 {selectedItem.type === 'Flight' && (
      //                   <>
      //                     <th className="p-2 border whitespace-nowrap">Boarding Date</th>
      //                     <th className="p-2 border whitespace-nowrap">Dep. Country</th>
      //                     <th className="p-2 border whitespace-nowrap">Dep. State</th>
      //                     <th className="p-2 border whitespace-nowrap">Dep. Location</th>
      //                     <th className="p-2 border whitespace-nowrap">Arr. Country</th>
      //                     <th className="p-2 border whitespace-nowrap">Arr. State</th>
      //                     <th className="p-2 border whitespace-nowrap">Arr. Location</th>
      //                   </>
      //                 )}
      //                 {selectedItem.type === 'Taxi' && (
      //                   <>
      //                     <th className="p-2 border whitespace-nowrap">Pickup Date</th>
      //                     <th className="p-2 border whitespace-nowrap">Pickup Country</th>
      //                     <th className="p-2 border whitespace-nowrap">Pickup State</th>
      //                     <th className="p-2 border whitespace-nowrap">Pickup Location</th>
      //                     <th className="p-2 border whitespace-nowrap">Dropoff Country</th>
      //                     <th className="p-2 border whitespace-nowrap">Dropoff State</th>
      //                     <th className="p-2 border whitespace-nowrap">Dropoff Location</th>
      //                     <th className="p-2 border whitespace-nowrap">Vehicle Type</th>
      //                   </>
      //                 )}
      //                 {selectedItem.type === 'Hotel' && (
      //                   <>
      //                     <th className="p-2 border whitespace-nowrap">Check-In Date</th>
      //                     <th className="p-2 border whitespace-nowrap">Check-Out Date</th>
      //                     <th className="p-2 border whitespace-nowrap">Country</th>
      //                     <th className="p-2 border whitespace-nowrap">State</th>
      //                     <th className="p-2 border whitespace-nowrap">Location</th>
      //                     <th className="p-2 border whitespace-nowrap">Description</th>
      //                     <th className="p-2 border whitespace-nowrap">Room Type</th>
      //                   </>
      //                 )}
      //                 {selectedItem.type === 'Guide' && (
      //                   <>
      //                     <th className="p-2 border whitespace-nowrap">Guide Date</th>
      //                     <th className="p-2 border whitespace-nowrap">Duration</th>
      //                     <th className="p-2 border whitespace-nowrap">Language</th>
      //                     <th className="p-2 border whitespace-nowrap">Country</th>
      //                     <th className="p-2 border whitespace-nowrap">State</th>
      //                     <th className="p-2 border whitespace-nowrap">Location</th>
      //                     <th className="p-2 border whitespace-nowrap">Gender</th>
      //                   </>
      //                 )}
      //                 {selectedItem.type === 'Visa' && (
      //                   <>
      //                     <th className="p-2 border whitespace-nowrap">Visa App. Date</th>
      //                     <th className="p-2 border whitespace-nowrap">Visa Type</th>
      //                     <th className="p-2 border whitespace-nowrap">Passport Number</th>
      //                     <th className="p-2 border whitespace-nowrap">Country of Issue</th>
      //                     <th className="p-2 border whitespace-nowrap">Visa Country</th>
      //                     <th className="p-2 border whitespace-nowrap">Duration of Stay</th>
      //                     <th className="p-2 border whitespace-nowrap">Entry Type</th>
      //                   </>
      //                 )}
      //                 <th className="p-2 border whitespace-nowrap">Remarks</th>
      //                 <th className="p-2 border whitespace-nowrap">Action</th>
      //               </tr>
      //             </thead>
      //             <tbody>
      //               {item.rows.map((row, rowIndex) => (
      //                 <tr key={row.id || rowIndex}>
      //                   <td className="p-2 border whitespace-nowrap">{rowIndex + 1}</td>
      //                   <td className="p-2 border whitespace-nowrap">
      //                     <input
      //                       {...register(`items.${itemIndex}.rows.${rowIndex}.code`)}
      //                       className="w-full p-1 border rounded"
      //                       value={row.code}
      //                       readOnly
      //                     />
      //                   </td>
      //                   {renderItemSpecificFields(item, itemIndex, rowIndex)}
      //                   <td className="p-2 border whitespace-nowrap">
      //                     <input
      //                       {...register(`items.${itemIndex}.rows.${rowIndex}.remarks`)}
      //                       className="w-full p-1 border rounded"
      //                     />
      //                   </td>
      //                   <td className="p-2 border whitespace-nowrap text-center">
      //                     <button
      //                       type="button"
      //                       className="px-2 py-1 bg-red-500 text-white rounded"
      //                       onClick={() => {
      //                         const rows = getValues(`items.${itemIndex}.rows`);
      //                         if (rows.length === 1) {
      //                           removeItem(itemIndex);
      //                         } else {
      //                           updateItem(itemIndex, {
      //                             ...item,
      //                             rows: rows.filter((_, i) => i !== rowIndex),
      //                           });
      //                         }
      //                       }}
      //                     >
      //                       Remove
      //                     </button>
      //                   </td>
      //                 </tr>
      //               ))}
      //             </tbody>
      //           </table>
      //         </div>
      //       </div>
      //     </div>
      //     <button
      //       type="button"
      //       onClick={() => handleAddRow(itemIndex, selectedItem)}
      //       className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
      //     >
      //       Add Row
      //     </button>
      //   </div>
      // </div>
      // Function to render the appropriate icon based on item type
  


    <div key={item.itemId} style={{ margin: "0 0 32px 0" }}>
      <div
        className="flex items-center bg-gray-50 rounded-lg shadow-sm"
        style={{ padding: "16px 20px", margin: "0 0 16px 0" }}
      >
        <div className="bg-gray-100 rounded-full" style={{ padding: "10px", margin: "0 12px 0 0" }}>
          {renderItemTypeIcon(selectedItem.type)}
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          {selectedItem.name} ({selectedItem.type})
        </h3>
      </div>

      <div
        className="border rounded-xl border-gray-200 shadow-sm bg-white"
        style={{ padding: "0", overflow: "hidden" }}
      >
        <div className="w-[70vw] overflow-hidden" style={{ padding: "16px 16px 0 16px", margin: "0" }}>
          <div className="overflow-x-auto shadow-sm custom-scrollbar w-full rounded-lg">
            <div className="min-w-[2200px] inline-block align-middle">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      className="w-[80px] text-left text-gray-700 font-semibold whitespace-nowrap"
                      style={{
                        padding: "14px 16px",
                        borderBottom: "1px solid #e5e7eb",
                        borderRight: "1px solid #e5e7eb",
                      }}
                    >
                      S.No.
                    </th>
                    <th
                      className="text-left text-gray-700 font-semibold whitespace-nowrap"
                      style={{
                        padding: "14px 16px",
                        borderBottom: "1px solid #e5e7eb",
                        borderRight: "1px solid #e5e7eb",
                      }}
                    >
                      Item Code
                    </th>
                    {selectedItem.type === "Flight" && (
                      <>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Boarding Date
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Dep. Country
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Dep. State
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Dep. Location
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Arr. Country
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Arr. State
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Arr. Location
                        </th>
                      </>
                    )}
                    {selectedItem.type === "Taxi" && (
                      <>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Pickup Date
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Pickup Country
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Pickup State
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Pickup Location
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Dropoff Country
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Dropoff State
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Dropoff Location
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Vehicle Type
                        </th>
                      </>
                    )}
                    {selectedItem.type === "Hotel" && (
                      <>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Check-In Date
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Check-Out Date
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Country
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          State
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Location
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Description
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Room Type
                        </th>
                      </>
                    )}
                    {selectedItem.type === "Guide" && (
                      <>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Guide Date
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Duration
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Language
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Country
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          State
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Location
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Gender
                        </th>
                      </>
                    )}
                    {selectedItem.type === "Visa" && (
                      <>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Visa App. Date
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Visa Type
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Passport Number
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Country of Issue
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Visa Country
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Duration of Stay
                        </th>
                        <th
                          className="text-left text-gray-700 font-semibold whitespace-nowrap"
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Entry Type
                        </th>
                      </>
                    )}
                    <th
                      className="text-left text-gray-700 font-semibold whitespace-nowrap"
                      style={{
                        padding: "14px 16px",
                        borderBottom: "1px solid #e5e7eb",
                        borderRight: "1px solid #e5e7eb",
                      }}
                    >
                      Remarks
                    </th>
                    <th
                      className="text-center text-gray-700 font-semibold whitespace-nowrap"
                      style={{
                        padding: "14px 16px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {item.rows.map((row, rowIndex) => (
                    <tr
                      key={row.id || rowIndex}
                      className={`${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors duration-150`}
                    >
                      <td
                        className="whitespace-nowrap font-medium text-gray-700"
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid #e5e7eb",
                          borderRight: "1px solid #e5e7eb",
                        }}
                      >
                        {rowIndex + 1}
                      </td>
                      <td
                        className="whitespace-nowrap"
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid #e5e7eb",
                          borderRight: "1px solid #e5e7eb",
                        }}
                      >
                        <input
                          {...register(`items.${itemIndex}.rows.${rowIndex}.code`)}
                          className="w-full border border-gray-300 rounded bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                          value={row.code}
                          readOnly
                          style={{ padding: "8px 12px", margin: "0" }}
                        />
                      </td>
                      {renderItemSpecificFields(item, itemIndex, rowIndex)}
                      <td
                        className="whitespace-nowrap"
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid #e5e7eb",
                          borderRight: "1px solid #e5e7eb",
                        }}
                      >
                        <input
                          {...register(`items.${itemIndex}.rows.${rowIndex}.remarks`)}
                          className="w-full border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                          style={{ padding: "8px 12px", margin: "0" }}
                        />
                      </td>
                      <td
                        className="whitespace-nowrap text-center"
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <button
                          type="button"
                          className="text-white rounded font-medium text-sm transition-colors duration-150 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 flex items-center justify-center"
                          style={{
                            padding: "8px 12px",
                            margin: "0",
                            backgroundColor: "#4b5563",
                          }}
                          onClick={() => {
                            const rows = getValues(`items.${itemIndex}.rows`)
                            if (rows.length === 1) {
                              removeItem(itemIndex)
                            } else {
                              updateItem(itemIndex, {
                                ...item,
                                rows: rows.filter((_, i) => i !== rowIndex),
                              })
                            }
                          }}
                        >
                          <Trash2 size={16} style={{ marginRight: "6px" }} />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div style={{ padding: "16px", margin: "0" }}>
          <button
            type="button"
            onClick={() => handleAddRow(itemIndex, selectedItem)}
            className="text-white rounded font-medium transition-colors duration-150 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 flex items-center"
            style={{
              padding: "10px 16px",
              margin: "0",
              backgroundColor: "#4b5563",
            }}
          >
            <Plus size={18} style={{ marginRight: "8px" }} />
            Add Row
          </button>
        </div>
      </div>
    </div>
  )
    
  };
  const pkgPrice = watch('pkgPrice');
const discount = watch('discount');

useEffect(() => {
  const price = parseFloat(pkgPrice) || 0;
  const disc = parseFloat(discount) || 0;

  const discountedAmount = price - (price * disc) / 100;
  setValue('toPay', discountedAmount.toFixed(2));
}, [pkgPrice, discount, setValue]);

  return (
    <div className="form-container bg-white mt-2 w-[75vw] p-6 flex flex-col justify-center items-center text-sm rounded-xl shadow gap-2 h-[85vh]">
        
      {!editMode && (
  <div className="flex items-center justify-between w-full mb-4 mt-4 h-20 bg-[#0b80d3] rounded-t-xl" style={{padding:'10px 22px'}}>
    <div className="flex flex-col items-start justify-center w-[95%] mb-4 mt-4 ">
      <h2 className="text-2xl font-semibold text-white">Create Booking Invoice</h2>
      <p className="text-black text-lg">Enter booking details and save them.</p>
    </div>
    <div className="flex justify-end">
      <Link to="/bookings" className="bg-red-500 text-white p-2">
        <button><CloseIcon /></button>
      </Link>
    </div>
  </div>
)}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 overflow-auto" style={{padding:'14px'}}>
        {/* Customer Details */}
       
        <h2 className="text-xl font-bold">Customer Details</h2>
        <div>
          <div className="grid grid-cols-3 gap-3 border border-gray-300 shadow-md rounded-xl" style={{ padding: '10px' }}>
            <div className="flex flex-col">
              <label>Customer Name</label>
              <select
                className="border rounded-md"
                style={{ padding: '14px 8px' }}
                {...register('customerdtls.name', { required: true })}
                onChange={(e) => handleVendorSelection(e.target.value, 'customerdtls')}
              >
                <option value="" disabled>Select Customer</option>
                {customers.map(party => (
                  <option key={party.id} value={party.name}>{party.name}</option>
                ))}
              </select>
              {errors.customerdtls?.name && (
                <span className="text-red-500 text-xs">Customer is required</span>
              )}
            </div>
            <div>
              <label>Address</label>
              <input {...register('customerdtls.address')} readOnly className="w-full p-2 border rounded" />
            </div>
            <div>
              <label>PIN Code</label>
              <input {...register('customerdtls.stateCode')} readOnly className="w-full p-2 border rounded" />
            </div>
            <div>
              <label>City</label>
              <input {...register('customerdtls.city')} readOnly className="w-full p-2 border rounded" />
            </div>
            <div>
              <label>Pan</label>
              <input {...register('customerdtls.pan')} readOnly className="w-full p-2 border rounded" />
            </div>
            <div>
              <label>Email</label>
              <input {...register('customerdtls.email')} readOnly className="w-full p-2 border rounded" />
            </div>
            <div>
              <label>Phone</label>
              <input {...register('customerdtls.phone')} readOnly className="w-full p-2 border rounded" />
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <h2 className="text-xl font-bold mt-4" style={{ marginTop: '10px' }}>Booking Details</h2>
        <div className="grid grid-cols-3 gap-3 border border-gray-300 shadow-md rounded-xl" style={{ padding: '10px' }}>

        <div>
        <label className="block mb-1">Booking Type</label>
        <select {...register('bookingType')} className="w-full p-2 border rounded">
        <option value="">Select Booking Type</option>
        <option value="Full Package">Full Package</option>
        <option value="Flight">Flight</option>
        </select>
        </div>
          <div>
            <label>Booking ID</label>
            <input {...register('bookingId')} readOnly className="w-full p-2 border rounded" />
          </div>

          <div>
            <label>Booking Date</label>
            <input {...register('invoiceDate')} type="date" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label>Starting Date</label>
            <input {...register('startdate')} type="date" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label>Ending Date</label>
            <input {...register('enddate')} type="date" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label>Advance Payment</label>
            <input {...register('adv')} type="number" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label>Package Name</label>
            <input {...register('pkgName')} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label>Package Price</label>
            <input {...register('pkgPrice')} type="number" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label>Discount</label>
            <input {...register('discount')} type="number" className="w-full p-2 border rounded" />
          </div>
          <div>
         <label>Total Amount</label>
         <input
         {...register('toPay')}
        type="number"
        readOnly
        className="w-full p-2 border rounded bg-gray-100"
        />
       </div>
        <div>
            <label>Booked By</label>
            <input {...register('bookedBy')} className="w-full p-2 border rounded" />
          </div>
        </div>

        {/* Item Tables */}
        <h2 className="text-xl font-bold mt-4" style={{ marginTop: '10px' }}>Item Details</h2>
        <div className="space-y-6">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenAddModal(true)}
            disabled={isLoadingStockItems}
          >
            Add Item
          </Button>
          {itemFields.map((item, itemIndex) => renderItemTable(item, itemIndex))}
        </div>

        {/* Add Item Modal */}
        <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: 4,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>Add New Item</Typography>
            <select
              value={selectedItemId}
              onChange={handleItemSelection}
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>Select Item</option>
              {stockItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.type})
                </option>
              ))}
            </select>
            <Box sx={{ mt: 3, textAlign: 'right' }}>
              <Button variant="contained" color="primary" onClick={handleAddItem}>
                Add Item
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Submit Button */}
        <div className="h-20 flex items-center justify-end">
          <button
    type="submit"
    style={{ padding: '8px', backgroundColor: '#005899', color: 'white' }}
    className="rounded-lg hover:bg-[#2e7bbf]"
  >
    {editMode ? 'Update Booking' : 'Save Booking Invoice'}
  </button>
        </div>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
/* <div className="form-container bg-gradient-to-b from-gray-50 to-white mt-2 w-[75vw] rounded-xl shadow-lg h-[85vh] overflow-hidden">
      {!editMode && (
        <div
          className="flex items-center justify-between w-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-xl"
          style={{ padding: "20px 30px" }}
        >
          <div className="flex flex-col items-start justify-center">
            <h2 className="text-2xl font-bold text-white">Create Booking Invoice</h2>
            <p className="text-white/80 text-base">Enter booking details and save them.</p>
          </div>
          <div className="flex justify-end">
            <Link
              href="/bookings"
              className="bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
              style={{ padding: "10px" }}
            >
              <button>
                <CloseIcon />
              </button>
            </Link>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="overflow-auto h-[calc(85vh-80px)]"
        style={{ padding: "20px 30px" }}
      >
      
        <div style={{ marginBottom: "24px" }}>
          <h2 className="text-xl font-bold text-gray-800 flex items-center" style={{ marginBottom: "12px" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Customer Details
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-xl bg-white shadow-sm"
            style={{ padding: "20px" }}
          >
            <div className="flex flex-col">
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                Customer Name <span className="text-red-500">*</span>
              </label>
              <select
                className="border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                style={{ padding: "12px 14px" }}
                {...register("customerdtls.name", { required: true })}
                onChange={(e) => handleVendorSelection(e.target.value, "customerdtls")}
              >
                <option value="" disabled>
                  Select Customer
                </option>
                {customers.map((party) => (
                  <option key={party.id} value={party.name}>
                    {party.name}
                  </option>
                ))}
              </select>
              {errors.customerdtls?.name && (
                <span className="text-red-500 text-xs" style={{ marginTop: "4px" }}>
                  Customer is required
                </span>
              )}
            </div>
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                Address
              </label>
              <input
                {...register("customerdtls.address")}
                readOnly
                className="w-full border border-gray-300 rounded-lg bg-gray-50"
                style={{ padding: "12px 14px" }}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                PIN Code
              </label>
              <input
                {...register("customerdtls.stateCode")}
                readOnly
                className="w-full border border-gray-300 rounded-lg bg-gray-50"
                style={{ padding: "12px 14px" }}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                City
              </label>
              <input
                {...register("customerdtls.city")}
                readOnly
                className="w-full border border-gray-300 rounded-lg bg-gray-50"
                style={{ padding: "12px 14px" }}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                Pan
              </label>
              <input
                {...register("customerdtls.pan")}
                readOnly
                className="w-full border border-gray-300 rounded-lg bg-gray-50"
                style={{ padding: "12px 14px" }}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                Email
              </label>
              <input
                {...register("customerdtls.email")}
                readOnly
                className="w-full border border-gray-300 rounded-lg bg-gray-50"
                style={{ padding: "12px 14px" }}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                Phone
              </label>
              <input
                {...register("customerdtls.phone")}
                readOnly
                className="w-full border border-gray-300 rounded-lg bg-gray-50"
                style={{ padding: "12px 14px" }}
              />
            </div>
          </div>
        </div>

       
        <div style={{ marginBottom: "24px" }}>
          <h2 className="text-xl font-bold text-gray-800 flex items-center" style={{ marginBottom: "12px" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            Booking Details
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-xl bg-white shadow-sm"
            style={{ padding: "20px" }}
          >
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                Booking Type
              </label>
              <select
                {...register("bookingType")}
                className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                style={{ padding: "12px 14px" }}
              >
                <option value="">Select Booking Type</option>
                <option value="Full Package">Full Package</option>
                <option value="Flight">Flight</option>
              </select>
            </div>
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                Booking ID
              </label>
              <input
                {...register("bookingId")}
                readOnly
                className="w-full border border-gray-300 rounded-lg bg-gray-50"
                style={{ padding: "12px 14px" }}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                Booking Date
              </label>
              <div className="relative">
                <input
                  {...register("invoiceDate")}
                  type="date"
                  className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ padding: "12px 14px" }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                Starting Date
              </label>
              <div className="relative">
                <input
                  {...register("startdate")}
                  type="date"
                  className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ padding: "12px 14px" }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                Ending Date
              </label>
              <div className="relative">
                <input
                  {...register("enddate")}
                  type="date"
                  className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ padding: "12px 14px" }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                Advance Payment
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  {...register("adv")}
                  type="number"
                  className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                  style={{ padding: "12px 14px" }}
                />
              </div>
            </div>
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                Package Name
              </label>
              <input
                {...register("pkgName")}
                className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ padding: "12px 14px" }}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                Package Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  {...register("pkgPrice")}
                  type="number"
                  className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                  style={{ padding: "12px 14px" }}
                />
              </div>
            </div>
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                Discount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  {...register("discount")}
                  type="number"
                  className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                  style={{ padding: "12px 14px" }}
                />
              </div>
            </div>
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                Total Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  {...register("toPay")}
                  type="number"
                  readOnly
                  className="w-full border border-gray-300 rounded-lg bg-blue-50 font-medium text-blue-800 pl-8"
                  style={{ padding: "12px 14px" }}
                />
              </div>
            </div>
            <div>
              <label className="font-medium text-gray-700" style={{ marginBottom: "8px" }}>
                Booked By
              </label>
              <input
                {...register("bookedBy")}
                className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ padding: "12px 14px" }}
              />
            </div>
          </div>
        </div>

   
        <div style={{ marginBottom: "24px" }}>
          <h2 className="text-xl font-bold text-gray-800 flex items-center" style={{ marginBottom: "12px" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
            Item Details
          </h2>
          <div className="space-y-4 border border-gray-200 rounded-xl bg-white shadow-sm" style={{ padding: "20px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenAddModal(true)}
              disabled={isLoadingStockItems}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              style={{ padding: "10px 16px", textTransform: "none" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Item
            </Button>
            <div className="mt-4">{itemFields.map((item, itemIndex) => renderItemTable(item, itemIndex))}</div>
          </div>
        </div>

      
        <div className="flex items-center justify-end" style={{ padding: "16px 0", marginTop: "16px" }}>
          <button
            type="submit"
            className="rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md flex items-center"
            style={{ padding: "12px 24px", backgroundColor: "#0b80d3", color: "white" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {editMode ? "Update Booking" : "Save Booking Invoice"}
          </button>
        </div>
      </form>

      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Item
          </Typography>
          <select
            value={selectedItemId}
            onChange={(e) => {
              handleItemSelection(e.target.value)
              setSelectedItemId(e.target.value)
            }}
            className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            style={{ padding: "12px 14px", marginTop: "10px", marginBottom: "20px" }}
          >
            <option value="" disabled>
              Select Item
            </option>
            {stockItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.type})
              </option>
            ))}
          </select>
          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddItem}
              className="rounded-lg"
              style={{ textTransform: "none", padding: "8px 16px" }}
            >
              Add Item
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "8px" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div> */
  );
};

export default InvoiceForm;