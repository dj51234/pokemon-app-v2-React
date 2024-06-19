const firebaseErrorMessages = {
    'auth/email-already-in-use': 'This email address is already in use.',
    'auth/invalid-email': 'The email address is not valid.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
    'auth/weak-password': 'The password is too weak.',
    'auth/user-disabled': 'The user account has been disabled.',
    'auth/user-not-found': 'There is no user corresponding to this email.',
    'auth/wrong-password': 'The password is incorrect.',
    'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
    'auth/requires-recent-login': 'Please log in again to perform this operation.',
    'auth/email-already-exists': 'This email address is already registered.',
    'auth/invalid-password': 'The password is not valid. It must be at least 6 characters long.',
    'auth/internal-error': 'An internal error has occurred. Please try again.',
    'auth/claims-too-large': 'The claims payload provided exceeds the maximum allowed size of 1000 bytes.',
    'auth/id-token-expired': 'The provided Firebase ID token is expired.',
    'auth/id-token-revoked': 'The Firebase ID token has been revoked.',
    'auth/insufficient-permission': 'The credential used to initialize the Admin SDK has insufficient permission.',
    'auth/invalid-argument': 'An invalid argument was provided.',
    'auth/invalid-claims': 'The custom claim attributes provided are invalid.',
    'auth/invalid-continue-uri': 'The continue URL must be a valid URL string.',
    'auth/invalid-creation-time': 'The creation time must be a valid UTC date string.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/invalid-disabled-field': 'The provided value for the disabled user property is invalid.',
    'auth/invalid-display-name': 'The provided value for the display name is invalid.',
    'auth/invalid-dynamic-link-domain': 'The provided dynamic link domain is not configured.',
    'auth/invalid-email-verified': 'The provided value for the email verified property is invalid.',
    'auth/invalid-hash-algorithm': 'The hash algorithm must match one of the supported algorithms.',
    'auth/invalid-hash-block-size': 'The hash block size must be a valid number.',
    'auth/invalid-hash-derived-key-length': 'The hash derived key length must be a valid number.',
    'auth/invalid-hash-key': 'The hash key must be a valid byte buffer.',
    'auth/invalid-hash-memory-cost': 'The hash memory cost must be a valid number.',
    'auth/invalid-hash-parallelization': 'The hash parallelization must be a valid number.',
    'auth/invalid-hash-rounds': 'The hash rounds must be a valid number.',
    'auth/invalid-hash-salt-separator': 'The hashing algorithm salt separator field must be a valid byte buffer.',
    'auth/invalid-id-token': 'The provided ID token is not a valid Firebase ID token.',
    'auth/invalid-last-sign-in-time': 'The last sign-in time must be a valid UTC date string.',
    'auth/invalid-page-token': 'The provided next page token in listUsers() is invalid.',
    'auth/invalid-password-hash': 'The password hash must be a valid byte buffer.',
    'auth/invalid-password-salt': 'The password salt must be a valid byte buffer.',
    'auth/invalid-phone-number': 'The provided value for the phone number is invalid.',
    'auth/invalid-photo-url': 'The provided value for the photo URL is invalid.',
    'auth/invalid-provider-data': 'The provider data must be a valid array of UserInfo objects.',
    'auth/invalid-provider-id': 'The provider ID must be a valid supported provider identifier string.',
    'auth/invalid-oauth-responsetype': 'Only exactly one OAuth responseType should be set to true.',
    'auth/invalid-session-cookie-duration': 'The session cookie duration must be a valid number.',
    'auth/invalid-uid': 'The provided UID must be a non-empty string.',
    'auth/invalid-user-import': 'The user record to import is invalid.',
    'auth/maximum-user-count-exceeded': 'The maximum allowed number of users to import has been exceeded.',
    'auth/missing-android-pkg-name': 'An Android Package Name must be provided if the Android App is required to be installed.',
    'auth/missing-continue-uri': 'A valid continue URL must be provided in the request.',
    'auth/missing-hash-algorithm': 'Importing users with password hashes requires the hashing algorithm and its parameters.',
    'auth/missing-ios-bundle-id': 'The request is missing a Bundle ID.',
    'auth/missing-uid': 'A UID identifier is required for the current operation.',
    'auth/missing-oauth-client-secret': 'The OAuth configuration client secret is required to enable OIDC code flow.',
    'auth/operation-not-allowed': 'The provided sign-in provider is disabled for your Firebase project.',
    'auth/phone-number-already-exists': 'The provided phone number is already in use.',
    'auth/project-not-found': 'No Firebase project was found for the credential used.',
    'auth/reserved-claims': 'One or more custom user claims provided are reserved.',
    'auth/session-cookie-expired': 'The provided Firebase session cookie is expired.',
    'auth/session-cookie-revoked': 'The Firebase session cookie has been revoked.',
    'auth/too-many-requests': 'The number of requests exceeds the maximum allowed.',
    'auth/uid-already-exists': 'The provided UID is already in use.',
    'auth/unauthorized-continue-uri': 'The domain of the continue URL is not whitelisted.',
    'auth/user-not-found': 'There is no existing user record corresponding to the provided identifier.',
  };
  
  export default function getErrorMessage(errorCode) {
    return firebaseErrorMessages[errorCode] || 'An unknown error occurred. Please try again.';
  }
  