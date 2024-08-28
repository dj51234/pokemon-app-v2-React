// FILE PATH: src/js/firebaseFunctions.js

import { firestore } from './firebase'; // Import the initialized Firestore instance
import { doc, getDoc } from 'firebase/firestore';

/**
 * Function to fetch user data from Firestore and log it to the console.
 * 
 * @param {string} userId - The ID of the user whose data you want to fetch.
 */
const fetchUserData = async (userId) => {
  try {
    // Reference to the user's document in Firestore
    const userDocRef = doc(firestore, 'users', userId);

    // Fetch the document
    const userDocSnap = await getDoc(userDocRef);

    // Check if the document exists
    if (userDocSnap.exists()) {
      // Log the data to the console
      console.log('User Data:', userDocSnap.data());
    } else {
      console.log('No such user!');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

fetchUserData('4BnDaqg0K7CPdQq7UvJf9QI9dpTG');
