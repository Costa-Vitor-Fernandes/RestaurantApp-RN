# RestaurantApp-RN-Pesto

This is my first fully designed project. I had the inspiration when my family started a small restaurant business last year, and after I saw their difficulties with organizing the orders with poorly designed apps avaiable on the play store. So the UI is written in Portuguese, but most of the code is written in english.

It follows the client-server archtechture, and this repo is representing the client side. You can check out the [server repo HERE](https://github.com/Costa-Vitor-Fernandes/restaurant-app-server/)

This app(front-end) uses :
- React Native (Expo/Expo Web)
- React Navigation
- Axios
- Picker
- Vercel(hosting service)

You can test it out ! Use "admin" "admin" as username and password respectively.

The main features of this app are:
- jwt and bcrypt login on server-side
- add, delete and alter products
- open and closed orders tab, to maintain control
- take orders by name or table number
- open a table order with a product with amount 0(when the client sits on the table and is still picking what to order)
- delete an order by id that is still open
- create new users
- access to all orders open and closed in one tab
- export all data to excel spreadsheets

Feel free to get copy and contribute, everything i learned till now have been through free platforms like Youtube, freeCodeCamp, Google/StackOverflow and official documentation.
