
# MasterSet

<p align="center" width="100%">
<video src="https://github.com/user-attachments/assets/25f1f786-f745-496d-92c2-8ff98f3b0c8f" width="80%" controls></video>
</p>

## Overview

This app allows users to open packs and collect Pokémon cards in their profile. It currently features a hero page and a main browse page where users can search for Pokémon sets or specific Pokémon. The app aims to provide a comprehensive and engaging experience for Pokémon card collectors.

## Current Features

- Hero page with an engaging introduction to the app
- Browse page with search functionality for Pokémon sets and individual Pokémon
- Recommendations for closest Pokémon matches in case of misspellings
- Toggle between searching for sets and Pokémon
- Display of Pokémon cards with holographic effects
- Card Tilting interaction, explosion effects for rare cards
- Pack opening simulation in real life (cards are flipped over in a deck of 10, deck is flipped over, user goes through each card one by one)
- Profile page with Binder, Wishlist, favorite sets, card/set search and Pack Opening simulation

## To-Do List

### Critical Tasks

1. **Re-evaluate Holographic Cards**
   - Ensure that the app accurately identifies which cards are actually holographic. Currently, all promo cards show up as holo, but not all of them are holo.
   - Implement a more accurate method for determining holographic status.

2. **Add Autocomplete for Pokémon Search**
   - Implement an autocomplete feature for the Pokémon search field to provide suggestions as users type.
   - Ensure the autocomplete does not affect the set search functionality.

3. **Profile and Collection Management**
   - Implement user profiles where users can save and manage their card collections.
   - Allow users to track their collection progress and see which cards they are missing.

4. **Pack Opening Simulation**
   - Develop a feature where users can simulate opening packs and add cards to their collection.
   - Include animations and sound effects to enhance the experience.

5. **Trading System**
   - Create a system that allows users to trade cards with each other.
   - Implement a secure and fair trading mechanism.

6. **Card Details and Statistics**
   - Provide detailed information and statistics for each card, such as rarity, type, and set.
   - Include high-resolution images and backstory for each card.

7. **User Interface Enhancements**
   - Improve the overall UI/UX design to make the app more user-friendly and visually appealing.
   - Ensure the app is responsive and works well on various devices.

8. **Performance Optimization**
   - Optimize the app for faster loading times and smoother performance.
   - Minimize the number of API calls and efficiently manage data fetching.

9. **Testing and Bug Fixes**
   - Conduct thorough testing to identify and fix bugs.
   - Implement unit tests and end-to-end tests to ensure the app's reliability and stability.

10. **Documentation and Tutorials**
    - Create comprehensive documentation for the app, including usage guides and API references.
    - Develop tutorials and help sections to assist users in navigating and using the app effectively.

## Installation and Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/pokemon-card-app.git
2. Install dependencies:
   ```sh
   cd pokemon-card-app
   npm install
3. Set up environment variables:
   - Create a .env file in the root directory.
   - Add your Pokémon TCG API key to the .env file (you can sign up for one [**HERE**](https://dev.pokemontcg.io/)):
   ```sh
   REACT_APP_API_KEY=your_api_key_here
4. Start local server for API calls
   ```sh
   node server.js
5. Run the app:
   ```sh
   npm start
## Contribution Guidelines
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with descriptive messages.
4. Push your branch to your forked repository.
5. Create a pull request to the main repository.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License.

### Summary

You are free to:

- **Share** — copy and redistribute the material in any medium or format

Under the following terms:

- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- **NonCommercial** — You may not use the material for commercial purposes.
- **NoDerivatives** — If you remix, transform, or build upon the material, you may not distribute the modified material.

View the full license [here](https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode).




