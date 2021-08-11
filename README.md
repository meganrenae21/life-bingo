# Your Best Self Bingo
![logo](build/icon.ico)

 *BINGO to help you achieve your goals.*

 ## Contents
 - [Installation and Startup](#Installation-and-Startup)
 - [How to Play](#HowtoPlay)
   - [Getting Started](#Getting-Started)
   - [Lists and Tasks](#Lists-and-Tasks)
   - [Active Lists](#Active-Lists)
   - [Cards](#Cards)
     - [Saving Your Card](#Saving-Your-Card)
     - [Retrieving Your Card](#Retrieving-Your-Card)
   - [Getting a Bingo](#Getting-a-Bingo)
   - [Blackouts](#Blackouts)
 - [Development](#Development)
   - [Current Version](#Current-Version)
   - [Changelog](#Changelog)
 - [More Information](#More-Information)
   - [Your Best Self website](#Your-Best-Self-website)
   - [Blog](#Blog)
  
  ## Installation and Startup

  Currently only [npm](https://www.npmjs.com/) is supported. Node.js is required. To see if you have Node and npm installed, type the following lines in your terminal:

  ```
  node -v
  npm -v
  ```

  This will tell you the versions of Node.js and npm your system is currently running, if they are installed. If not already installed, you can download the appropriate [Node.js installer](https://nodejs.org/en/download/) for your operating system. Make sure to download from the LTS tab, as these versions have been tested with npm. 

  If you install Node this way, npm will come prepackaged with it, so no separate installation is necessary. Navigate to your desired path in the terminal, then run:

  ```
  git clone https://github.com/meganrenae21/life-bingo.git
  cd life-bingo
  npm install
  npm start
  ```

  If you are unfamiliar with how to navigate the file system via the terminal, you can refer to this quick little crash course from [Codecademy](https://www.codecademy.com/learn/learn-the-command-line/modules/learn-the-command-line-navigation). 
  ## How to Play

  YBS Bingo has three core data types: _tasks_, _lists_, and _cards_. 

  Each space on the bingo card is filled with a _task_, and _tasks_ are entered in _lists_. _Cards_ are generated from selected _lists_. 

  For example, if **Carol**, **Kathy**, and **Layla** wanted to make cards using separate to do lists, you could create a list for each of them, adding their to dos in their specific lists. That may end up looking like this:

  **Carol**
  - Walk the dog
  - Buy groceries

  **Kathy**
  - Feed cats
  - Finish report for boss

  **Layla**
  - Do math homework
  - Make bed

  Once a list has at least 24 tasks, you can generate a bingo card using tasks in that list. In this case, you could create separate cards for Layla, Carol, and Kathy. You can also *combine* lists to create a card (for instance, if you wanted to create separate lists for work-related tasks and personal tasks but wanted both types of tasks on one card), as long as there are 24 tasks _total_ on all the lists you are generating the card from. 

  The following sections will go into more detail about how to create and modify cards, tasks, and lists. 

  ### Getting Started

  When you open the app, you will see a 5x5 grid, with each grid space labeled by its position (B1, B2, etc.). The Free space at the center of the grid is in a selected position. The other spaces are not selected, and while you can hover over them, you'll notice that if you click on them, nothing happens. Before you can do anything, you need to set up your card, which is done using the top menu. 
  ### Lists and Tasks

  Before you can add tasks to be added to the card, you need to create a list to add tasks to. You will be unable to add any tasks if you don't have a list to associate them with. 

  Click the "New List" button to create a new list. Give the list a descriptive title. You also have the option to add tags to your list, for further organization. This is not required. 

  Once you've created a list, click save. You can create as many lists as you want. When you are ready to start adding tasks, exit the New List module and click "Add Tasks" on the top menu. 

  This is pretty intuitive -- just select the list you'd like to add a task to, write down the task, click save, then repeat as often as you need. Remember, you'll need at least 24 tasks total to generate a card -- they don't all have to be from the same list. 

  If click on "View Lists", a modal will open up showing all of your lists. Click on one to view all of the tasks within that list. You can also delete tasks from here.
  ### Active Lists

  After you've entered your tasks, there's one more step to take before you can generate a card -- setting your active lists.

  This is in the "Options" menu. You'll see a checklist of all of your lists. Check each list whose tasks you want to generate your card from. As mentioned, you'll need at least 24 tasks total between all of yuor active lists to create a card. Also note that if you have _more_ than 24 tasks, not all of your tasks will appear on your card. 
  ### Cards

  #### Saving Your Card

  #### Retrieving Your Card

  ### Getting a Bingo

  ### Blackouts

  ## Development

  ### Current Version

  ### Changelog

  ## More Information

  ### Your Best Self website
  link here

  ### Blog
  link here