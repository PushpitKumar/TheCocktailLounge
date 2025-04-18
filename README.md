# The Cocktail Lounge

## Table of Contents
<ol>
<li>Project Overview</li>
<br/>
<li>Solution Summary</li>
<br/>
<ul>
  <li>2.1 Scope</li>
  <li>2.2 Assumptions</li>
  <li>2.3 Dependencies</li>
</ul>
<br/>
<li>System Design</li>
<br/>
<ul>
<li>3.1 Proposed Design</li>
</ul>
<br/>
</ul>
<br/>
<li>App Implementation</li>
<br/>
<li>Drawbacks and Future Scope</li>
</ol>

### 1. Project Overview
The Cocktail Lounge is place for cocktail enthusiasts to explore a wide assortment of drinks, know various ingredients that are used to prepare their favorite beverages and understand how to prepare and serve drinks.

This Web-Application is built using Node and Express JS utiizing EJS templates and allows users to browse through different type of drinks. They can filter drinks based on their preferences, be it alcoholic, non-alcoholic, and much more. Users can also search for any specific drink from the search bar provided. Users can know more details about a particular drink by clicking on it. To make the App more secure, user authentication and authorization could be added so that users can login,  add comments, give ratings and reviews, thereby increasing interaction. Drinks displayed as cards on the homepage.

### 2. Solution Summary

#### 2.1 Scope
The scope of this Cocktail Web-Application encompasses the development of a comprehensive application using Node and Express JS. This project aims to create a central hub for Cocktail Lovers. The application will provide a range of features and functionalities to enhance user experience.

The project scope includes the following aspects:

#### 1. Explore Drinks
* A powerful filter is provided.
* Lookup drinks based on name, alcoholic/non-alcoholic, etc.

#### 2. Learn more details about a drink
* Want to know more about a drink? Just click on the card.
* Access addtional info like key ingredients used and preparation method.

#### 3. Drink of the Day
* Every day a new special drink is displayed 
* The drink is selected at random for a day's menu

#### 4. Search Beverages
* Search for any specific drink using the search bar
* A list of valid results would be displayed

#### 5. Send Message/Email
* Users can send message (email) from the contact section
* No authentication needed

#### 7. Frontend Application Development
* User-Friendly and interactive interface for people to interact with the app
* Responsive for all screen sizes

#### 2.2 Assumptions
* The data coming from CocktailDB is correct.
* The application runs smoothly in a production environment and is able to handle high loads and scale as per requirement
* Data is refreshed every 1 hour.

#### 2.3 Dependencies

1. **Backend Framework**: The development of this blog application requires a suitable backend framework like Node and Express JS. The framework provides the necessary tools and libraries to handle data processing, business logic, and integration with the database.

2. **Frontend Technologies**: The frontend of the system relies on web technologies like HTML, CSS, and JavaScript, Bootstrap, jQuery, etc. to create a responsive user-friendly interface. All the UI views are written and rendered using powerful EJS templates for a dynamic interaction with the backend.

3. **Development Tool and IDE**: The development of this blog application relies on tools and integrated development environments (IDEs) like Visual Studio Code, or JetBrains Rider, which provide necessary features for coding, debugging, and project management. Visual Studio Code was selected as the ideal choice.

### 3. System Design

#### 3.1 Proposed Design

This is a Cocktails Repository Application, hence it is a multi-user system. At the moment there are few views that are used to render the content based on the functionality. The different views that user can interact within the system are:

* Home Page containing all beverages in card format
* Search any specific drink
* Contact section for sending messages as email
* About section 

### 4. App Implementation
<img width="949" alt="1" src="https://github.com/user-attachments/assets/0450ce80-5ff5-4851-9192-f9809213912a" />
<img width="950" alt="2" src="https://github.com/user-attachments/assets/ef6450f8-87ef-4906-9167-d3e56a22d7b0" />
<img width="950" alt="3" src="https://github.com/user-attachments/assets/047ba135-a15c-4fb1-9db0-a7ad0f251753)" />
<img width="946" alt="4" src="https://github.com/user-attachments/assets/b3a75c6a-e7ef-4022-96f7-d6a21e8aca37" />
<img width="950" alt="5" src="https://github.com/user-attachments/assets/1cf666c6-7101-414e-ae4d-b5f8f4469ee1" />
<img width="950" alt="6" src="https://github.com/user-attachments/assets/6ddd4e1f-5e76-4011-8443-c851103035ee" />
<img width="946" alt="7" src="https://github.com/user-attachments/assets/cbcf7c72-cafc-4cb1-bdae-ac738c014642" />
<img width="932" alt="8" src="https://github.com/user-attachments/assets/2adf323c-c830-48b2-8750-29baa173cf6a" />

### 5. DrawBacks and Future Scope

* No Database has been implemented to store the drink/user details, essentially deleting all information once the server is shut down. In future, database integration is necessary to have persistent data
* User Authentication and Authorization can be implemented to enhance the app's security
* Application's engagmenent could be significantly increased by allowing authenticated users to like/comment, rate/review drinks.
